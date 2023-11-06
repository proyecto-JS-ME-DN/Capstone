// Formulario Servicio

// routes/formservicio.js
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const pool = require('../database/db');

router.post("/", async (req, res) => {
    const {nombre,correo,patente,marca,tipo,fecha,hora} = req.body;
    pool.query(
      "INSERT INTO public.agenda_externo(nombre,correo,patente,marca,tipo,fecha,hora) VALUES ($1, $2, $3, $4, $5, $6, $7)", [nombre,correo,patente,marca,tipo,fecha,hora], async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          //Alerta despues de guardar
          res.render("servicio", {
            alert: true,
            alertTitle: "Agenda Registrada",
            alertMessage: "Agenda Registrada",
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