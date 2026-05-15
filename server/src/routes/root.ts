import { Router } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "views", "index.html"));
});

router.get("/health", (_req, res) => {
  const dbState = mongoose.connection.readyState;
  // mongoose readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const dbOk = dbState === 1;

  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? "ok" : "degraded",
    uptime: process.uptime(),
    db: dbOk ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

export default router;
