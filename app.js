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

//Establecer Rutas
app.get("/index", (req, res) => {
  res.render("index");
});

app.get("/contacto", (req, res) => {
  res.render("contacto");
});

app.get("/producto", (req, res) => {
  res.render("producto");
});

app.get("/servicio", (req, res) => {
  res.render("servicio");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// Registrarse en PostgreSQL

app.post("/register", async (req, res) => {
  const { user, name, pass } = req.body;
  let passwordHaash = await bcryptjs.hash(pass, 8);
  pool.query(
    'INSERT INTO public.login ("user", name, password) VALUES ($1, $2, $3)', [user, name, passwordHaash], async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        //Alerta despues de guardar
        res.render("register", {
          alert: true,
          alertTitle: "Registro",
          alertMessage: "Registro Exitoso",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "",
        });
      }
    }
  );
});

// Formulario Contacto
app.post("/contacto", async (req, res) => {
  const { nombre, telefono, correo, mensaje } = req.body;
  pool.query(
    "INSERT INTO public.contacto(nombre, telefono, correo, mensaje) VALUES ($1, $2, $3, $4)", [nombre, telefono, correo, mensaje], async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        //Alerta despues de guardar
        res.render("contacto", {
          alert: true,
          alertTitle: "Mensaje Enviado",
          alertMessage: "Mensaje Enviado",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "",
        });
      }
    }
  );
});

// Suscripcion Index

app.post("/index", async (req, res) => {
  const { correo } = req.body;
  pool.query(
    "INSERT INTO public.suscripcion( correo ) VALUES ($1)", [correo], async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        //Alerta despues de guardar
        res.render("index", {
          alert: true,
          alertTitle: "Suscrito",
          alertMessage: "Suscrito",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "",
        });
      }
    }
  );
});

// Autenticacion
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

// Formulario Servicio

app.post("/servicio", async (req, res) => {
  const {nombre,correo,patente,marca,tipo,fecha,hora} = req.body;
  pool.query(
    "INSERT INTO public.agenda_externo(nombre,correo,patente,marca,tipo,fecha,hora) VALUES ($1, $2, $3, $4, $5, $6, $7)", [nombre,correo,patente,marca,tipo,fecha,hora], async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        //Alerta despues de guardar
        res.render("servicio", {
          alert: true,
          alertTitle: "Agenda Registrada",
          alertMessage: "Agenda Registrada",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "",
        });
      }
    }
  );
});

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

// Cerrar Sesion

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Server local
app.listen(3000, (req, res) => {
  console.log("servidor funcionando en http://localhost:3000");
});
