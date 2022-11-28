require('dotenv').config();
const { validationResult } = require('express-validator');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('./userModel');
const HttpSuccess = require('../../responses/HttpSuccess');
const HttpError = require('../../responses/HttpError');
const ValidationError = require('../../responses/ValidationError');

const { JWT_SECRET } = process.env;

/**
 * Controller for request to create user
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next function to execute
 */
async function signUpUser(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json(new ValidationError(400, errors.array()));
  }

  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json(
        new ValidationError(400, {
          errors: [{ msg: 'User already existing.' }],
        })
      );
    }

    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    user = new User({
      name,
      email,
      role,
      avatar,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) {
        res
          .status(500)
          .json(new HttpError(new Date(), 500, 9999, `Error: ${err}`));
      }

      res.status(200).json(
        new HttpSuccess(200, 'User has been created.', {
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
 * Controller for request to get personal details
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next function to execute
 */
async function getPersonalDetails(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json(
      new HttpSuccess(200, 'Personal details has been retrieved.', {
        user,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(new HttpError(new Date(), 500, 9999, `Error: ${error}`));
  }
}

/**
 * Controller for request to update user email
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next function to execute
 */
async function updateEmail(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(new ValidationError(400, errors.array()));
  }

  try {
    const { email } = req.body;

    let user = await User.findOne({ email }).select('-password');

    if (email === user.email) {
      return res.status(400).json(
        new ValidationError(400, {
          errors: [{ msg: 'Email is already existing.' }],
        })
      );
    }

    user.email = email;

    await user.save();

    return res.status(200).json(
      new HttpSuccess(200, 'Email has been updated.', {
        user,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(new HttpError(new Date(), 500, 9999, `Error: ${error}`));
  }
}

/**
 * Controller for request to update user password
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next function to execute
 */
async function updatePassword(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(new ValidationError(400, errors.array()));
  }

  try {
    const { password } = req.body;

    let user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.status(400).json(
        new ValidationError(400, {
          errors: [{ msg: 'Password is already used.' }],
        })
      );
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);

    user.password = newPassword;

    await user.save();

    res.status(200).json(
      new HttpSuccess(200, 'Password has been updated.', {
        user,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(new HttpError(new Date(), 500, 9999, `Error: ${error}`));
  }
}

/**
 * Controller for request to update user password
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next function to execute
 */
async function updateDetails(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(new ValidationError(400, errors.array()));
  }

  try {
    const { name } = req.body;

    let user = await User.findById(req.user.id);

    if (user.name === name) {
      res.status(400).json(
        new ValidationError(400, {
          errors: [{ msg: 'Name is already used.' }],
        })
      );
    }

    user.name = name;

    await user.save();

    res.status(200).json(
      new HttpSuccess(200, 'Details has been updated.', {
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
  signUpUser,
  updateEmail,
  updatePassword,
  updateDetails,
  getPersonalDetails,
};
