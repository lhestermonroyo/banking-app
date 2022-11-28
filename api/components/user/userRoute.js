const express = require('express');
const { check } = require('express-validator');

const auth = require('../../utils/auth');
const {
  signUpUser,
  getPersonalDetails,
  updatePassword,
  updateEmail,
  updateDetails,
} = require('./userController');

const router = express.Router();

router.post(
  '/',
  [
    check('name', 'Name is required.').not().isEmpty(),
    check('email', 'Please include a valid email.').isEmail(),
    check(
      'password',
      'Please enter a password with 8 or more characters.'
    ).isLength({ min: 8 }),
    check('role', 'Role is required.').not().isEmpty(),
  ],
  signUpUser
);

router.put('/email', [
  check('email', 'Please include a valid email.').isEmail(),
  auth,
  updateEmail,
]);

router.put('/password', [
  check(
    'password',
    'Please enter a password with 8 or more characters.'
  ).isLength({ min: 8 }),
  auth,
  updatePassword,
]);

router.put('/details', [
  check('name', 'Name is required.').not().isEmpty(),
  auth,
  updateDetails,
]);

router.get('/me', auth, getPersonalDetails);

module.exports = router;
