const Bitbundler = require('bit-bundler');
const crypto = require('crypto');
var cache = {};

module.exports = class Bundler {
  createBundle({modules}) {
    var id = buildHash(modules);
    cache[id] = { id };

    console.log('npm install', id, modules);
    console.log('run bundler', id, modules);

    return id;
  }

  getBundle({id}) {
    return {
      id: hash
    };
  }
}


function buildHash(modules) {
  var moduleMessage = JSON.stringify(
    modules
      .slice()
      .sort((a, b) => a.name > b.name)
  );

  return crypto
    .createHash('sha256')
    .update(moduleMessage)
    .digest('hex');
}

