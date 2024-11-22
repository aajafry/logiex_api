export const errorGuard = (err, req, res, next) => {
  console.error(err.stack || err.message);
  if (res.headersSent) return next(err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "internal server error",
    error: err.stack || err.message || null,
  });
};

