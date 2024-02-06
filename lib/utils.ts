import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseSearchParamAsNumber(searchParam: string | undefined) {
  if (!searchParam) return undefined;

  const parsed = Number(searchParam);

  if (isNaN(parsed)) return undefined;

  return parsed;
}

export function addNumbersWithPrecision(
  num1: number,
  num2: number,
  precision: number,
) {
  const multiplier = 10 ** precision;
  const result = (num1 * multiplier + num2 * multiplier) / multiplier;

  return result;
}

export function getFileSizeString(fileSize: number) {
  if (fileSize < 1024) {
    return `${fileSize}B`;
  }

  if (fileSize < 1024 ** 2) {
    return `${Math.round(fileSize / 1024)}KB`;
  }

  if (fileSize < 1024 ** 3) {
    return `${Math.round(fileSize / 1024 ** 2)}MB`;
  }

  return `${Math.round(fileSize / 1024 ** 3)}GB`;
}

export function getImageRatio(image: File) {
  return new Promise<number>((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(image);
    img.onload = () => {
      const { width, height } = img;
      resolve(width / height);
    };
    img.onerror = reject;
  });
}

export function getArtworkUrl(artworkPath: string) {
  return `${process.env.NEXT_PUBLIC_FIREBASE_HOSTING_URL}/${artworkPath}`;
}
