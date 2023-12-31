// routes/contacto.js
const express = require('express');
const router = express.Router();
const pool = require('../../database/db');

// Formulario Contacto
router.post("/contacto", async (req, res) => {
    const { nombre, telefono, correo, mensaje } = req.body;
    pool.query(
      "INSERT INTO public.contacto(nombre, telefono, correo, mensaje) VALUES ($1, $2, $3, $4)", [nombre, telefono, correo, mensaje], async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          //Alerta despues de guardar
          const role = req.session.loggedin ? req.session.role : "n_reg";
          res.render("contacto", {
            alert: true,
            alertTitle: "Mensaje Enviado",
            alertMessage: "Mensaje Enviado",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "",
            role
          });
        }
      }
    );
  });

// Aquí puedes exportar el router para usarlo en el archivo principal
module.exports = router;

