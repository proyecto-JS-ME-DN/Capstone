// routes/index.js
const express = require('express');
const router = express.Router();
const session = require("express-session");
const pool = require("../database/db");
router.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

async function getAgendasExtData() {
  try {
      const result = await pool.query('SELECT * FROM public.agenda_externo');
      return result.rows; // Añade esta línea
  } catch (err) {
      console.error(err);
  }
}


//Establecer Rutas
  router.get("/index", (req, res) => {
    res.render("index");
  });
  
  router.get("/contacto", (req, res) => {
    res.render("contacto");
  });
  
  router.get("/producto", (req, res) => {
    res.render("producto");
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

  router.get("/lista_agendas", async (req, res) => {
    const dataext = await getAgendasExtData();
    if (req.session.loggedin) {
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
      res.render("index",{
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
  
  
module.exports = router;
