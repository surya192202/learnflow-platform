const jwt = require('jsonwebtoken');
const env = require('../config/env');

exports.generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  });
};

exports.generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });
};

exports.verifyToken = (token, isRefresh = false) => {
  const secret = isRefresh ? env.jwt.refreshSecret : env.jwt.accessSecret;
  return jwt.verify(token, secret);
};
