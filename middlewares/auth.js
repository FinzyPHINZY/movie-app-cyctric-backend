const jwt = require('jsonwebtoken');
const User = require('../models/user');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '');
  } else {
    req.token = null;
  }

  next();
};

const userExtractor = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await User.findById({ _id: decodedToken.id });

    if (user) {
      req.user = user;
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
};

module.exports = { tokenExtractor, userExtractor };
