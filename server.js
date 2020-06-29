const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectMongo = require('./database');

const signupRouter = require('./routes/signup');
const signinRouter = require('./routes/signin');
const activationRouter = require('./routes/activation');
const forgotPassword = require('./routes/forgot-password');
const resetPassword = require('./routes/reset-password');
const userRouter = require('./routes/user');

const app = express();

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  // app.use(cors()); // allows all origins
  app.use(cors({ origin: `${process.env.PUBLIC_URL}` }));
}

// routes
app.use('/api/signup', signupRouter);
app.use('/api/signin', signinRouter);
app.use('/api/forgot-password', forgotPassword);
app.use('/api/reset-password', resetPassword);
app.use('/api/account-activation', activationRouter);
app.use('/api/user', userRouter);

// mount server
const mountServer = async () => {
  const port = process.env.PORT || 8000;

  try {
    await connectMongo();
    console.log('connected to MongoDB Cluster');
    app.listen(port, () => {
      console.log(`app is running on port ${port}`);
    });
  } catch (err) {
    console.error('MONGO CONNECT ERROR', err);
  }
};

mountServer();
