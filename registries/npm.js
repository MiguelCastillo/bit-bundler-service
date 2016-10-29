const exec = require("../utils/exec");

function install(packages, options) {
  var cwd = options.cwd || process.cwd;
  var env = options.env || process.env;
  var packageInstall = getPackageInstall(packages);

  return exec("yarn", ["add", ...packageInstall], { cwd, env }).then(() => packages);
}

function getPackageInstall(packages) {
  return packages
    .map((package) => {
      return package.version ?
        [package.name, package.version].join('@') :
        package.name;
    });
}

module.exports.install = install;
