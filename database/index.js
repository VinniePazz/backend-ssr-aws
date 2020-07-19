const mongoose = require('mongoose');

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/main?retryWrites=true&w=majority`;

const mongooseOptions = {
  promiseLibrary: global.Promise,
  poolSize: 50,
  keepAlive: 30000,
  connectTimeoutMS: 5000,
  reconnectTries: Number.MAX_SAFE_INTEGER,
  reconnectInterval: 5000,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

function connectToMongoDB() {
  return mongoose.connect(url, mongooseOptions);
}

module.exports = connectToMongoDB;
