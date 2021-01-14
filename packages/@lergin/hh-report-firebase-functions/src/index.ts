import * as admin from "firebase-admin";
import "firebase-functions";
admin.initializeApp();

export { geoCoding } from "./functions/geoCoding";
export { sendMail } from "./functions/sendMail";
export { generateRefreshToken } from "./functions/generateRefreshToken";
export { createThumbnail } from "./functions/createThumbnail";
export { extractExifData } from "./functions/extractExifData";
export { extractPlate } from "./functions/extractPlate";
