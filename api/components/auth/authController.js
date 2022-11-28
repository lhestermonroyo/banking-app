require('dotenv').config();
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../user/userModel');
const HttpSuccess = require('../../responses/HttpSuccess');
const HttpError = require('../../responses/HttpError');
const ValidationError = require('../../responses/ValidationError');

const { JWT_SECRET } = process.env;

/**
 * Controller for request to authenticate user and get token
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next function to execute
 */
async function loginAuth(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json(new ValidationError(400, errors.array()));
  }

  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      res.status(400).json(
        new ValidationError(400, {
          errors: [{ msg: 'Email or password incorrect.' }],
        })
      );
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json(
        new ValidationError(400, {
          errors: [{ msg: 'Email or password incorrect.' }],
        })
      );
    }

    jwt.sign(payload, JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) {
        res
          .status(500)
          .json(new HttpError(new Date(), 500, 9999, `Error: ${err}`));
      }

      res.status(200).json(
        new HttpSuccess(200, 'User has been authenticated.', {
          token,
          user,
        })
      );
    });
  } catch (error) {
    res
      .status(500)
      .json(new HttpError(new Date(), 500, 9999, `Error: ${error}`));
  }
}

/**
 * Controller for request to authenticate user
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next function to execute
 */
async function authUser(req, res) {
  try {
    let user = await User.findById(req.user.id).select('-password');

    if (!user) {
      res.status(400).json(
        new ValidationError(400, {
          errors: [{ msg: 'Email or password incorrect.' }],
        })
      );
    }

    res.status(200).json(
      new HttpSuccess(200, 'User details has been retrieved.', {
        user,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(new HttpError(new Date(), 500, 9999, `Error: ${error}`));
  }
}

module.exports = {
  loginAuth,
  authUser,
};
