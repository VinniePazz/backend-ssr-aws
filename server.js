const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const cors = require('cors');
require('dotenv').config();
const connectToMongoDB = require('./database');

const signupRouter = require('./routes/signup');
const signinRouter = require('./routes/signin');
const activationRouter = require('./routes/activation');
const forgotPassword = require('./routes/forgot-password');
const resetPassword = require('./routes/reset-password');
const googleLoginRouter = require('./routes/google');
const customersRouter = require('./routes/customer');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');

const app = express();

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  // !!! Once in production, don't forget to modify req.headers.origin to the exact website you wish to allow to connect.
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header(
      'Access-Control-Allow-Methods',
      'GET,PUT,POST,PATCH,DELETE,UPDATE,OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
    );
    next();
  });
}

// routes
app.use('/api/signup', signupRouter);
app.use('/api/signin', signinRouter);
app.use('/api/google', googleLoginRouter);
app.use('/api/forgot-password', forgotPassword);
app.use('/api/reset-password', resetPassword);
app.use('/api/account-activation', activationRouter);
app.use('/api/customers', customersRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

app.all('*', (req, res) => {
  res.status(404).json({ status: 'fail' });
});

// app.use(globalErrorHandler);

// mount server
const mountServer = () => {
  const port = process.env.PORT || 8000;

  const connectionSuccess = ({ connections }) => {
    const { user, host } = connections[0];

    console.log(`connected to ${host} by ${user}`);
    app.listen(port, () => {
      console.log(`app is running on port ${port}`);
    });
  };

  const connectionError = (err) => {
    console.error('MONGO CONNECT ERROR', err);
  };

  connectToMongoDB().then(connectionSuccess).catch(connectionError);
};

const mountServerWithoutDB = () => {
  const port = process.env.PORT || 8000;

  app.listen(port, () => {
    console.log(`app is running on port ${port} without db`);
  });
};

mountServer();
// mountServerWithoutDB();
