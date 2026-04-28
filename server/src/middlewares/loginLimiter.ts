import { rateLimit } from "express-rate-limit";
import { logEvents } from "./logger.js";

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message:
      "Too many login attempts from this IP, please try again after a 60 second pause",
  },
  handler: (req, res, _next, options) => {
    const msg =
      typeof options.message === "object" && options.message !== null
        ? (options.message as { message: string }).message
        : String(options.message);

    logEvents(
      `Too Many Requests: ${msg}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log",
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default loginLimiter;
