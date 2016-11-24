const exec = require("../../utils/exec");
const packageInstallParser = require("../packageInstallParser");
const path = require("path");

class Yarn {
  install(packages, options) {
    var cwd = options.cwd || process.cwd;
    var env = options.env || process.env;
    var packageInstall = packageInstallParser(packages);
    var yarnExec = path.join(process.cwd(), "./node_modules/.bin/yarn");

    return exec(yarnExec, ["add", ...packageInstall], { cwd, env }).then(() => packages);
  }
}

module.exports = Yarn;
