import axios from "axios";
import { callOcrStub } from "../workers/ocrStub";

export async function analyzeAndTransformImage(url: string) {
  const resp = await axios.get(url, { responseType: "arraybuffer", timeout: 10000 });
  const buf = Buffer.from(resp.data);

  const base = buf.toString("base64").slice(0, 200);
  return {
    originalSize: buf.length,
    thumb: `data:image/jpeg;base64,${base}...`,
    page: `data:image/jpeg;base64,${base}...`,
    cover: `data:image/jpeg;base64,${base}...`,
    ocr: await callOcrStub(buf)
  };
}
