const spawn = require('child_process').spawn;

module.exports = function execCommand(name, args, options) {
  var result = "";
  var proc = spawn(name, args, options);
  proc.stdout.setEncoding("utf8");
  proc.stderr.setEncoding("utf8");

  return new Promise(function(resolve, reject) {
    proc.stdout.on("data", function(data) {
      result += data;
    });

    proc.stderr.on("data", function(err) {
      console.error("Error executing: " + name);
      console.error(err);
    });

    proc.on("close", function(code) {
      if (code !== 0) {
        reject(code);
      }
      else {
        resolve(result);
      }
    });
  });
};
