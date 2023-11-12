// Formulario Servicio

// routes/formservicio.js
const express = require('express');
const router = express.Router();
const pool = require('../../database/db');

router.post("/servicio", async (req, res) => {
  const {nombre,correo,patente,marca,tipo,fecha,hora,descripcion} = req.body;
  pool.query(
    "INSERT INTO public.agenda_externo(nombre,correo,patente,marca,tipo,fecha,hora,descripcion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [nombre,correo,patente,marca,tipo,fecha,hora,descripcion], async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        const role = req.session.loggedin ? req.session.role : "n_reg";
        res.render("servicio", {
          alert: true,
          alertTitle: "Agenda Registrada",
          alertMessage: "Agenda Registrada",
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