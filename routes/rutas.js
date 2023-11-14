// routes/index.js
const express = require("express");
const router = express.Router();
const session = require("express-session");
const pool = require("../database/db");
const { spawn } = require("child_process");
const passport = require('passport');

const {
  getLoginData,
  getContactoData,
  getAgendasExtData,
  buscar,
} = require("../js/consulta/consultas");
const dashboardRoute = require("../js/session/dashboard");
const formularioAdmRoute = require("../js/session/formularioAdm");
const eliminar = require("../js/delete/delete");

const contactoRoute = require('../js/insert/contacto');
const reg_adminRoute = require('../js/insert/reg_admin');
const registerRoute = require('../js/insert/register');
const servicioRoute = require('../js/insert/servicio');
const suscripcionRoute = require('../js/insert/suscripcion');

router.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

router.use(passport.initialize()); // Inicializa passport
router.use(passport.session());    // Utiliza passport con sesiones

//Establecer Rutas
router.get("/index", (req, res) => {
  if (req.session.role === undefined){
    req.session.role = "n_reg"
  }
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("index", { role });
});
  
router.get("/contacto", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("contacto", { role } );
});

router.get("/servicio", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("servicio", { role } );
});

router.get("/login", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("login", { role } );
});

router.get("/register", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("register", { role } );
});

router.get("/admin", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("admin", { role } );
});

router.get("/cancel-payment", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("cancel-payment", { role } );
});

router.get("/formulario_adm", formularioAdmRoute);
router.get("/dashboard", dashboardRoute);
router.get("/buscar", buscar);
router.get("/eliminar/:id", eliminar);

router.post('/contacto', contactoRoute);
router.post('/reg_admin', reg_adminRoute);
router.post('/register', registerRoute);
router.post('/servicio', servicioRoute);
router.post('/suscripcion', suscripcionRoute);

router.get("/dashboard", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  if (req.session.loggedin && req.session.role === "admin") {
    res.render("dashboard", {
      dashboard: true,
      name: req.session.name,
    });
  } else {
    res.render("index", {
      dashboard: false,
      name: "Debe iniciar sesión",
      alert: true,
      alertTitle: "Debe iniciar sesión como administrador",
      alertMessage: "Debe iniciar sesión como administrador",
      alertIcon: "error",
      showConfirmButton: false,
      timer: 1000,
      ruta: "index",
      role
    });
  }
});

router.get("/formulario_adm", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  if (req.session.loggedin && req.session.role === "admin") {
    res.render("formulario_adm", {
      dashboard: true,
      name: req.session.name,
    });
  } else {
    res.render("index", {
      dashboard: false,
      name: "Debe iniciar sesión",
      alert: true,
      alertTitle: "Debe iniciar sesión como administrador",
      alertMessage: "Debe iniciar sesión como administrador",
      alertIcon: "error",
      showConfirmButton: false,
      timer: 1000,
      ruta: "index",
      role
    });
  }
});

router.get("/lista_agendas", async (req, res) => {
  const dataext = await getAgendasExtData();
  const role = req.session.loggedin ? req.session.role : "n_reg";
  if (req.session.loggedin && req.session.role === "admin") {
    res.render("lista_agendas" , {
      lista_agendas: true,
      name: req.session.name,
      agendaext: dataext
    });
  } else {
    res.render("index", {
      lista_agendas: false,
      name: "Debe iniciar sesión",
      alert: true,
      alertTitle: "Debe iniciar sesión como administrador",
      alertMessage: "Debe iniciar sesión como administrador",
      alertIcon: "error",
      showConfirmButton: false,
      timer: 1000,
      ruta: "index",
      role
    });
  }
});

router.get("/reg_admin", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  if (req.session.loggedin && req.session.role === "admin") {
    res.render("reg_admin", {
      reg_admin: true,
      name: req.session.name,
    });
  } else {
    res.render("index", {
      reg_admin: false,
      name: "Debe iniciar sesión",
      alert: true,
      alertTitle: "Debe iniciar sesión como administrador",
      alertMessage: "Debe iniciar sesión como administrador",
      alertIcon: "error",
      showConfirmButton: false,
      timer: 1000,
      ruta: "index",
      role
    });
  }
});

// Cerrar Sesion

router.get("/logout", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  req.session.destroy(() => {
    res.render("index",{
      alert: true,
      alertTitle: "Sesión Cerrada",
      alertMessage: "Su sesión se ha cerrado correctamente",
      alertIcon: "success",
      showConfirmButton: false,
      timer: 2000,
      ruta: "index",
      role
    });
  });
});

router.get("/", (req, res) => {
  if (req.session.role === undefined){
    req.session.role = "n_reg"
  }
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("index", { role } );
});

/*
//Paypal
router.get("/producto", (req, res) => {
  // Ejecuta tu script de Python
  const python = spawn("python", ["./python/paypal.py"]);

  // Captura la salida del script
  let paypalUrl = '';
  python.stdout.on("data", (data) => {
    // La salida del script es el enlace de PayPal
    paypalUrl += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  python.on("close", (code) => {
    console.log(`PayPal URL: ${paypalUrl}`);
    res.render("producto", { paypalUrl: paypalUrl });
  });  
});
*/

// Compra Paypal
const getPaypalUrl = require('../js/session/paypal');

router.get("/producto", async (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  const paypalUrl = await getPaypalUrl();
  console.log(`PayPal URL: ${paypalUrl}`);
  res.render("producto", { paypalUrl: paypalUrl, role });
});

//Comprobante y Guardar en BD
const executePayment = require('../js/session/executePayment');

router.get('/execute-payment', (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  const token = req.query.token;
  executePayment(token, (err, paymentData) => {
      if (err) {
          // manejar error
      } else {
          if (paymentData.payment_source && paymentData.payment_source.paypal) {
              const id_pago = paymentData.id;
              const estado = paymentData.status;
              const email_paypal = paymentData.payment_source.paypal.email_address;
              const nombre_comprador = paymentData.payment_source.paypal.name.given_name + ' ' + paymentData.payment_source.paypal.name.surname;
              const codigo_pais = paymentData.payment_source.paypal.address.country_code;
              const nombre_envio = paymentData.purchase_units[0].shipping.name.full_name;
              const direccion_envio = paymentData.purchase_units[0].shipping.address.address_line_1 + ', ' + paymentData.purchase_units[0].shipping.address.admin_area_2 + ', ' + paymentData.purchase_units[0].shipping.address.admin_area_1 + ', ' + paymentData.purchase_units[0].shipping.address.postal_code + ', ' + paymentData.purchase_units[0].shipping.address.country_code;
              const monto_compra = paymentData.purchase_units[0].payments.captures[0].amount.value;
              const monto_bruto = paymentData.purchase_units[0].payments.captures[0].seller_receivable_breakdown.gross_amount.value;
              const comision_paypal = paymentData.purchase_units[0].payments.captures[0].seller_receivable_breakdown.paypal_fee.value;
              const monto_neto = paymentData.purchase_units[0].payments.captures[0].seller_receivable_breakdown.net_amount.value;

              pool.query(
                  'INSERT INTO public.comprobante("id_pago", "estado", "email_paypal", "nombre_comprador", "codigo_pais", "nombre_envio", "direccion_envio", "monto_compra", "monto_bruto", "comision_paypal", "monto_neto") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', 
                  [id_pago, estado, email_paypal, nombre_comprador, codigo_pais, nombre_envio, direccion_envio, monto_compra, monto_bruto, comision_paypal, monto_neto], 
                  async (error, results) => {
                      if (error) {
                          console.log(error);
                      } else {
                          res.render("paymentResult", {
                              alert: true,
                              alertTitle: "Compra Realizada",
                              alertMessage: "Compra Realizada",
                              alertIcon: "success",
                              showConfirmButton: false,
                              timer: 1500,
                              ruta: "",
                              paymentData: paymentData, role
                          });
                      }
                  }
              );
          }
      }
  });
});



module.exports = router;
