import mongoose from "mongoose";
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? "ok" : "unavailable",
    service: "scamshield-backend",
    time: new Date().toISOString(),
  });
});

export default router;
