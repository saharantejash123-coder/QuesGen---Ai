const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => bcrypt.hash(password, 10);
const comparePassword = async (password, hash) => bcrypt.compare(password, hash);

const generateAccessToken = (userId, role) => 
  jwt.sign({ userId, role }, process.env.JWT_SECRET || 'secret', 
    { expiresIn: process.env.JWT_EXPIRY || '7d' });

const generateRefreshToken = (userId) => 
  jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d' });

const verifyAccessToken = (token) => 
  jwt.verify(token, process.env.JWT_SECRET || 'secret');

const verifyRefreshToken = (token) => 
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'refresh-secret');

module.exports = {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
