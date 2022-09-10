const mongoose = require('mongoose')
class Database {
  constructor() {
    this._connect()
  }
  _connect() {
    try {
      const conn = mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      console.log('Database connection successful ')
    } catch (err) {
      console.log(err.message)
    }
  }
}
module.exports = new Database()
