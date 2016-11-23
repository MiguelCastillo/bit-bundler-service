const exec = require("../../utils/exec");

class Npm {
  install(packages, options) {
    var cwd = options.cwd || process.cwd;
    var env = options.env || process.env;
    var packageInstall = getPackageInstall(packages);

    return exec("npm", ["install", ...packageInstall], { cwd, env }).then(() => packages);
  }
}

function getPackageInstall(packages) {
  return packages
    .map((package) => {
      return package.version ?
        [package.name, package.version].join('@') :
        package.name;
    });
}

module.exports = Npm;
