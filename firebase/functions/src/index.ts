import { onRequest } from "firebase-functions/v2/https";
import * as sharp from "sharp";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const SHARP_FORMATS = ["jpeg", "png", "webp", "jpg"];

initializeApp();
const bucket = getStorage().bucket();

export const images = onRequest(async (request, response) => {
  const { query, params } = request;

  const { 0: urlParam } = params;
  const width = Number(query.width) || 300;

  const filePath = urlParam.replace(/^\/+/, "");

  if (!filePath) {
    response.status(400).send("Bad Request");
    return;
  }

  const fileRef = bucket.file(filePath);
  const [fileExists] = await fileRef.exists();

  if (!fileExists) {
    response.status(404).send("Not Found - File does not exist");
    return;
  }

  const { contentType } = fileRef.metadata;

  if (!contentType) {
    response.status(400).send("Bad Request - Invalid content type");
    return;
  }

  const format = SHARP_FORMATS.find((format) => contentType.includes(format));

  if (!format) {
    response.status(400).send("Bad Request - Invalid format");
    return;
  }

  response.setHeader("Content-Type", "image/webp");
  response.setHeader("Cache-Control", "public, max-age=31536000");

  const pipeline = sharp();

  fileRef.createReadStream().pipe(pipeline);

  pipeline.resize({ width }).toFormat("webp").pipe(response);
});
