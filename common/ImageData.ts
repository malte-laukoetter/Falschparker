export type ImageData = {
  address?: string;
  date?: number;
  filePath?: string;
  loc?: {
    lat: number;
    lon: number;
  };
  mailId?: string;
  plate?: string;
  send?: boolean;
  thumbnail?: string;
  url?: string;
  where?: string;
  endangering?: boolean;
  parking?: boolean;
  intend?: boolean;
  intendReason?: string;
}
