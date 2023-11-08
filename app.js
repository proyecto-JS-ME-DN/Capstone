// Invocacion express
const express = require("express");
const app = express();

//urlencoded para capturar datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//invocamos dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "env/.env" });

//directorio public
app.use("/public", express.static("public"));
app.use("/public", express.static(__dirname + "/public"));

//Motor de plantillas ejs
app.set("view engine", "ejs");

//modulo hashing para encriptar password ( bcryptjs )
const bcryptjs = require("bcryptjs");

//variables de sesion
const session = require("express-session");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//invocar conexion BD
const pool = require("./database/db");

// Importa js desde router
const rutas = require('./routes/rutas');
const registerRouter = require('./routes/register');
const contactoRouter = require('./routes/contacto');
const suscripcionRouter = require('./routes/suscripcion');
const servicioRouter = require('./routes/servicio');
const regadminRouter = require('./routes/reg_admin');

// Usa el router con app.use(), indicando la ruta base

app.use('/', rutas);
app.use('/register', registerRouter);
app.use('/contacto', contactoRouter);
app.use('/suscripcion', suscripcionRouter);
app.use('/servicio', servicioRouter);
app.use('/reg_admin', regadminRouter);

// Autenticacion paginas
app.post("/auth", async (req, res) => {
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

app.post("/auth_admin", async (req, res) => {
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
          res.render("admin", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y/o contraseña incorrecta",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "admin",
          });
        } else {
          req.session.loggedin = true;
          req.session.name = results.rows[0].name;
          res.render("admin", {
            alert: true,
            alertTitle: "Conexion Exitosa",
            alertMessage: "Login correcto",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "dashboard",
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
});

// Server local
app.listen(3000, () => {
  console.log('\x1b[35m%s\x1b[0m\x1b[32m%s\x1b[0m',
  'El servidor está funcionando correctamente en ', 'http://localhost:3000');
});