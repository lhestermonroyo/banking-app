const { validationResult } = require('express-validator');

const BankAccount = require('../bankAccount/bankAccountModel');
const HttpSuccess = require('../../responses/HttpSuccess');
const HttpError = require('../../responses/HttpError');
const ValidationError = require('../../responses/ValidationError');

/**
 * Controller for request to enroll bank account
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next function to execute
 */
async function enrollBankAccount(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json(new ValidationError(400, errors.array()));
  }

  try {
    let owner = req.user.id;
    let { type, accountNumber, accountName } = req.body;

    let bankAccount = await BankAccount.findOne({ accountNumber });

    if (bankAccount) {
      res.status(400).json(
        new ValidationError(400, {
          errors: [{ msg: 'Bank account already existing.' }],
        })
      );
    }

    bankAccount = new BankAccount({
      owner,
      type,
      accountNumber,
      accountName,
      balance: 0,
      locked: false,
      transactionHistory: [],
    });

    await bankAccount.save();

    res.status(200).json(
      new HttpSuccess(200, 'Bank account has been enrolled.', {
        bankAccount,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(new HttpError(new Date(), 500, 9999, `Error: ${error}`));
  }
}

/**
 * Controller for request to toggle lock and unlock of bank accounts
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next function to execute
 */
async function toggleLockBankAccount(req, res) {
  try {
    const bankAccountId = req.body.id;

    let bankAccount = await BankAccount.findOne({
      owner: req.user.id,
      id: bankAccountId,
    });

    if (!bankAccount) {
      res.status(400).json(
        new ValidationError(400, {
          errors: [{ msg: 'Bank account not existing.' }],
        })
      );
    }

    bankAccount.locked = !bankAccount.locked;

    await bankAccount.save();

    res.status(200).json(
      new HttpSuccess(
        200,
        bankAccount.locked
          ? 'Bank account has been locked.'
          : 'Bank account has been unlocked.',
        {
          bankAccount,
        }
      )
    );
  } catch (error) {
    res
      .status(500)
      .json(new HttpError(new Date(), 500, 9999, `Error: ${error}`));
  }
}

/**
 * Controller for request to get all bank accounts
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next function to execute
 */
async function getAllBankAccounts(req, res) {
  try {
    let bankAccountList = await BankAccount.find({
      owner: req.user.id,
    });

    res.status(200).json(
      new HttpSuccess(200, 'Bank account list has been retrieved.', {
        bankAccountList,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(new HttpError(new Date(), 500, 9999, `Error: ${error}`));
  }
}

/**
 * Controller for request to get bank account details
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next function to execute
 */
async function getBankAccountDetails(req, res) {
  try {
    const bankAccountId = req.body.id;
    const owner = req.user.id;
    let bankAccountDetails = await BankAccount.findOne({
      owner,
      id: bankAccountId,
    });

    res.status(200).json(
      new HttpSuccess(200, 'Bank account details has been retrieved.', {
        bankAccountDetails,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(new HttpError(new Date(), 500, 9999, `Error: ${error}`));
  }
}

module.exports = {
  enrollBankAccount,
  toggleLockBankAccount,
  getAllBankAccounts,
  getBankAccountDetails,
};
