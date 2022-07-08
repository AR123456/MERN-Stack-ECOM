// custom middleware
// this one if for 400 errors
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
// with err middleware to override do err first then req, res, next
const errorHandler = (err, req, res, next) => {
  // may get 200 even if error, if it is a 200 then make it a 500 whichs
  // is a server error, else send the status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  // set res.status to the status code
  res.status(statusCode);
  // respond with JSON object
  res.json({
    // get message from error objcect
    message: err.message,
    // stack trace if not in production
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
