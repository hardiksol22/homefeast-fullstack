const jwt = require('jsonwebtoken');

// 1. Check if user is logged in (Valid Token)
exports.protect = (req, res, next) => {
  let token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Standard format: "Bearer <token>"
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Isme userId aur role hoga
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// 2. Check if the logged-in user is a Cook
exports.isCook = (req, res, next) => {
  if (req.user && req.user.role === 'cook') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Only cooks can perform this action.' });
  }
};