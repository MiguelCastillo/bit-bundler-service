module.exports = function packageInstallParser(packages) {
  return packages
    .map((package) => {
      return package.version ?
        [package.name, package.version].join('@') :
        package.name;
    });
};
