// routes/index.js
const express = require("express");
const router = express.Router();
const session = require("express-session");
const pool = require("../database/db");
const { spawn } = require("child_process");

const {
  getLoginData,
  getContactoData,
  getAgendasExtData,
  buscar,
} = require("../js/consulta/consultas");
const dashboardRoute = require("../js/session/dashboard");
const formularioAdmRoute = require("../js/session/formularioAdm");
const eliminar = require("../js/delete/delete");

const getPaypalUrl = require('../js/session/paypal');

router.get("/producto", async (req, res) => {
  const paypalUrl = await getPaypalUrl();
  console.log(`PayPal URL: ${paypalUrl}`);
  res.render("producto", { paypalUrl: paypalUrl });
});


router.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Establecer Rutas
router.get("/index", (req, res) => {
  res.render("index");
});

router.get("/contacto", (req, res) => {
  res.render("contacto");
});

router.get("/servicio", (req, res) => {
  res.render("servicio");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/admin", (req, res) => {
  res.render("admin");
});

router.get("/formulario_adm", formularioAdmRoute);
router.get("/dashboard", dashboardRoute);
router.get("/buscar", buscar);
router.get("/eliminar/:id", eliminar);

router.get("/dashboard", (req, res) => {
  if (req.session.loggedin) {
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
    });
  }
});

router.get("/formulario_adm", (req, res) => {
  if (req.session.loggedin) {
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
    });
  }
});

router.get("/lista_agendas", async (req, res) => {
  const dataext = await getAgendasExtData();
  if (req.session.loggedin) {
    res.render("lista_agendas", {
      lista_agendas: true,
      name: req.session.name,
      agendaext: dataext,
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
    });
  }
});

router.get("/reg_admin", (req, res) => {
  if (req.session.loggedin) {
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
    });
  }
});

// Cerrar Sesion

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.render("index", {
      alert: true,
      alertTitle: "Sesión Cerrada",
      alertMessage: "Su sesión se ha cerrado correctamente",
      alertIcon: "success",
      showConfirmButton: false,
      timer: 2000,
      ruta: "index",
    });
  });
});

router.get("/", (req, res) => {
  res.render("index.ejs");
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

module.exports = router;
