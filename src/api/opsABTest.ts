import express from "express";
import { getCurrentABConfig, updateABConfig } from "../services/configService";

const router = express.Router();

router.get("/ab-config", async (_req, res) => {
  const config = await getCurrentABConfig();
  res.json(config);
});

router.post("/ab-config", async (req, res) => {
  const { mode } = req.body;
  if (!["random", "A", "B", "C"].includes(mode)) {
    return res.status(400).json({ error: "Invalid mode" });
  }

  await updateABConfig(mode);
  return res.json({ message: "AB Config updated", mode });
});

export default router;
