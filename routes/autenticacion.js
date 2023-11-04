// Autenticacion

// routes/autenticacion.js
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const pool = require('../database/db');

router.post("/auth", async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if (user && pass) {
      pool.query(
        'SELECT * FROM public.login WHERE "user" = $1',
        [user],
        async (error, results) => {
          if (
            results.rows.length == 0 ||
            !(await bcryptjs.compare(pass, results.rows[0].password))
          ) {
            //Alerta despues de guardar
            res.render("login", {
              alert: true,
              alertTitle: "Error",
              alertMessage: "Usuario y/o contraseña incorrecta",
              alertIcon: "error",
              showConfirmButton: true,
              timer: false,
              ruta: "login",
            });
          } else {
            req.session.loggedin = true;
            req.session.name = results.rows[0].name;
            res.render("login", {
              alert: true,
              alertTitle: "Conexion Exitosa",
              alertMessage: "Login correcto",
              alertIcon: "success",
              showConfirmButton: false,
              timer: 1500,
              ruta: "",
            });
          }
        }
      );
    } else {
      res.render("Advertencia", {
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese un usuario y/o contraseña",
        alertIcon: "warning",
        showConfirmButton: true,
        timer: false,
        ruta: "login",
      });
    }
  });

// Aquí puedes exportar el router para usarlo en el archivo principal
module.exports = router;