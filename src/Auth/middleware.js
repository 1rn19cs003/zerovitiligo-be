import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';
const TOKEN_EXPIRATION = '15m'; // example token lifetime
const REFRESH_TOKEN_EXPIRATION = '7d'; // example refresh token lifetime

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    req.user = user;

    const refreshedToken = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    res.setHeader('x-access-token', refreshedToken);

    next();
  });
};
