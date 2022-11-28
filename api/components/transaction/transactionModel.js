const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
  name: {
    type: String, // Transaction name
    required: true,
  },
  senderAccountNumber: {
    type: String, // Sender
  },
  receiverAccountNumber: {
    type: String, // Receiver
  },
  receiverAccountName: {
    type: String,
  },
  amount: {
    type: Number, // Transaction amount
    required: true,
  },
  note: {
    type: String,
  },
  endingBalance: {
    type: Number, // Balance after this transaction
    required: true,
  },
  transactionDate: {
    type: Date, // Date of transaction
    default: Date.now,
  },
});

module.exports = Transaction = mongoose.model('transaction', TransactionSchema);
