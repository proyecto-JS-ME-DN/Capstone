// Invocacion express
const express = require("express");
const app = express();
const cors = require('cors');
const request = require('request');

//urlencoded para capturar datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())


//invocamos dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "env/.env" });

//directorio public
app.use("/public", express.static("public"));
app.use("/public", express.static(__dirname + "/public"));

//Motor de plantillas ejs
app.set("view engine", "ejs");

//modulo hashing para encriptar password ( bcryptjs )
const bcryptjs = require("bcryptjs");

//variables de sesion
const session = require("express-session");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//invocar conexion BD
const pool = require("./database/db");

// Importa js desde router
const rutas = require('./routes/rutas');
const registerRouter = require('./js/insert/register');
const contactoRouter = require('./js/insert/contacto');
const suscripcionRouter = require('./js/insert/suscripcion');
const servicioRouter = require('./js/insert/agendar_servicio');
const regadminRouter = require('./js/insert/reg_admin');


// Usa el router con app.use(), indicando la ruta base
app.use('/', rutas);
app.use('/register', registerRouter);
app.use('/contacto', contactoRouter);
app.use('/suscripcion', suscripcionRouter);
app.use('/agendar_servicio', servicioRouter);
app.use('/reg_admin', regadminRouter);

// Autenticacion paginas
const authAdmin = require('./js/session/auth_admin');
const auths = require('./js/session/auths');

app.post("/auth_admin", authAdmin);
app.post("/auths", auths);

//Paypal
const CLIENT = process.env.CLIENT;
const SECRET = process.env.SECRET;
const PAYPAL_API = process.env.PAYPAL_API;
const auth = { user: CLIENT, pass: SECRET }

const createPayment = (req, res) => {

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
          landing_page: 'NO_PREFERENCE', // Default
          user_action: 'PAY_NOW', // Accion para que en paypal muestre el monto del pago
          return_url: `https://motorssolution.onrender.com/execute-payment`, // Url despues de realizar el pago
          cancel_url: `https://motorssolution.onrender.com/cancel-payment` // Url despues de realizar el pago
//          return_url: `HTTP://localhost:3000/execute-payment`,
//          cancel_url: `HTTP://localhost:3000/cancel-payment`
      }
  }
  //https://api-m.sandbox.paypal.com/v2/checkout/orders [POST]

  request.post(`${PAYPAL_API}/v2/checkout/orders`, {
    auth,
    body,
    json: true
}, (err, response) => {
    res.json({ data: response.body })
})
}

app.post('/create-payment', createPayment)

// Server local
app.listen(3000, () => {
  console.log('\x1b[35m%s\x1b[0m\x1b[32m%s\x1b[0m',
  'El servidor está funcionando correctamente en ', 'HTTP://localhost:3000');
});