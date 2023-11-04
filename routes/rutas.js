// routes/index.js
const express = require('express');
const router = express.Router();


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
