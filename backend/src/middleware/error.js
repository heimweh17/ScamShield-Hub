export function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  // Keep stack in server logs for debugging.

  if (err.code === 11000) return res.status(409).json({ error: "Record already exists" });
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ error: "Invalid field value or identifier" });
  }
  console.error(err.name, err.code || err.status || 500);
  if (res.headersSent) return next(err);
  return res.status(err.status || 500).json({
    error: err.status && err.status < 500 ? "Invalid request" : "Internal server error",
  });
}
