import { Storage, File } from '@google-cloud/storage'
import { spawn } from 'child-process-promise'
import * as ExifParser from 'exif-parser'
import { database } from 'firebase-admin'
import * as functions from 'firebase-functions'
import { unlinkSync } from 'fs'
import mkdirp from 'mkdirp'
import fetch from 'node-fetch'
import { tmpdir } from 'os'
import { basename, dirname, join, normalize } from 'path'
import { ImageData, ParkingPlaces } from '@lergin/hh-report-common'

const gcs = new Storage({ keyFilename: './firebase-adminsdk.json' })

const knownPlatePrefixes = ['A', 'AA', 'AB', 'ABG', 'ABI', 'AC', 'AD', 'AE', 'AF', 'AH', 'AIB', 'AIC', 'AK', 'ALF', 'ALZ', 'AM', 'AN', 'ANA', 'ANG', 'ANK', 'AP', 'APD', 'ARN', 'ART', 'AS', 'ASL', 'ASZ', 'AT', 'AU', 'AUR', 'AW', 'AZ', 'AZE', 'Aö', 'B', 'BA', 'BAD', 'BAR', 'BB', 'BBG', 'BBL', 'BC', 'BCH', 'BD', 'BE', 'BED', 'BER', 'BF', 'BGL', 'BH', 'BI', 'BID', 'BIN', 'BIR', 'BIT', 'BIW', 'BK', 'BKS', 'BL', 'BLB', 'BLK', 'BM', 'BN', 'BNA', 'BO', 'BOH', 'BOR', 'BOT', 'BRA', 'BRB', 'BRG', 'BRK', 'BRL', 'BRV', 'BS', 'BT', 'BTF', 'BUL', 'BW', 'BWL', 'BYL', 'BZ', 'Bö', 'BüD', 'BüR', 'BüS', 'BüZ', 'C', 'CA', 'CAS', 'CB', 'CE', 'CHA', 'CLP', 'CLZ', 'CO', 'COC', 'COE', 'CR', 'CUX', 'CW', 'D', 'DA', 'DAH', 'DAN', 'DAU', 'DB', 'DBR', 'DD', 'DE', 'DEG', 'DEL', 'DGF', 'DH', 'DI', 'DIL', 'DIN', 'DIZ', 'DKB', 'DL', 'DLG', 'DM', 'DN', 'DO', 'DON', 'DU', 'DUD', 'DW', 'DZ', 'DüW', 'E', 'EA', 'EB', 'EBE', 'EBN', 'EBS', 'ECK', 'ED', 'EE', 'EF', 'EG', 'EH', 'EI', 'EIC', 'EIL', 'EIN', 'EIS', 'EL', 'EM', 'EMD', 'EMS', 'EN', 'ER', 'ERB', 'ERH', 'ERK', 'ERZ', 'ES', 'ESB', 'ESW', 'EU', 'EW', 'F', 'FB', 'FD', 'FDB', 'FDS', 'FEU', 'FF', 'FFB', 'FG', 'FI', 'FKB', 'FL', 'FLO', 'FN', 'FO', 'FOR', 'FR', 'FRG', 'FRI', 'FRW', 'FS', 'FT', 'FTL', 'Fü', 'FüS', 'G', 'GA', 'GAN', 'GAP', 'GC', 'GD', 'GDB', 'GE', 'GEL', 'GEO', 'GER', 'GF', 'GG', 'GHA', 'GHC', 'GI', 'GK', 'GL', 'GLA', 'GM', 'GMN', 'GN', 'GNT', 'GOA', 'GOH', 'GP', 'GR', 'GRA', 'GRH', 'GRI', 'GRM', 'GRZ', 'GS', 'GT', 'GTH', 'GUB', 'GUN', 'GVM', 'GW', 'GZ', 'Gö', 'Gü', 'H', 'HA', 'HAB', 'HAL', 'HAM', 'HAS', 'HB', 'HBN', 'HBS', 'HC', 'HCH', 'HD', 'HDH', 'HDL', 'HE', 'HEB', 'HEF', 'HEI', 'HER', 'HET', 'HF', 'HG', 'HGN', 'HGW', 'HH', 'HI', 'HIG', 'HIP', 'HK', 'HL', 'HM', 'HMü', 'HN', 'HO', 'HOG', 'HOH', 'HOL', 'HOM', 'HOR', 'HOT', 'HP', 'HR', 'HRO', 'HS', 'HSK', 'HST', 'HU', 'HV', 'HVL', 'HWI', 'HX', 'HY', 'HZ', 'HöS', 'IGB', 'IK', 'IL', 'ILL', 'IN', 'IZ', 'J', 'JE', 'JL', 'JüL', 'K', 'KA', 'KB', 'KC', 'KE', 'KEH', 'KEL', 'KEM', 'KF', 'KG', 'KH', 'KI', 'KIB', 'KK', 'KL', 'KLE', 'KLZ', 'KM', 'KN', 'KO', 'KR', 'KRU', 'KS', 'KT', 'KU', 'KUS', 'KY', 'KYF', 'KöN', 'KöT', 'KöZ', 'KüN', 'L', 'LA', 'LAU', 'LB', 'LBS', 'LBZ', 'LD', 'LDK', 'LDS', 'LEO', 'LER', 'LEV', 'LG', 'LH', 'LI', 'LIB', 'LIF', 'LIP', 'LL', 'LM', 'LOS', 'LP', 'LR', 'LRO', 'LSA', 'LSZ', 'LU', 'LUN', 'LUP', 'LWL', 'Lö', 'LöB', 'M', 'MA', 'MAB', 'MAI', 'MAK', 'MAL', 'MB', 'MC', 'MD', 'ME', 'MEI', 'MEK', 'MER', 'MET', 'MG', 'MGH', 'MGN', 'MH', 'MHL', 'MI', 'MIL', 'MK', 'MKK', 'ML', 'MM', 'MN', 'MO', 'MOD', 'MOL', 'MON', 'MOS', 'MQ', 'MR', 'MS', 'MSE', 'MSH', 'MSP', 'MST', 'MTK', 'MTL', 'MW', 'MY', 'MYK', 'MZ', 'MZG', 'Mü', 'MüB', 'MüR', 'N', 'NAB', 'NAI', 'NB', 'ND', 'NDH', 'NE', 'NEA', 'NEB', 'NEC', 'NEN', 'NES', 'NEW', 'NF', 'NH', 'NI', 'NK', 'NM', 'NMB', 'NMS', 'NOH', 'NOL', 'NOM', 'NOR', 'NP', 'NR', 'NT', 'NU', 'NVP', 'NW', 'NWM', 'NY', 'NZ', 'Nö', 'OA', 'OAL', 'OB', 'OBG', 'OC', 'OCH', 'OD', 'OE', 'OF', 'OG', 'OH', 'OHA', 'OHV', 'OHZ', 'OK', 'OL', 'OPR', 'OS', 'OSL', 'OVI', 'OVL', 'OVP', 'P', 'PA', 'PAF', 'PAN', 'PAR', 'PB', 'PCH', 'PE', 'PEG', 'PF', 'PI', 'PIR', 'PL', 'PLö', 'PM', 'PN', 'PR', 'PRü', 'PS', 'PW', 'PZ', 'QFT', 'QLB', 'R', 'RA', 'RC', 'RD', 'RDG', 'RE', 'REG', 'REH', 'RG', 'RH', 'RI', 'RID', 'RIE', 'RL', 'RM', 'RO', 'ROD', 'ROF', 'ROK', 'ROL', 'ROS', 'ROT', 'ROW', 'RP', 'RPL', 'RS', 'RSL', 'RT', 'RV', 'RW', 'RZ', 'RüD', 'RüG', 'S', 'SAB', 'SAD', 'SAN', 'SAW', 'SB', 'SBG', 'SBK', 'SC', 'SCZ', 'SDH', 'SDL', 'SDT', 'SE', 'SEB', 'SEE', 'SEF', 'SFA', 'SFB', 'SFT', 'SG', 'SGH', 'SHA', 'SHG', 'SHK', 'SHL', 'SI', 'SIG', 'SIM', 'SK', 'SL', 'SLE', 'SLF', 'SLK', 'SLN', 'SLS', 'SLZ', 'SLü', 'SM', 'SN', 'SO', 'SOB', 'SOG', 'SOK', 'SON', 'SP', 'SPB', 'SPN', 'SR', 'SRB', 'SRO', 'ST', 'STA', 'STB', 'STD', 'STE', 'STL', 'SU', 'SUL', 'SW', 'SWA', 'SZ', 'SZB', 'SöM', 'SüW', 'TBB', 'TDO', 'TE', 'TET', 'TF', 'TG', 'TIR', 'TO', 'TP', 'TR', 'TS', 'TUT', 'TöL', 'Tü', 'UE', 'UEM', 'UER', 'UFF', 'UH', 'UL', 'UM', 'UN', 'USI', 'V', 'VAI', 'VB', 'VEC', 'VER', 'VG', 'VIB', 'VIE', 'VK', 'VOH', 'VR', 'VS', 'W', 'WA', 'WAF', 'WAK', 'WAN', 'WAT', 'WB', 'WBS', 'WDA', 'WE', 'WEL', 'WEN', 'WER', 'WES', 'WF', 'WHV', 'WI', 'WIL', 'WIS', 'WIT', 'WIZ', 'WK', 'WL', 'WLG', 'WM', 'WMS', 'WN', 'WND', 'WO', 'WOB', 'WOH', 'WOL', 'WOR', 'WOS', 'WR', 'WRN', 'WS', 'WSF', 'WST', 'WSW', 'WT', 'WTM', 'WUG', 'WUN', 'WUR', 'WW', 'WZ', 'WZL', 'Wü', 'WüM', 'X', 'Y', 'Z', 'ZE', 'ZEL', 'ZI', 'ZP', 'ZR', 'ZW', 'ZZ']

function formatPlate (plate: string): string {
  const [letters, ...splitNum] = plate.toUpperCase().split(/(?=\d)/iu)
  const num = splitNum.join('')
  const posiblePrefixes = knownPlatePrefixes.filter(prefix => letters.startsWith(prefix))
  const prefixLength = posiblePrefixes.reduce((acc, curr) => curr.length > acc && curr.length < letters.length ? curr.length : acc, 1)
  return letters ? `${letters.substr(0, prefixLength)} ${letters.substr(prefixLength)} ${num}` : ``
}

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200
const THUMB_MAX_WIDTH = 200
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_'

function parseExifData (fileBuffer: Buffer): ImageData {
  const parser = ExifParser.create(fileBuffer)
  const result = parser.parse()
  const lat: number = result.tags.GPSLatitude || 0
  const lon: number = result.tags.GPSLongitude || 0
  const date: number = result.tags.CreateDate || result.tags.ModifyDate || 0

  return {
    loc: {
      lat,
      lon,
    },
    date,
    where: ParkingPlaces.BICYCLE_OR_FOOD_PATH,
    obstruction: true
  };
}

async function getPlate (url: string): Promise<string> {
  const plateRecognitionResult = await fetch(`https://api.openalpr.com/v2/recognize_url?&country=eu&secret_key=${functions.config().openalpr.secret_key}&image_url=${encodeURIComponent(url)}`, { method: 'POST' }).then(res => res.json())
  const plate = plateRecognitionResult ? plateRecognitionResult.results ? plateRecognitionResult.results[0] ? plateRecognitionResult.results[0].plate || '' : '' : '' : ''
  return formatPlate(plate)
}

async function createImageData (file: File): Promise<ImageData> {
  // Download file and parse EXIF data.
  const fileBuffer = (await file.download())[0]
  const exifData = parseExifData(fileBuffer)

  // Get kfz plate via openAlpr.
  const openalprUrl = await getFileUrl(file, new Date().getTime() + 1000 * 60 * 30)
  const plate = await getPlate(openalprUrl)

  // Get download url for the image.
  const imgUrl = await getFileUrl(file, new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 10)

  return { ...exifData, url: imgUrl, plate }
}

async function getFileUrl (file: File, expires: number) {
  return (await file.getSignedUrl({ action: 'read', expires: expires }))[0]
}

async function createThumbnail (object: functions.storage.ObjectMetadata) {
  const filePath = object.name
  const fileName = basename(filePath)

  const bucket = gcs.bucket(object.bucket)
  const file = bucket.file(filePath)

  const thumbFilePath = normalize(join(dirname(filePath), `${THUMB_PREFIX}${fileName}`))
  const tempLocalFile = join(tmpdir(), filePath)
  const tempLocalThumbFile = join(tmpdir(), thumbFilePath)

  // Cloud Storage files.
  const thumbFile = bucket.file(thumbFilePath)
  const metadata = { contentType: object.contentType }

  // Create the temp directory where the storage file will be downloaded.
  await mkdirp(dirname(tempLocalFile))

  // Download file from bucket.
  await file.download({ destination: tempLocalFile })

  // Generate a thumbnail using ImageMagick.
  await spawn(
    'convert',
    [
      tempLocalFile,
      '-thumbnail',
      `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
      tempLocalThumbFile
    ],
    { capture: ['stdout', 'stderr'] }
  )

  // Uploading the Thumbnail.
  await bucket.upload(tempLocalThumbFile, {
    destination: thumbFilePath,
    metadata: metadata
  })

  // Once the image has been uploaded delete the local files to free up disk space.
  unlinkSync(tempLocalFile)
  unlinkSync(tempLocalThumbFile)

  return thumbFile
}

export const imageData = functions.runWith({
  timeoutSeconds: 120,
  memory: "512MB"
}).region('europe-west1').storage.bucket('falschparker').object().onFinalize(async (object, context) => {
  const filePath = object.name

  // Exit if the file was manually moved.
  if (!object.metadata || !object.metadata.user) {
    return console.log('Non user upload.')
  }

  // Exit if this is triggered on a file that is not an image.
  if (!object.contentType.startsWith('image/')) {
    return console.log('This is not an image.')
  }

  // Exit if the image is a thumbnail.
  if (basename(filePath).startsWith(THUMB_PREFIX)) {
    return console.log('This is a thumbnail.')
  }

  // Get file from bucket.
  const bucket = gcs.bucket(object.bucket)
  const file = bucket.file(filePath)

  // Get the information form the image file.
  const data = await createImageData(file)

  // Store information in database.
  const ref = database().ref('users').child(object.metadata.user).child('images').push()
  ref.set({ ...data, filePath })

  // Create thumbnail.
  const thumbFile = await createThumbnail(object)
  const thumbFileUrl = await getFileUrl(thumbFile, new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 10)
  ref.child('thumbnail').set(thumbFileUrl)
})
