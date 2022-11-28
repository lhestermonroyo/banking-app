const mongoose = require('mongoose');

const BankAccountSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  type: {
    type: String, // Debit or Credit
    required: true,
  },
  accountNumber: {
    type: String, // Account number on card
    required: true,
  },
  accountName: {
    type: String, // Account name on card
    required: true,
  },
  balance: {
    type: Number, // Current balance
    required: true,
  },
  locked: {
    type: Boolean, // Lock or unlock the account number for transactions
    required: true,
  },
  dateEnrolled: {
    type: Date, // Bank account enroll date on the app
    default: Date.now,
  },
});

module.exports = BankAccount = mongoose.model('accounts', BankAccountSchema);
