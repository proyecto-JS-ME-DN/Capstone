// paypal.js
const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config({ path: "env/.env" });

const CLIENT = process.env.CLIENT;
const SECRET = process.env.SECRET;
const PAYPAL_API = process.env.PAYPAL_API;

// Los datos de tu orden
const body = {
    intent: 'CAPTURE',
    purchase_units: [{
        amount: {
            currency_code: 'USD',
            value: '10'
        }
    }],
    application_context: {
        brand_name: 'MotorsSolution',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `https://motorssolution.onrender.com/execute-payment`,
        cancel_url: `https://motorssolution.onrender.com/cancel-payment`
//      return_url: `HTTP://localhost:3000/execute-payment`,
//      cancel_url: `HTTP://localhost:3000/cancel-payment`
    }
};

function getPaypalUrl() {
  return axios.post(`${PAYPAL_API}/v2/checkout/orders`, body, {
    auth: {
        username: CLIENT,
        password: SECRET
    }
  }).then(response => {
    // Extraer el enlace de aprobación de la respuesta
    return response.data.links.find(link => link.rel === 'approve').href;
  });
}

module.exports = getPaypalUrl;
