import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { RequestHandler, CookieOptions } from "express";
import User from "../models/User.js";

interface LoginBody {
  username?: string;
  password?: string;
}

interface AccessTokenPayload {
  UserInfo: {
    username: string;
    roles: string[];
  };
}

interface RefreshTokenPayload {
  username: string;
}

const refreshCookieOptions = (): CookieOptions => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

// @desc Login
// @route POST /auth
// @access Public
export const login: RequestHandler<unknown, unknown, LoginBody> = async (
  req,
  res,
) => {
  let { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  username = username.trim().toLowerCase();

  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser || !foundUser.active) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const accessSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!accessSecret || !refreshSecret) {
    res.status(500).json({ message: "Server misconfigured" });
    return;
  }

  const accessPayload: AccessTokenPayload = {
    UserInfo: {
      username: foundUser.username,
      roles: foundUser.roles,
    },
  };
  const accessToken = jwt.sign(accessPayload, accessSecret, {
    expiresIn: "15m",
  });

  const refreshPayload: RefreshTokenPayload = { username: foundUser.username };
  const refreshToken = jwt.sign(refreshPayload, refreshSecret, {
    expiresIn: "7d",
  });

  res.cookie("jwt", refreshToken, refreshCookieOptions());
  res.json({ accessToken });
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public
export const refresh: RequestHandler = (req, res) => {
  const cookies = req.cookies as { jwt?: string } | undefined;

  if (!cookies?.jwt) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
  const accessSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!refreshSecret || !accessSecret) {
    res.status(500).json({ message: "Server misconfigured" });
    return;
  }

  jwt.verify(cookies.jwt, refreshSecret, async (err, decoded) => {
    if (err || !decoded || typeof decoded === "string") {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const payload = decoded as RefreshTokenPayload;
    const foundUser = await User.findOne({ username: payload.username }).exec();
    if (!foundUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const accessPayload: AccessTokenPayload = {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    };
    const accessToken = jwt.sign(accessPayload, accessSecret, {
      expiresIn: "15m",
    });
    res.json({ accessToken });
  });
};

// @desc Logout
// @route POST /auth/logout
// @access Public
export const logout: RequestHandler = (req, res) => {
  const cookies = req.cookies as { jwt?: string } | undefined;
  if (!cookies?.jwt) {
    res.sendStatus(204);
    return;
  }
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  });
  res.json({ message: "Cookie cleared" });
};
