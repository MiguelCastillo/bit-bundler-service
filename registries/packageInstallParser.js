module.exports = function packageInstallParser(pkgs) {
  return pkgs
    .map((result) => {
      return result.version ?
        [result.name, result.version].join("@") :
        result.name;
    });
};
