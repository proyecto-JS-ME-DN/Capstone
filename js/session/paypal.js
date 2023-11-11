// paypal.js
const axios = require('axios');

// Tus credenciales de PayPal
const CLIENT = 'Ac49PuTgBmuyf-VlmLq4Axf5BX3F5O3uO81kbsO_GTBrErCfrMeE9DwAD37LapgPeV6R2cn3ik7sjvkP';
const SECRET = 'EFbC49mwdaABS-iIl59jxczdL1lUJJZKe2WzjvOJXLqPTZH9judvhZfjRVU_pkm9R5jGTgrQVRPl8nrm';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

// Los datos de tu orden
const body = {
    intent: 'CAPTURE',
    purchase_units: [{
        amount: {
            currency_code: 'USD',
            value: '100'
        }
    }],
    application_context: {
        brand_name: 'MotorsSolution',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: 'https://motorssolution.onrender.com/execute-payment',
        cancel_url: 'https://motorssolution.onrender.com/cancel-payment'
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
