const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectMongo = require('./database');

// import routes
const authRoutes = require('./routes/auth');

const app = express();

// app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// app.use(cors()); // allows all origins
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: `${process.env.PUBLIC_URL}` }));
}

// middleware
app.use('/api', authRoutes);

// mount server
const startServer = async () => {
  const port = process.env.PORT || 8000;

  try {
    await connectMongo();
    console.log('connected to MongoDB Cluster');
  } catch (err) {
    console.error(err);
  }

  app.listen(port, () => {
    console.log(`app is running on port ${port}`);
  });
};

startServer();
