// js/session/auths.js

const pool = require('../../database/db');
const bcryptjs = require('bcryptjs');

async function auth (req, res) {
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
          const role = req.session.loggedin ? req.session.role : "n_reg";
          res.render("login", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y/o contraseña incorrecta",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "login",
            role
          });
        } else {
          const role = req.session.loggedin ? req.session.role : "n_reg";
          req.session.loggedin = true;
          req.session.name = results.rows[0].name;
          req.session.role = "user"
          res.render("login", {
            alert: true,
            alertTitle: "Conexion Exitosa",
            alertMessage: "Login correcto",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "",
            role
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
};

  module.exports = auths;
