import { THUMB_PREFIX } from "./config";
import { database } from "firebase-admin";
import * as functions from "firebase-functions";
import { basename } from "path";
import { File } from "@google-cloud/storage";

export function shouldRunForFile(object: functions.storage.ObjectMetadata) {
  const filePath = object.name;

  // Exit if the file was manually moved.
  if (!object.metadata || !object.metadata.user) {
    functions.logger.log("Non user upload.");
    return false;
  }

  // Exit if this is triggered on a file that is not an image.
  if (!object.contentType.startsWith("image/")) {
    functions.logger.log("This is not an image.");
    return false;
  }

  // Exit if the image is a thumbnail.
  if (basename(filePath).startsWith(THUMB_PREFIX)) {
    functions.logger.log("This is a thumbnail.");
    return false;
  }

  return true;
}

export async function getFileUrl(file: File, expires: number) {
  return (await file.getSignedUrl({ action: "read", expires: expires }))[0];
}

export function getImageId(object: functions.storage.ObjectMetadata): string {
  const imageId = object.md5Hash ?? object.crc32c;

  return imageId.replaceAll("/", "_").replaceAll("+", "-");
};

export function getImageRef(object: functions.storage.ObjectMetadata) {
 
  return database()
    .ref("users")
    .child(object.metadata.user)
    .child("images")
    .child(getImageId(object));
}
