import jwt from "jsonwebtoken";
import { ROLES } from "../Utils/index.utils.js";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ACCESS_EXPIRES_IN = "120m";
const isProd = process.env.NODE_ENV === "production";

export const authenticateJWT = (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken)
    return res.status(401).json({ error: "Access token required" });

  jwt.verify(accessToken, ACCESS_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
      return next();
    }

    if (err.name !== "TokenExpiredError") {
      return res.status(403).json({ error: "Invalid access token" });
    }

    // STEP 2 — Access Token Expired → check refresh token
    if (!refreshToken)
      return res.status(401).json({ error: "Session expired. Login again." });

    jwt.verify(refreshToken, REFRESH_SECRET, (err, refreshPayload) => {
      if (err) {
        return res.status(403).json({ error: "Invalid refresh token" });
      }

      // STEP 3 — Issue NEW access token
      const newAccessToken = jwt.sign(
        {
          id: refreshPayload?.id,
          email: refreshPayload.email,
          role: refreshPayload.role,
        },
        ACCESS_SECRET,
        { expiresIn: ACCESS_EXPIRES_IN }
      );


      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 15 * 60 * 1000,
      });

      // attach decoded user
      req.user = refreshPayload;
      req.role = refreshPayload.role || ROLES.USER;

      next();
    });
  });
};

/**
 * Middleware to check if user has ADMIN role
 * Must be used after authenticateJWT
 */
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required"
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: Insufficient permissions"
      });
    }

    next();
  };
};