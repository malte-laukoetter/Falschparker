import { spawn } from "child-process-promise";
import { storage } from "firebase-admin";
import * as functions from "firebase-functions";
import { unlinkSync } from "fs";
import mkdirp from "mkdirp";
import { tmpdir } from "os";
import { basename, dirname, join, normalize } from "path";
import { THUMB_MAX_HEIGHT, THUMB_MAX_WIDTH, THUMB_PREFIX } from "../config";
import { shouldRunForFile, getFileUrl, getImageRef } from "../utils";

async function createThumbnailFile(object: functions.storage.ObjectMetadata) {
  const filePath = object.name;
  const fileName = basename(filePath);

  const bucket = storage().bucket(object.bucket);
  const thumbnailBucket = storage().bucket('falschparker-thumbnails');
  const file = bucket.file(filePath);

  const thumbFilePath = normalize(
    join(dirname(filePath), `${fileName}`)
  );
  const tempLocalFile = join(tmpdir(), filePath);
  const tempLocalThumbFile = join(tmpdir(), thumbFilePath);

  // Cloud Storage files.
  const thumbFile = thumbnailBucket.file(thumbFilePath);
  const metadata = { contentType: object.contentType };

  // Create the temp directory where the storage file will be downloaded.
  await mkdirp(dirname(tempLocalFile));

  // Download file from bucket.
  await file.download({ destination: tempLocalFile });

  // Generate a thumbnail using ImageMagick.
  await spawn(
    "convert",
    [
      tempLocalFile,
      "-auto-orient",
      "-thumbnail",
      `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
      tempLocalThumbFile,
    ],
    { capture: ["stdout", "stderr"] }
  );

  // Uploading the Thumbnail.
  await thumbnailBucket.upload(tempLocalThumbFile, {
    destination: thumbFilePath,
    metadata: metadata
  });

  // Once the image has been uploaded delete the local files to free up disk space.
  unlinkSync(tempLocalFile);
  unlinkSync(tempLocalThumbFile);

  return thumbFile;
}

export const createThumbnail = functions
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

    // Create thumbnail.
    await createThumbnailFile(object);
  });
  