const exec = require("../../utils/exec");
const packageInstallParser = require("../packageInstallParser");

class Yarn {
  install(packages, options) {
    var cwd = options.cwd || process.cwd;
    var env = options.env || process.env;
    var packageInstall = packageInstallParser(packages);

    return exec("../../node_modules/.bin/yarn", ["add", ...packageInstall], { cwd, env }).then(() => packages);
  }
}

module.exports = Yarn;
