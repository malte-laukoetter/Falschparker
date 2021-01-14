import { ImageData } from "@lergin/hh-report-common";
import Intl from "intl";
import MailComposer from "nodemailer/lib/mail-composer";

export type MailTemplateOptions = ImageData & {
  mailTo: string;
  reporterName: string;
  reporterAddress: string;
  fileContentType: string;
  fileName: string;
  file: Buffer;
}

export function convertDecimalLocationToStr(value: number): string {
  const sign = value < 0 ? -1 : 1;

  const abs = Math.abs(Math.round(value * 1000000));

  const dec = (abs % 1000000) / 1000000;

  const deg = Math.floor(abs / 1000000) * sign;
  const min = Math.floor(dec * 60);
  const sec = (dec - min / 60) * 3600;

  return `${deg.toString(10)}°${min.toString(10).padStart(2,"0")}'${Math.round(sec).toString(10).padStart(2,"0")}"`;
}

export function dateToISODate(date: Date) {
  return date.toISOString().substr(0, 10);
}

export function mailTo({ mailTo }: MailTemplateOptions) {
  return `To: <${mailTo}>`;
};

export function subject({ plate, date: timestamp }: MailTemplateOptions) {
  const date = new Date(timestamp * 1000);

  return `${plate} - ${dateToISODate(date)}`;
};

export function dayOfOffence({ date: timestamp }: MailTemplateOptions) {
  (Intl as any).__disableRegExpRestore();
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function timeOfOffence({ date: timestamp }: MailTemplateOptions) {
  (Intl as any).__disableRegExpRestore();
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function tatort({ address, loc: { lat, lon } }: MailTemplateOptions) {
  return `${address} (${convertDecimalLocationToStr(
    lat
  )}N ${convertDecimalLocationToStr(lon)}E)`;
}

export function tatvorwurf({parking, where, endangering, obstruction, intend, intendReason}: MailTemplateOptions) {
  let modifierText = ''
  if (endangering && obstruction) {
    modifierText = ' mit Behinderung und Gefährdung'
  } else if (endangering) {
    modifierText = " mit Gefährdung";
  } else if (obstruction) {
    modifierText = " mit Behinderung";
  }

  return `${intend ? `Vorsätzliches, u` : `U`}nzulässiges ${
    parking ? `Parken` : `Halten`
  } (${where})${modifierText}${intendReason && intendReason.length > 0 ? `; ${intendReason}`: ``}`;
}

export function mailContent(options: MailTemplateOptions): string {
  const {
    plate,
    reporterName,
    reporterAddress
  } = options;
  return `Sehr geehrte Menschen,

hiermit zeige ich folgende Verkehrsordnungswidrigkeit an:

Tattag: ${dayOfOffence(options)}
Tatzeit: ${timeOfOffence(options)}
Tatort: ${tatort(options)}
Kfz-Kennzeichen: ${plate}
genauer Tatvorwurf: ${tatvorwurf(options)}
Name und Anschrift des Anzeigenden: ${reporterName}, ${reporterAddress}

Meine oben gemachten Angaben einschließlich meiner Personalien sind zutreffend und vollständig.
Mir ist bewusst, dass ich als Zeuge zur wahrheitsgemäßen Aussage und auch zu einem möglichen Erscheinen vor Gericht verpflichtet bin.
Vorsätzlich falsche Angaben zu angeblichen Ordnungswidrigkeiten können eine Straftat darstellen.

Mit freundlichen Grüßen
${reporterName}`;
}

export function attatchment(fileContentType: string, fileName: string, fileBase64: string) {
  return `
Content-Type: ${fileContentType};
Content-Transfer-Encoding: base64
Content-ID: <${fileName}>
Content-Disposition: attachment ;filename="${fileName}"

${fileBase64}`;
}

export async function mailTemplate(options: MailTemplateOptions): Promise<string> {
  return (await new MailComposer({
    to: options.mailTo,
    attachments: [
      {
        filename: options.fileName,
        contentType: options.fileContentType,
        content: options.file,
      },
    ],
    subject: subject(options),
    text: mailContent(options),
  }).compile().build()).toString();
}
