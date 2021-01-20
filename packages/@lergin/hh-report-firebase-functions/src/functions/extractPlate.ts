import { storage } from "firebase-admin";
import * as functions from "firebase-functions";
import fetch from "node-fetch";
import FormData from "form-data";
import knownPlatePrefixes from "../plateprefixes.json";
import { getImageId, getImageRef, shouldRunForFile } from "../utils";
import { spawn } from "child-process-promise";
import { unlink, readFile } from "fs";
import mkdirp from "mkdirp";
import { tmpdir } from "os";
import { basename, dirname, join, normalize } from "path";
import { promisify } from 'util';

function formatPlate(plate: string): string {
  const [letters, ...splitNum] = plate.toUpperCase().split(/(?=\d)/iu);
  const num = splitNum.join("");
  const posiblePrefixes = knownPlatePrefixes.filter((prefix) =>
    letters.startsWith(prefix)
  );
  const prefixLength = posiblePrefixes.reduce(
    (acc, curr) =>
      curr.length > acc && curr.length < letters.length ? curr.length : acc,
    1
  );
  return letters
    ? `${letters.substr(0, prefixLength)} ${letters.substr(
        prefixLength
      )} ${num}`
    : ``;
}

/**
 * Only works for files <= 3MB
 */
async function getPlateFromPlaterecognizer(fileBuffer: Buffer): Promise<String> {
  const body = new FormData();
  body.append("upload", fileBuffer, { filename: 'image.jpg' });
  body.append("regions", "de");

  const res = await fetch("https://api.platerecognizer.com/v1/plate-reader/", {
    method: "POST",
    body,
    headers: {
      Authorization: `Token ${functions.config().platerecognizer.token}`
    },
  }).then((res) => res.json());

  functions.logger.log(res);

  return formatPlate(res?.results?.[0]?.plate ?? "");
}

async function createSmallerFilebuffer(object: functions.storage.ObjectMetadata) {
  const filePath = object.name;
  const fileName = basename(filePath);

  const smallFilePath = normalize(join(dirname(filePath), `small${fileName}`));
  const tempLocalFile = join(tmpdir(), filePath);
  const tempLocalSmallFile = join(tmpdir(), smallFilePath);

  // Create the temp directory where the storage file will be downloaded.
  await mkdirp(dirname(tempLocalFile));

  // Download file from bucket.
  const bucket = storage().bucket(object.bucket);
  const file = bucket.file(object.name);
  await file.download({ destination: tempLocalFile });

  // Generate a small file using ImageMagick.
  await spawn(
    "convert",
    [tempLocalFile, "-thumbnail", `50%`, tempLocalSmallFile],
    { capture: ["stdout", "stderr"] }
  );

  const buffer = await promisify(readFile)(tempLocalSmallFile);

  // Once the image has been read delete the local files to free up disk space.
  await Promise.allSettled([
    promisify(unlink)(tempLocalFile),
    promisify(unlink)(tempLocalSmallFile),
  ]);

  return buffer;
}


export const extractPlate = functions
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

    let fileBuffer: Buffer;

    if (parseInt(object.size, 10) <= 2900000) {
      const bucket = storage().bucket(object.bucket);
      const file = bucket.file(object.name);
      fileBuffer = (await file.download())[0];
    } else {
      functions.logger.log("Image larger than 3MB: Reducing image size.");
      fileBuffer = await createSmallerFilebuffer(object);
    }

    functions.logger.log(
      getImageId(object),
      "FileBuffer length: ",
      fileBuffer.length
    );
 
    const plate = await getPlateFromPlaterecognizer(fileBuffer);

    if (plate !== ''){
      // Store information in database.
      getImageRef(object).child("plate").set(plate);
    }

    functions.logger.log(
      getImageId(object),
      "Extracted Plate for image '",
      object.name,
      "': ",
      plate
    );
  });
  