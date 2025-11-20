import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your_refresh_secret";

// Token lifetimes
const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken) {
    return res.status(401).json({ error: "Access token required" });
  }

  // STEP 1: Verify **access token**
  jwt.verify(accessToken, JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
      return next(); // VALID TOKEN ✔
    }

    // If access token failed for another reason (not expired)
    if (err.name !== "TokenExpiredError") {
      return res.status(403).json({ error: "Invalid access token" });
    }

    // STEP 2: Access token is expired → Check refresh token
    if (!refreshToken) {
      return res.status(401).json({ error: "Session expired. Login required." });
    }

    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid refresh token" });
      }

      // STEP 3: Refresh token is valid → issue NEW ACCESS TOKEN
      const newAccessToken = jwt.sign(
        {
          userId: user.userId,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: ACCESS_EXPIRES_IN }
      );

      res.setHeader("x-access-token", newAccessToken);

      req.user = user;
      next();
    });
  });
};
