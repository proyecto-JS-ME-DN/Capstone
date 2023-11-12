// js/session/auth_admin.js

const pool = require('../../database/db');
const bcryptjs = require('bcryptjs');

async function authAdmin(req, res) {
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordHaash = await bcryptjs.hash(pass, 8);
  if (user && pass) {
    pool.query(
      'SELECT * FROM public.loginadmin WHERE "user" = $1',
      [user],
      async (error, results) => {
        if (
          results.rows.length == 0 ||
          !(await bcryptjs.compare(pass, results.rows[0].password))
        ) {
          //Alerta despues de guardar
          const role = req.session.loggedin ? req.session.role : "n_reg";
          res.render("admin", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y/o contraseña incorrecta",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "admin",
            role
          });
        } else {
          const role = req.session.loggedin ? req.session.role : "n_reg";
          req.session.loggedin = true;
          req.session.name = results.rows[0].name;
          req.session.role = "admin"
          res.render("admin", {
            alert: true,
            alertTitle: "Conexion Exitosa",
            alertMessage: "Login correcto",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "dashboard",
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
      ruta: "admin",
    });
  }
}

module.exports = authAdmin;
