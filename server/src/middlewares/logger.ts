import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "node:fs";
import { promises as fsPromises } from "node:fs";
import path from "node:path";
import type { RequestHandler } from "express";

export const logEvents = async (
  message: string,
  logFileName: string,
): Promise<void> => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  const logsDir = path.join(process.cwd(), "logs");

  try {
    if (!fs.existsSync(logsDir)) {
      await fsPromises.mkdir(logsDir);
    }
    await fsPromises.appendFile(path.join(logsDir, logFileName), logItem);
  } catch (err) {
    console.log(err);
  }
};

//  (req: Request, res: Response, next: NextFunction), we type the whole function as RequestHandler
export const logger: RequestHandler = (req, _res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};
