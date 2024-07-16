const app = require('./app')
const mongoose = require('mongoose')

const MAIN_PORT = process.env.MAIN_PORT || 3000;
const DB_URL = process.env.DB_HOST;

const connection = mongoose.connect(DB_URL);

connection
  .then(() => {
    app.listen(MAIN_PORT, function () {
      console.log(`Database connection successful`);
    });
  })
  .catch((err) => {
    console.log(`Database isn't conected. Error message: ${err.message}`),
      process.exit(1)
  });