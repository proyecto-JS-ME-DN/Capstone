// routes/register.js
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const pool = require('../../database/db');

// Registrarse en PostgreSQL
router.post("/register", async (req, res) => {
  const { user, name, pass } = req.body;
  let passwordHaash = await bcryptjs.hash(pass, 8);
  pool.query(
    'INSERT INTO public.login ("user", name, password) VALUES ($1, $2, $3)', [user, name, passwordHaash], async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        const role = req.session.loggedin ? req.session.role : "n_reg";
        res.render("register", {
          alert: true,
          alertTitle: "Registro",
          alertMessage: "Registro Exitoso",
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
