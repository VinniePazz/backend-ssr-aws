const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectMongo = require('./database');

const authRoutes = require('./routes/auth');

const app = express();

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  // app.use(cors()); // allows all origins
  app.use(cors({ origin: `${process.env.PUBLIC_URL}` }));
}

// routes
app.use('/api', authRoutes);

// mount server
const mountServer = async () => {
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

mountServer();
