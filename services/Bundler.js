const Bitbundler = require("bit-bundler");
const jsPlugin = require("bit-loader-js");
const extensionsPlugin = require("bit-loader-extensions");
const builtinsPlugin = require("bit-loader-builtins");
const minifyjs = require("bit-bundler-minifyjs");
const extractsm = require("bit-bundler-extractsm");

const path = require("path");
const crypto = require("crypto");
const mkdirp = require("mkdirp");
const registry = require("../registries/provider");
const storage = require("../storage/provider");

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
    var repository = storage.getProvider();

    if (pending[id]) {
      return pending[id].then(() => repository.getItem(id));
    }

    return repository.getItem(id);
  }
}

function installPackages(options) {
  return (packages) => registry.getProvider().install(packages, options);
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
    var repository = storage.getProvider();
    var bundle = bundlerContext.bundle.content;
    var sourcemap = bundlerContext.bundle.sourcemap;
    var hash = buildHash(bundle);

    return repository
      .setItem(id, {
        id,
        hash,
        bundle,
        sourcemap
      })
      .then(() => delete pending[id])
      .then(() => bundlerContext);
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
