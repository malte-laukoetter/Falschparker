import { auth, storage } from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'

export async function uploadImage(file: File) {
  if (!auth().currentUser) {
    throw new Error('USER_NOT_AUTHENTICATED')
  }

  // Save the image on Cloud Storage.
  const filePath = file.name

  try {
    const user = auth().currentUser

    if (!user) return

    const metadata: storage.UploadMetadata = {
      contentType: file.type,
      customMetadata: {
        user: user.uid
      }
    }

    const snapshot = await storage().ref('images').child(user.uid).child(filePath).put(file, metadata)
    console.log('Uploaded', snapshot.totalBytes, 'bytes.')
  } catch (error) {
    console.error('Upload failed:', error)
  }
}