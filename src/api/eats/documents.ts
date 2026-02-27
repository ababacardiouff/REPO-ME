import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware, AuthenticatedRequest } from "../../infra/auth";
import { addVendorDocument, getVendorDocs } from "../../services/eatsDocumentService";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/:vendorId/upload", authMiddleware, upload.single("file"), async (req: AuthenticatedRequest, res) => {
  const vendorId = req.params.vendorId;
  const docType = req.body.doc_type;
  const fileKey = `eats/${vendorId}/${docType}/${uuidv4()}.bin`;
  const fileUrl = `${process.env.STORAGE_BASE_URL || "https://storage.internal"}/${fileKey}`;
  await addVendorDocument(vendorId, docType, fileUrl, req.user!.id);
  res.json({ ok: true, fileUrl });
});

router.get("/:vendorId", authMiddleware, async (req, res) => {
  const docs = await getVendorDocs(req.params.vendorId);
  res.json(docs);
});

export default router;
