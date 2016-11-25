const nedb = require("nedb");

class nedbAdapter {
  constructor(options) {
    this._nedb = new nedb(
      Object.assign({
        filename: '.bundler-cache',
        autoload: true
      }, options)
    )
  }

  getItem(id) {
    return new Promise((resolve, reject) => this._nedb.findOne({ id }, { _id: 0 }, resultHandler(resolve, reject)))
      .then(([result]) => result);
  }

  setItem(id, data) {
    return new Promise((resolve, reject) => this._nedb.update({ id }, data, { upsert: true }, resultHandler(resolve, reject)))
      .then(() => this.getItem(id));
  }

  deleteItem(id) {
    return Promise.resolve(this._nedb.remove({ id }));
  }
}

function resultHandler(resolve, reject) {
  return function(err, ...args) {
    if (err) {
      reject(err);
    }
    else {
      resolve(args);
    }
  }
}

module.exports = nedbAdapter;
