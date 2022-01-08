import * as ExifParser from "exif-parser";
import { storage } from "firebase-admin";
import * as functions from "firebase-functions";
import { ImageData } from "../../lib/ImageData";
import { getImageId, getImageRef, shouldRunForFile } from "../utils";

function parseExifData(fileBuffer: Buffer): ImageData {
  const parser = ExifParser.create(fileBuffer);
  const result = parser.parse();
  const lat: number = result.tags.GPSLatitude || 0;
  const lon: number = result.tags.GPSLongitude || 0;
  const date: number = result.tags.CreateDate || result.tags.ModifyDate || 0;

  return {
    loc: {
      lat,
      lon,
    },
    date
  };
}

export const extractExifData = functions
  .runWith({
    timeoutSeconds: 120,
    memory: "512MB",
  })
  .region("europe-west1")
  .storage.bucket("falschparker")
  .object()
  .onFinalize(async (object: functions.storage.ObjectMetadata) => {
    if (!shouldRunForFile(object)) return;

    functions.logger.log(object);

    const bucket = storage().bucket(object.bucket);
    const file = bucket.file(object.name);  
    const fileBuffer = (await file.download())[0];
    const exifData = parseExifData(fileBuffer);

    functions.logger.log(getImageId(object), exifData);

    // Store information in database.
    getImageRef(object).update({ ...exifData, filePath: object.name });
  });
  
