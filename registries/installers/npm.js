const exec = require("../../utils/exec");
const packageInstallParser = require("../packageInstallParser");

/**
 * DO NOT - USE. NPM refuses to install modules using CWD. So we are
 * using yarn which behaves as expected.
 */
class Npm {
  install(packages, options) {
    var cwd = options.cwd || process.cwd;
    var env = options.env || process.env;
    var packageInstall = packageInstallParser(packages);

    return exec("npm", ["install", ...packageInstall], { cwd, env }).then(() => packages);
  }
}

module.exports = Npm;
