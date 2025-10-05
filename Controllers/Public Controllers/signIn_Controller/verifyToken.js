const jwt = require('jsonwebtoken');
const secretKey = "secretkey";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });

    // Attach to req
    req.userId = decoded.id;
    req.email = decoded.email;

    next();
  });
};

module.exports = { verifyToken };
