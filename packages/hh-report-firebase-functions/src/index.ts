import { initializeApp } from 'firebase-admin'
import { config } from 'firebase-functions'

config()
initializeApp()

export { geoCoding } from './functions/geoCoding'
export { imageData } from './functions/imageData'
export { sendMail } from './functions/sendMail'
