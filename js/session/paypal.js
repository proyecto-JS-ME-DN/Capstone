const { spawn } = require('child_process');

function getPaypalUrl() {
  return new Promise((resolve, reject) => {
    const python = spawn("python", ["./python/paypal.py"]);
    let paypalUrl = '';

    python.stdout.on("data", (data) => {
      paypalUrl += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    python.on("close", (code) => {
      resolve(paypalUrl);
    });
  });
}

module.exports = getPaypalUrl;
