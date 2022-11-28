const express = require('express');
const { check } = require('express-validator');

const auth = require('../../utils/auth');
const {
  enrollBankAccount,
  getBankAccountDetails,
  getAllBankAccounts,
} = require('./bankAccountController');

const router = express.Router();

router.post(
  '/',
  [
    check('type', 'Account type is required.').not().isEmpty(),
    check('accountNumber', 'Account number is required.').not().isEmpty(),
    check('accountName', 'Account name is required.').not().isEmpty(),
  ],
  auth,
  enrollBankAccount
);

router.get('/:id', auth, getBankAccountDetails);
router.get('/', auth, getAllBankAccounts);

module.exports = router;
