// executePayment.js
const request = require('request');
const dotenv = require("dotenv");
dotenv.config({ path: "env/.env" });

const CLIENT = process.env.CLIENT;
const SECRET = process.env.SECRET;
const PAYPAL_API = process.env.PAYPAL_API;
const auth = { user: CLIENT, pass: SECRET }

const executePayment = (token, callback) => {
    request.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {
        auth,
        body: {},
        json: true
    }, (err, response) => {
        if (err) {
            callback(err);
        } else {
            callback(null, response.body);
        }
    });
}

module.exports = executePayment;
