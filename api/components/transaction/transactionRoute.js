const express = require('express');
const { check } = require('express-validator');

const auth = require('../../utils/auth');
const { addTransaction } = require('./transactionController');

const router = express.Router();

router.post(
  '/',
  [
    check('name', 'Transaction name is required.').not().isEmpty(),
    check('senderAccountNumber', 'Sender account number is required.')
      .not()
      .isEmpty(),
    check('receiverAccountNumber', 'Receiver account number is required.')
      .not()
      .isEmpty(),
    check('receiverAccountName', 'Receiver account name is required.')
      .not()
      .isEmpty(),
    check('amount', 'Amount is required.').not().isEmpty(),
  ],
  auth,
  addTransaction
);

module.exports = router;
