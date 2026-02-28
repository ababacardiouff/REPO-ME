import { Router } from "express";
import multer from "multer";
import { saveToObjectStore } from "../services/storage";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/uploads", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "missing_file" });

  const result = await saveToObjectStore(req.file.buffer, req.file.originalname);
  return res.json({ url: result.url, meta: result.meta });
});

export default router;
