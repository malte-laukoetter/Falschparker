import * as ExifParser from "exif-parser";
import { storage } from "firebase-admin";
import * as functions from "firebase-functions";
import { ImageData } from "../../../lib/ImageData";
import { ParkingPlaces } from "../../../lib/ParkingPlaces";
import { getFileUrl, getImageId, getImageRef, shouldRunForFile } from "../utils";

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
    date,
    where: ParkingPlaces.BICYCLE_OR_FOOD_PATH,
    obstruction: true,
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

    const imgUrl = await getFileUrl(
      file,
      new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 10
    );

    // Store information in database.
    getImageRef(object).update({ ...exifData, filePath: object.name, url: imgUrl });
  });
  