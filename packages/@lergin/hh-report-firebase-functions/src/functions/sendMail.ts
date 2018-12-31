import { database, storage } from 'firebase-admin'
import { config, database as databaseFunctions } from 'firebase-functions'
import fetch from 'node-fetch'
import * as FormData from 'form-data'
import { ImageData, ReporterData } from '@lergin/hh-report-common'

type MailTemplateOptions = ImageData & {
  mailTo: string;
  reporterName: string;
  reporterAddress: string;
  fileContentType: string;
  fileName: string;
  fileBase64: string;
}

function mailTemplate ({
  mailTo,
  date: timestamp,
  address,
  loc: {
    lat,
    lon
  },
  plate,
  endangering,
  parking,
  intend,
  intendReason,
  where,
  reporterName,
  reporterAddress,
  fileContentType,
  fileName,
  fileBase64
}: MailTemplateOptions): string {
  const date = new Date(timestamp * 1000)

  return `To: <${mailTo}>
Subject: ${plate} - ${date.toISOString().substr(0, 10)}
Content-Type: multipart/mixed;boundary=92ckNGfS

--92ckNGfS
Content-Type: text/plain;charset=utf-8

Tattag: ${date.toLocaleDateString('de-DE')}
Tatzeit: ${date.toLocaleTimeString('de-DE').substr(0, 5)}
Tatort: ${address} (${convertDecimalLocationToStr(lat)}N ${convertDecimalLocationToStr(lon)}E)
Kfz-Kennzeichen: ${plate}
genauer Tatvorwurf: Unzulässiges ${parking ? 'Parken' : 'Halten'} (${where})${endangering ? ' mit Gefährdung' : ''}${endangering && intend ? ' und' : ''}${intend ? ` mit Vorsatz (${intendReason.trim()})` : ''}
Name und Anschrift des Anzeigenden: ${reporterName}, ${reporterAddress}

--92ckNGfS
Content-Type: ${fileContentType};
Content-Transfer-Encoding: base64
Content-Disposition: attachment ;filename="${fileName}"

${fileBase64}
--92ckNGfS--`
}

function convertDecimalLocationToStr (value): string {
  const sign = value < 0 ? -1 : 1

  const abs = Math.abs(Math.round(value * 1000000))

  const dec = (abs % 1000000) / 1000000

  const deg = Math.floor(abs / 1000000) * sign
  const min = Math.floor(dec * 60)
  const sec = (dec - min / 60) * 3600

  return `${deg}°${min}'${Math.round(sec)}"`
}

async function getAccessToken (userId: string) {
  const refreshToken = (await database().ref('users').child(userId).child('data').child('refresh_token').once('value')).val()

  const formData = new FormData()
  formData.append('client_id', config().google.auth.client_id)
  formData.append('client_secret', config().google.auth.client_secret)
  formData.append('refresh_token', refreshToken)
  formData.append('grant_type', 'refresh_token')

  const { access_token: accessToken } = await fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'POST',
    body: formData
  }).then(res => res.json())

  return accessToken
}

export const sendMail = databaseFunctions.ref('/users/{userId}/images/{id}/send').onCreate(async (change, context) => {
  const db = database()
  const ref = change.ref.parent
  const imageData: ImageData = (await ref.once('value')).val()
  const reporterDataRef = db.ref('users').child(context.params.userId).child('data')
  const reporterData: ReporterData = (await reporterDataRef.once('value')).val()
  const bucket = storage().bucket()
  const file = bucket.file(imageData.filePath)
  const metaData = (await file.getMetadata())[0]
  const fileContentType = metaData.contentType
  const fileName = metaData.name
  const fileBuffer = (await file.download())[0]
  const fileBase64 = fileBuffer.toString('base64')

  try {
    const mail = await fetch(
      'https://www.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=media',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await getAccessToken(context.params.userId)}`,
          'Content-Type': 'message/rfc822'
        },
        body: mailTemplate({
          ...imageData,
          mailTo: reporterData.mailTo,
          reporterAddress: reporterData.address,
          reporterName: reporterData.name,
          fileContentType,
          fileName,
          fileBase64
        })
      }
    ).then(a => a.json())

    console.log(mail)
    await change.ref.parent.child('mailId').set(mail.id)
  } catch (err) {
    console.log(err)
    await change.ref.remove()
  }
})
