const mongoose = require('mongoose');

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/main?retryWrites=true&w=majority`;

function connectToMongoDB() {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
}

module.exports = connectToMongoDB;
