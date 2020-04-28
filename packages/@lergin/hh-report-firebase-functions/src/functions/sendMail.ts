import { database, storage } from 'firebase-admin'
import * as functions from 'firebase-functions'
import fetch from 'node-fetch'
import FormData from 'form-data'
import {
  ImageData,
  ReporterData,
} from "@lergin/hh-report-common";
import { mailTemplate } from '../MailText';

async function getAccessToken (userId: string) {
  const refreshToken = (await database().ref('users').child(userId).child('data').child('refresh_token').once('value')).val()

  const formData = new FormData()
  formData.append('client_id', functions.config().google.auth.client_id)
  formData.append('client_secret', functions.config().google.auth.client_secret)
  formData.append('refresh_token', refreshToken)
  formData.append('grant_type', 'refresh_token')

  const { access_token: accessToken } = await fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'POST',
    body: formData
  }).then(res => res.json())

  return accessToken
}

export const sendMail = functions.region('europe-west1').database.ref('/users/{userId}/images/{id}/send').onCreate(async (change, context) => {
  const db = database()
  const ref = change.ref.parent
  const imageData: ImageData = (await ref.once('value')).val()
  const reporterDataRef = db.ref('users').child(context.params.userId).child('data')
  const reporterData: ReporterData = (await reporterDataRef.once('value')).val()
  const bucket = storage().bucket('falschparker')
  const file = bucket.file(imageData.filePath)
  const metaData = (await file.getMetadata())[0]
  const fileContentType = metaData.contentType
  const fileName = metaData.name
  const fileBuffer = (await file.download())[0]

  try {
    const mailOptions = {
      ...imageData,
      mailTo: reporterData.mailTo,
      reporterAddress: reporterData.address,
      reporterName: reporterData.name,
      fileContentType,
      fileName,
      file: fileBuffer,
    };

    console.log(mailOptions)
    const mail = await fetch(
      "https://www.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=media",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await getAccessToken(
            context.params.userId
          )}`,
          "Content-Type": "message/rfc822",
        },
        body: await mailTemplate(mailOptions),
      }
    ).then((a) => a.json());

    console.log(mail)
    await change.ref.parent.child('mailId').set(mail.id)
  } catch (err) {
    console.log(err)
    await change.ref.remove()
  }
})
