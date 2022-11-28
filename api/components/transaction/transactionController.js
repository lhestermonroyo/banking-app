const { validationResult } = require('express-validator');

const Transaction = require('./transactionModel');
const BankAccount = require('../bankAccount/bankAccountModel');
const HttpSuccess = require('../../responses/HttpSuccess');
const HttpError = require('../../responses/HttpError');
const ValidationError = require('../../responses/ValidationError');

/**
 * Controller for request to add transaction
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next function to execute
 */
async function addTransaction(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json(new ValidationError(400, errors.array()));
  }

  try {
    const {
      name,
      senderAccountNumber,
      receiverAccountNumber,
      receiverAccountName,
      amount,
      note,
    } = req.body;

    let transaction = new Transaction({
      name,
      senderAccountNumber,
      receiverAccountNumber,
      receiverAccountName,
      amount,
      note,
    });

    let senderAccount = await BankAccount.findOne({
      owner: req.user.id,
      accountNumber: senderAccountNumber,
    }).select('balance');

    // if transaction is not cash in
    if (name === 'CASH_IN') {
      transaction.endingBalance = senderAccount.balance + amount;
      senderAccount.balance = senderAccount.balance + amount;
    }

    if (name === 'CASH_OUT') {
      if (amount > senderAccount.balance) {
        res.status(400).json(
          new ValidationError(400, {
            errors: [{ msg: 'Amount is greater than the current balance.' }],
          })
        );
      }

      transaction.endingBalance = senderAccount.balance - amount;
      senderAccount.balance = senderAccount.balance - amount;
    }

    if (name === 'FUND_TRANSFER' || name === 'PAY_BILLS') {
      if (amount > senderAccount.balance) {
        res.status(400).json(
          new ValidationError(400, {
            errors: [{ msg: 'Amount is greater than the current balance.' }],
          })
        );
      }

      let receiverAccount = await BankAccount.findOne({
        accountNumber: receiverAccountNumber,
      }).select('balance');

      transaction.endingBalance = senderAccount.balance - amount;
      senderAccount.balance = senderAccount.balance - amount;
      receiverAccount.balance = receiverAccount.balance + amount;

      await receiverAccount.save();
    }

    await transaction.save();
    await senderAccount.save();

    res.status(200).json(
      new HttpSuccess(200, 'Transaction has been completed.', {
        transaction,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(new HttpError(new Date(), 500, 9999, `Error: ${error}`));
  }
}

module.exports = {
  addTransaction,
};
