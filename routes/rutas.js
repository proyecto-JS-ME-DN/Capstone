// routes/index.js
const express = require('express');
const router = express.Router();
const session = require("express-session");
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
      });
    }
  });

  router.get("/lista_agendas", (req, res) => {
    if (req.session.loggedin) {
      res.render("lista_agendas", {
        lista_agendas: true,
        name: req.session.name,
      });
    } else {
      res.render("index", {
        lista_agendas: false,
        name: "Debe iniciar sesión",
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
      });
    }
  });

// Cerrar Sesion

  router.get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
  
  router.get("/", (req, res) => {
    res.render("index.ejs");
  });
  
  
module.exports = router;
