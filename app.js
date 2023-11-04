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
const autenticacionRouter = require('./routes/autenticacion');
const formservicioRouter = require('./routes/formservicio');

// Usa el router con app.use(), indicando la ruta base

app.use('/', rutas);
app.use('/register', registerRouter);
app.use('/contacto', contactoRouter);
app.use('/suscripcion', suscripcionRouter);
app.use('/autenticacion', autenticacionRouter);
app.use('/formservicio', formservicioRouter);

// Autenticacion paginas

app.get("/", (req, res) => {
  if (req.session.loggedin) {
    res.render("index", {
      login: true,
      name: req.session.name,
    });
  } else {
    res.render("index", {
      login: false,
      name: "debe iniciar sesión",
    });
  }
});

// Server local
app.listen(3000, (req, res) => {
  console.log("servidor funcionando en http://localhost:3000");
});
