const express = require('express');
const { check } = require('express-validator');
const auth = require('../../utils/auth');

const { loginAuth, authUser } = require('./authController');

const router = express.Router();

router.post(
  '/',
  [
    check('email', 'Email address is required.').isEmail(),
    check('password', 'Password is required.').not().isEmpty(),
  ],
  loginAuth
);

router.get('/', auth, authUser);

module.exports = router;
