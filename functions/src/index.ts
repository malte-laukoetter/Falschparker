import { storage as storageFunctions, database as databaseFunctions, https as httpsFunctions, config } from "firebase-functions";
import { database, storage, initializeApp } from "firebase-admin";
import fetch from "node-fetch";
import * as FormData from "form-data";
import * as node_geocoder from "node-geocoder";
import * as mkdirp from "mkdirp-promise";
import { spawn } from "child-process-promise"
import { Storage } from "@google-cloud/storage";
import * as ExifParser from "exif-parser";
import { dirname, basename, normalize, join } from "path";
import { tmpdir } from "os";
import { unlinkSync } from "fs";

const gcs = new Storage({
  keyFilename:
    "./hh-anzeigen-bussgeldstelle-firebase-adminsdk-oiyhu-da2c7ca44b.json"
});

const geocoder = node_geocoder({
  provider: config().geocoder.provider,
  language: config().geocoder.language,
  apiKey: config().geocoder.api_key
});

initializeApp();

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';

export const imageData = storageFunctions.object().onFinalize(async (object, context) => {
  const filePath = object.name;

  // Exit if this is triggered on a file that is not an image.
  if (!object.contentType.startsWith("image/")) {
    console.log("This is not an image.");
    return null;
  }

  const fileName = basename(filePath);
  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_PREFIX)) {
    return console.log('Already a Thumbnail.');
  }


  // Download file from bucket.
  const bucket = gcs.bucket(object.bucket);
  const file = bucket.file(filePath);
  const fileBuffer = (await file.download())[0];

  // Parse EXIF data
  const parser = ExifParser.create(fileBuffer);
  const result = parser.parse();

  const lat: number = result.tags.GPSLatitude || 0;
  const lon: number = result.tags.GPSLongitude || 0;
  const date = result.tags.CreateDate || result.tags.ModifyDate || new Date();

  // Get kfz plate
  const openalprUrl = (await file.getSignedUrl({
    action: "read",
    expires: new Date().getTime() + 1000 * 60 * 30
  }))[0];

  const plateRecognitionResult = await fetch(
    `https://api.openalpr.com/v2/recognize_url?&country=eu&secret_key=${config().openalpr.secret_key}&image_url=${encodeURIComponent(
      openalprUrl
    )}`,
    { method: "POST" }
  ).then(res => res.json());


  const plate = plateRecognitionResult ? plateRecognitionResult.results ? plateRecognitionResult.results[0] ? plateRecognitionResult.results[0].plate || "" : "" : "" : "";

  // store data in database
  const imgUrl = (await file.getSignedUrl({
    action: "read",
    expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 10
  }))[0];

  const ref = database()
    .ref("images")
    .push();

  ref.set({ url: imgUrl, loc: {lat, lon}, date, plate: formatPlate(plate), filePath });

  const thumbFilePath = normalize(join(dirname(filePath), `${THUMB_PREFIX}${fileName}`));
  const tempLocalFile = join(tmpdir(), filePath);
  const tempLocalThumbFile = join(tmpdir(), thumbFilePath);
  // Cloud Storage files.
  const thumbFile = bucket.file(thumbFilePath);
  const metadata = { contentType: object.contentType };

  // Create the temp directory where the storage file will be downloaded.
  await mkdirp(dirname(tempLocalFile))
  // Download file from bucket.
  await file.download({ destination: tempLocalFile });
  // Generate a thumbnail using ImageMagick.
  await spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile], { capture: ['stdout', 'stderr'] });
  // Uploading the Thumbnail.
  await bucket.upload(tempLocalThumbFile, { destination: thumbFilePath, metadata: metadata });
  // Once the image has been uploaded delete the local files to free up disk space.
  unlinkSync(tempLocalFile);
  unlinkSync(tempLocalThumbFile);
  // Get the Signed URLs for the thumbnail.

  const thumbFileUrl = (await thumbFile.getSignedUrl({ action: "read", expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 10 }))[0];
  // Add the URLs to the Database
  ref.child('thumbnail').set(thumbFileUrl);
});

export const geoCoding = databaseFunctions.ref('/images/{id}/loc').onWrite(async (change, context) => {
  const newLon = change.after.child("lon").val();
  const newLat = change.after.child("lat").val();

  if (newLon && newLat && (newLon !== change.before.child('lon').val() || newLat !== change.before.child('lat').val())) {
    const [{ formattedAddress: address }] = await geocoder.reverse({ lat: newLat, lon: newLon });

    console.log(`Lat ${newLat}, Lon ${newLon} -> ${address}`);

    change.after.ref.parent.child('address').set(address);
  }
});

const knownPrefixes = ["A", "AA", "AB", "ABG", "ABI", "AC", "AD", "AE", "AF", "AH", "AIB", "AIC", "AK", "ALF", "ALZ", "AM", "AN", "ANA", "ANG", "ANK", "AP", "APD", "ARN", "ART", "AS", "ASL", "ASZ", "AT", "AU", "AUR", "AW", "AZ", "AZE", "Aö", "B", "BA", "BAD", "BAR", "BB", "BBG", "BBL", "BC", "BCH", "BD", "BE", "BED", "BER", "BF", "BGL", "BH", "BI", "BID", "BIN", "BIR", "BIT", "BIW", "BK", "BKS", "BL", "BLB", "BLK", "BM", "BN", "BNA", "BO", "BOH", "BOR", "BOT", "BRA", "BRB", "BRG", "BRK", "BRL", "BRV", "BS", "BT", "BTF", "BUL", "BW", "BWL", "BYL", "BZ", "Bö", "BüD", "BüR", "BüS", "BüZ", "C", "CA", "CAS", "CB", "CE", "CHA", "CLP", "CLZ", "CO", "COC", "COE", "CR", "CUX", "CW", "D", "DA", "DAH", "DAN", "DAU", "DB", "DBR", "DD", "DE", "DEG", "DEL", "DGF", "DH", "DI", "DIL", "DIN", "DIZ", "DKB", "DL", "DLG", "DM", "DN", "DO", "DON", "DU", "DUD", "DW", "DZ", "DüW", "E", "EA", "EB", "EBE", "EBN", "EBS", "ECK", "ED", "EE", "EF", "EG", "EH", "EI", "EIC", "EIL", "EIN", "EIS", "EL", "EM", "EMD", "EMS", "EN", "ER", "ERB", "ERH", "ERK", "ERZ", "ES", "ESB", "ESW", "EU", "EW", "F", "FB", "FD", "FDB", "FDS", "FEU", "FF", "FFB", "FG", "FI", "FKB", "FL", "FLO", "FN", "FO", "FOR", "FR", "FRG", "FRI", "FRW", "FS", "FT", "FTL", "Fü", "FüS", "G", "GA", "GAN", "GAP", "GC", "GD", "GDB", "GE", "GEL", "GEO", "GER", "GF", "GG", "GHA", "GHC", "GI", "GK", "GL", "GLA", "GM", "GMN", "GN", "GNT", "GOA", "GOH", "GP", "GR", "GRA", "GRH", "GRI", "GRM", "GRZ", "GS", "GT", "GTH", "GUB", "GUN", "GVM", "GW", "GZ", "Gö", "Gü", "H", "HA", "HAB", "HAL", "HAM", "HAS", "HB", "HBN", "HBS", "HC", "HCH", "HD", "HDH", "HDL", "HE", "HEB", "HEF", "HEI", "HER", "HET", "HF", "HG", "HGN", "HGW", "HH", "HHM", "HI", "HIG", "HIP", "HK", "HL", "HM", "HMü", "HN", "HO", "HOG", "HOH", "HOL", "HOM", "HOR", "HOT", "HP", "HR", "HRO", "HS", "HSK", "HST", "HU", "HV", "HVL", "HWI", "HX", "HY", "HZ", "HöS", "IGB", "IK", "IL", "ILL", "IN", "IZ", "J", "JE", "JL", "JüL", "K", "KA", "KB", "KC", "KE", "KEH", "KEL", "KEM", "KF", "KG", "KH", "KI", "KIB", "KK", "KL", "KLE", "KLZ", "KM", "KN", "KO", "KR", "KRU", "KS", "KT", "KU", "KUS", "KY", "KYF", "KöN", "KöT", "KöZ", "KüN", "L", "LA", "LAU", "LB", "LBS", "LBZ", "LD", "LDK", "LDS", "LEO", "LER", "LEV", "LG", "LH", "LI", "LIB", "LIF", "LIP", "LL", "LM", "LOS", "LP", "LR", "LRO", "LSA", "LSZ", "LU", "LUN", "LUP", "LWL", "Lö", "LöB", "M", "MA", "MAB", "MAI", "MAK", "MAL", "MB", "MC", "MD", "ME", "MEI", "MEK", "MER", "MET", "MG", "MGH", "MGN", "MH", "MHL", "MI", "MIL", "MK", "MKK", "ML", "MM", "MN", "MO", "MOD", "MOL", "MON", "MOS", "MQ", "MR", "MS", "MSE", "MSH", "MSP", "MST", "MTK", "MTL", "MW", "MY", "MYK", "MZ", "MZG", "Mü", "MüB", "MüR", "N", "NAB", "NAI", "NB", "ND", "NDH", "NE", "NEA", "NEB", "NEC", "NEN", "NES", "NEW", "NF", "NH", "NI", "NK", "NM", "NMB", "NMS", "NOH", "NOL", "NOM", "NOR", "NP", "NR", "NT", "NU", "NVP", "NW", "NWM", "NY", "NZ", "Nö", "OA", "OAL", "OB", "OBG", "OC", "OCH", "OD", "OE", "OF", "OG", "OH", "OHA", "OHV", "OHZ", "OK", "OL", "OPR", "OS", "OSL", "OVI", "OVL", "OVP", "P", "PA", "PAF", "PAN", "PAR", "PB", "PCH", "PE", "PEG", "PF", "PI", "PIR", "PL", "PLö", "PM", "PN", "PR", "PRü", "PS", "PW", "PZ", "QFT", "QLB", "R", "RA", "RC", "RD", "RDG", "RE", "REG", "REH", "RG", "RH", "RI", "RID", "RIE", "RL", "RM", "RO", "ROD", "ROF", "ROK", "ROL", "ROS", "ROT", "ROW", "RP", "RPL", "RS", "RSL", "RT", "RV", "RW", "RZ", "RüD", "RüG", "S", "SAB", "SAD", "SAN", "SAW", "SB", "SBG", "SBK", "SC", "SCZ", "SDH", "SDL", "SDT", "SE", "SEB", "SEE", "SEF", "SFA", "SFB", "SFT", "SG", "SGH", "SHA", "SHG", "SHK", "SHL", "SI", "SIG", "SIM", "SK", "SL", "SLE", "SLF", "SLK", "SLN", "SLS", "SLZ", "SLü", "SM", "SN", "SO", "SOB", "SOG", "SOK", "SON", "SP", "SPB", "SPN", "SR", "SRB", "SRO", "ST", "STA", "STB", "STD", "STE", "STL", "SU", "SUL", "SW", "SWA", "SZ", "SZB", "SöM", "SüW", "TBB", "TDO", "TE", "TET", "TF", "TG", "TIR", "TO", "TP", "TR", "TS", "TUT", "TöL", "Tü", "UE", "UEM", "UER", "UFF", "UH", "UL", "UM", "UN", "USI", "V", "VAI", "VB", "VEC", "VER", "VG", "VIB", "VIE", "VK", "VOH", "VR", "VS", "W", "WA", "WAF", "WAK", "WAN", "WAT", "WB", "WBS", "WDA", "WE", "WEL", "WEN", "WER", "WES", "WF", "WHV", "WI", "WIL", "WIS", "WIT", "WIZ", "WK", "WL", "WLG", "WM", "WMS", "WN", "WND", "WO", "WOB", "WOH", "WOL", "WOR", "WOS", "WR", "WRN", "WS", "WSF", "WST", "WSW", "WT", "WTM", "WUG", "WUN", "WUR", "WW", "WZ", "WZL", "Wü", "WüM", "X", "Y", "Z", "ZE", "ZEL", "ZI", "ZP", "ZR", "ZW", "ZZ"]

function formatPlate(plate: string): string {
  const [letters, ...splitNum] = plate.toUpperCase().split(/(?=\d)/iu);
  const num = splitNum.join("");

  const posiblePrefixes = knownPrefixes.filter(prefix => letters.startsWith(prefix));

  const prefixLength = posiblePrefixes.reduce((acc, curr) =>
    curr.length > acc && curr.length < letters.length ? curr.length : acc, 1
  );

  return letters ? `${letters.substr(0, prefixLength)} ${letters.substr(prefixLength)} ${num}` : ``;
}

export const sendMail = databaseFunctions.ref('/images/{id}/send').onCreate(async (change, context) => {
  const db = database();

  const ref = change.ref.parent;
  const { address, date, loc: { lat, lon }, plate, endangering, parking, intend, intendReason, where, filePath } = (await ref.once("value")).val();

  const reporterDataRef = db.ref("reporter");
  const reporterData = (await reporterDataRef.once("value")).val();

  const bucket = storage().bucket();
  const file = bucket.file(filePath);
  const metaData = (await file.getMetadata())[0];

  const fileContentType = metaData.contentType;
  const fileName = metaData.name;

  const fileBuffer = (await file.download())[0];
  const fileBase64 = fileBuffer.toString('base64');


  try {
    const formData = new FormData();
    formData.append("client_id", config().google.auth.client_id);
    formData.append("client_secret", config().google.auth.client_secret);
    formData.append("refresh_token", reporterData.refresh_token);
    formData.append('grant_type', 'refresh_token');
    const {access_token} = await fetch("https://www.googleapis.com/oauth2/v4/token", {
      method: "POST",
      body: formData
    }).then(res => res.json());

    const mail = await fetch(
      "https://www.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=media",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "message/rfc822"
        },
        body: mailTemplate({
          mailTo: reporterData.mailTo,
          address,
          date: new Date(date * 1000),
          lat,
          lon,
          plate,
          endangering,
          parking,
          intend,
          intendReason,
          where,
          reporterAddress: reporterData.address,
          reporterName: reporterData.name,
          fileContentType,
          fileName,
          fileBase64
        })
      }
    ).then(a => a.json());

    console.log(mail);

    await change.ref.parent.child('mailId').set(mail.id);
  } catch(err) {
    console.log(err);
    await change.ref.remove();
  }
});

type MailTemplateOptions = {
  mailTo: string;
  date: Date;
  address: string;
  lat: number;
  lon: number;
  plate: string;
  endangering: boolean;
  parking: boolean;
  intend: boolean;
  intendReason: string;
  where: string;
  reporterName: string;
  reporterAddress: string;
  fileContentType: string;
  fileName: string;
  fileBase64: string;
};

function mailTemplate({
  mailTo,
  date,
  address,
  lat,
  lon,
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
  return `To: <${mailTo}>
Subject: ${plate} - ${date.toISOString().substr(0, 10)}
Content-Type: multipart/mixed;boundary=92ckNGfS

--92ckNGfS
Content-Type: text/plain;charset=utf-8

Tattag: ${date.toLocaleDateString("de-DE")}
Tatzeit: ${date.toLocaleTimeString("de-DE").substr(0, 5)}
Tatort: ${address} (${convertDecimalLocationToStr(lat)}N ${convertDecimalLocationToStr(lon)}E)
Kfz-Kennzeichen: ${plate}
genauer Tatvorwurf: Unzulässiges ${parking ? "Parken" : "Halten"} (${where})${endangering ? " mit Gefährdung" : ""}${endangering && intend ? " und" : ""}${intend ? ` mit Vorsatz (${intendReason.trim()})` : ""}
Name und Anschrift des Anzeigenden: ${reporterName}, ${reporterAddress}

--92ckNGfS
Content-Type: ${fileContentType};
Content-Transfer-Encoding: base64
Content-Disposition: attachment ;filename="${fileName}"

${fileBase64}
--92ckNGfS--`;
}

function convertDecimalLocationToStr(value): string {
  const sign = value < 0 ? -1 : 1

  const abs = Math.abs(Math.round(value * 1000000))

  const dec = abs % 1000000 / 1000000

  const deg = Math.floor(abs / 1000000) * sign
  const min = Math.floor(dec * 60)
  const sec = (dec - min / 60) * 3600

  return `${deg}°${min}'${Math.round(sec)}"`
}

