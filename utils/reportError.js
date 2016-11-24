module.exports = function reportError(err) {
  var errMsg = err && err.stack ? err.stack : err;
  console.error(errMsg);
};
