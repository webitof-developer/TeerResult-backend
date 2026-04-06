// Not found middleware
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  if (err?.name === 'MulterError') {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err?.message === 'Invalid file type') {
    return res.status(400).json({
      message: 'Invalid file type. Allowed: jpg, jpeg, png, gif, webp, avif, pdf, doc, docx',
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
