const spawn = require('child_process').spawn;

module.exports = function execCommand(name, args, options) {
  var result = "";
  var checkdeps = spawn(name, args, options);
  checkdeps.stdout.setEncoding("utf8");
  checkdeps.stderr.setEncoding("utf8");

  return new Promise(function(resolve, reject) {
    checkdeps.stdout.on("data", function(data) {
      result += data;
    });

    checkdeps.stderr.on("data", function(err) {
      console.error(err);
    });

    checkdeps.on("close", function(code) {
      if (code !== 0) {
        reject(code);
      }

      if (result) {
        resolve(result);
      }
      else {
        resolve();
      }
    });
  });
};
