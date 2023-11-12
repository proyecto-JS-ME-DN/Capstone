// routes/register.js
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const pool = require('../../database/db');


router.post("/", async (req, res) => {
  const { user, pass } = req.body;
  let passwordHaash = await bcryptjs.hash(pass, 8);
  pool.query(
    'INSERT INTO public.loginadmin ("user",  password) VALUES ($1, $2)', [user, passwordHaash], async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        const role = req.session.loggedin ? req.session.role : "n_reg";
        res.render("reg_admin", {
          alert: true,
          alertTitle: "Registro",
          alertMessage: "Registro Exitoso",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "dashboard",
          role
        });
      }
    }
  );
});

// Aquí puedes exportar el router para usarlo en el archivo principal
module.exports = router;