const Bitbundler = require("bit-bundler");
const jsPlugin = require("bit-loader-js");
const extensionsPlugin = require("bit-loader-extensions");
const builtinsPlugin = require("bit-loader-builtins");
const minifyjs = require("bit-bundler-minifyjs");
const extractsm = require("bit-bundler-extractsm");

const path = require("path");
const crypto = require("crypto");
const mkdirp = require("mkdirp");
const npmRegistry = require("../registries/npm");

var cache = {};
var pending = {};

module.exports = class Bundler {
  createBundle({modules}) {
    var id = packagesHash(modules);
    var targetDir = path.resolve("cache/" + id);

    if (!pending[id]) {
      // create directory to store install data
      mkdirp.sync(targetDir);

      pending[id] = Promise.resolve(modules)
        .then(installPackages({ id, cwd: targetDir }))
        .then(createBundle({ id, cwd: targetDir }))
        .then(cacheBundle(id))
        .then(notifyListeners(id));
    }

    return id;
  }

  getBundle({id}) {
    if (pending[id]) {
      return pending[id].then(() => cache[id]);
    }

    return Promise.resolve(cache[id]);
  }
}

function installPackages(options) {
  return (packages) => npmRegistry.install(packages, options);
}

function createBundle(options) {
  return (packages) => {
    var packageNames = packages.map((package) => package.name);

    return Bitbundler.bundle({
        cwd: options.cwd,
        src: packageNames,
        dest: path.resolve(options.cwd, "bundle.js"),
        resolve: false
      }, {
        loader: {
          baseUrl: options.cwd,
          plugins: [
            extensionsPlugin(["js", "json"]),
            jsPlugin({ extensions: ["js", "json"] }),
            builtinsPlugin()
          ]
        },
        bundler: {
          exportNames: true,
          plugins: [
            minifyjs(),
            extractsm()
          ]
        }
    });
  };
}

function cacheBundle(id) {
  return (bundlerContext) => {
    var bundle = bundlerContext.bundle.content;
    var sourcemap = bundlerContext.bundle.sourcemap;
    var hash = buildHash(bundle);

    cache[id] = {
      id,
      hash,
      bundle,
      sourcemap
    };

    delete pending[id];
    return bundlerContext;
  };
}

function notifyListeners(id) {
  return (result) => {
    return result;
  };
}

function packagesHash(packages) {
  var packagesMessage = JSON.stringify(
    packages
      .slice()
      .sort((a, b) => a.name > b.name)
  );

  return buildHash(packagesMessage);
}

function buildHash(message) {
  return crypto
    .createHash("sha1")
    .update(message)
    .digest("hex");
}
