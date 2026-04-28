import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type { RequestHandler } from "express";

// JwtPayload is the standard JWT claims shape (iat, exp, etc.) provided by @types/jsonwebtoken. We extend it to add the custom UserInfo field your auth controller embeds when signing tokens. This is interface inheritance — your interface is all of JwtPayload's fields plus yours.

interface UserInfoPayload extends JwtPayload {
  UserInfo: {
    username: string;
    roles: string[];
  };
}

const verifyJWT: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    res.status(500).json({ message: "Server misconfigured" });
    return;
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err || !decoded || typeof decoded === "string") {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    const payload = decoded as UserInfoPayload;
    req.user = payload.UserInfo.username;
    req.roles = payload.UserInfo.roles;
    next();
  });
};

export default verifyJWT;
