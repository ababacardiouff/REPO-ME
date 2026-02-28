import { S3 } from "aws-sdk";
import { randomUUID } from "crypto";

const endpoint = process.env.OBJECT_STORE_ENDPOINT || process.env.S3_ENDPOINT;
const bucket = process.env.OBJECT_STORE_BUCKET || process.env.S3_BUCKET || "eats-catalog";

const s3 = new S3({
  endpoint,
  accessKeyId: process.env.OBJECT_STORE_KEY || process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.OBJECT_STORE_SECRET || process.env.S3_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: "v4"
});

export async function saveToObjectStore(buffer: Buffer, fileName: string) {
  const key = `catalog/${randomUUID()}-${fileName}`;
  await s3
    .putObject({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: "application/octet-stream"
    })
    .promise();

  const url = endpoint
    ? `${endpoint.replace(/\/$/, "")}/${bucket}/${key}`
    : `s3://${bucket}/${key}`;

  return { url, meta: { bucket, key, size: buffer.byteLength } };
}
