const Bitbundler = require("bit-bundler");
const crypto = require("crypto");
const mkdirp = require("mkdirp");
const npmRegistry = require("../registries/npm");
var cache = {};
var pending = {};

module.exports = class Bundler {
  createBundle({modules}) {
    var id = buildHash(modules);
    var targetDir = "cache/" + id;

    if (!pending[id]) {
      // create directory to store install data
      mkdirp.sync(targetDir);

      pending[id] = npmRegistry
        .install(modules, { cwd: targetDir })
        .then(cacheResult(id))
        .then(notifyListeners(id));
    }

    return id;
  }

  getBundle({id}) {
    return {
      id: hash
    };
  }
}

function cacheResult(id) {
  return (result) => {
    delete pending[id];

    cache[id] = {
      id,
      result
    };

    return result;
  };
}

function notifyListeners(id) {
  return (result) => {
    console.log(id, result);
    return result;
  };
}

function buildHash(modules) {
  var moduleMessage = JSON.stringify(
    modules
      .slice()
      .sort((a, b) => a.name > b.name)
  );

  return crypto
    .createHash("sha256")
    .update(moduleMessage)
    .digest("hex");
}
