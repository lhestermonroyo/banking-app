require('dotenv').config();
const express = require('express');

const connectDB = require('./api/config/db');

const { APP_PORT } = process.env;

const app = express();
connectDB();

// access req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', require('./api/components/auth/authRoute'));
app.use('/user', require('./api/components/user/userRoute'));
app.use('/account', require('./api/components/bankAccount/bankAccountRoute'));
app.use(
  '/transaction',
  require('./api/components/transaction/transactionRoute')
);

app.listen(APP_PORT, err => {
  if (err) {
    throw new Error('Error:', err);
  }

  console.log('Server open at port:', APP_PORT);
});
