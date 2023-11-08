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
const registerRouter = require('./js/insert/register');
const contactoRouter = require('./js/insert/contacto');
const suscripcionRouter = require('./js/insert/suscripcion');
const servicioRouter = require('./js/insert/servicio');
const regadminRouter = require('./js/insert/reg_admin');

// Usa el router con app.use(), indicando la ruta base

app.use('/', rutas);
app.use('/register', registerRouter);
app.use('/contacto', contactoRouter);
app.use('/suscripcion', suscripcionRouter);
app.use('/servicio', servicioRouter);
app.use('/reg_admin', regadminRouter);

// Autenticacion paginas
const authAdmin = require('./js/session/auth_admin');
const auth = require('./js/session/auth');

app.post("/auth_admin", authAdmin);
app.post("/auth", auth);

// Server local
app.listen(3000, () => {
  console.log('\x1b[35m%s\x1b[0m\x1b[32m%s\x1b[0m',
  'El servidor está funcionando correctamente en ', 'HTTP://localhost:3000');
});