const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const connectToMongoDB = require('./database');

const signupRouter = require('./routes/signup');
const signinRouter = require('./routes/signin');
const activationRouter = require('./routes/activation');
const forgotPassword = require('./routes/forgot-password');
const resetPassword = require('./routes/reset-password');
const googleLoginRouter = require('./routes/google-login');
const userRouter = require('./routes/user');

const app = express();

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

app.disable('x-powered-by');

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
app.use('/api/google-login', googleLoginRouter);
app.use('/api/user', userRouter);

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

mountServer();
