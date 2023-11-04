// Suscripcion Index

// routes/suscripcion.js
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const pool = require('../database/db');

router.post("/index", async (req, res) => {
    const { correo } = req.body;
    pool.query(
      "INSERT INTO public.suscripcion( correo ) VALUES ($1)", [correo], async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          //Alerta despues de guardar
          res.render("index", {
            alert: true,
            alertTitle: "Suscrito",
            alertMessage: "Suscrito",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "",
          });
        }
      }
    );
  });

// Aquí puedes exportar el router para usarlo en el archivo principal
module.exports = router;