require('dotenv').config();
const jwt = require('jsonwebtoken');
const HttpError = require('../responses/HttpError');

const { JWT_TOKEN } = process.env;

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res
      .status(401)
      .json(
        new HttpError(new Date(), 401, 'Invalid token, permission denied.')
      );
  }

  try {
    const decodedToken = jwt.decode(token, JWT_TOKEN);

    req.user = decodedToken.user;
    next();
  } catch (error) {
    return res
      .status(500)
      .json(
        new HttpError(
          new Date(),
          500,
          9999,
          'Error: No token, authorization denied.'
        )
      );
  }
};
