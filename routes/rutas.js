// routes/index.js
const express = require("express");
const router = express.Router();
const session = require("express-session");
const pool = require("../database/db");
const { spawn } = require("child_process");
const passport = require('passport');

const {
  getLoginData,
  getContactoData,
  getAgendasExtData,
  getComprobante,
  buscar,
} = require("../js/consulta/consultas");
const dashboardRoute = require("../js/session/dashboard");
const formularioAdmRoute = require("../js/session/formularioAdm");
const eliminar = require("../js/delete/delete");

const contactoRoute = require('../js/insert/contacto');
const reg_adminRoute = require('../js/insert/reg_admin');
const registerRoute = require('../js/insert/register');
const servicioRoute = require('../js/insert/agendar_servicio');
const suscripcionRoute = require('../js/insert/suscripcion');

router.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

router.use(passport.initialize()); // Inicializa passport
router.use(passport.session());    // Utiliza passport con sesiones

//Establecer Rutas
router.get("/index", (req, res) => {
  if (req.session.role === undefined){
    req.session.role = "n_reg"
  }
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("index", { role });
});
  
router.get("/contacto", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("contacto", { role } );
});

router.get("/login", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("login", { role } );
});

router.get("/register", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("register", { role } );
});

router.get("/admin", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("admin", { role } );
});

router.get("/cancel-payment", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("cancel-payment", { role } );
});

router.get("/formulario_adm", formularioAdmRoute);
router.get("/dashboard", dashboardRoute);
router.get("/buscar", buscar);
router.get("/eliminar/:id", eliminar);

router.post('/contacto', contactoRoute);
router.post('/reg_admin', reg_adminRoute);
router.post('/register', registerRoute);
router.post('/agendar_servicio', servicioRoute);
router.post('/suscripcion', suscripcionRoute);

router.get("/dashboard", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  if (req.session.loggedin && req.session.role === "admin") {
    res.render("dashboard", {
      dashboard: true,
      name: req.session.name,
    });
  } else {
    res.render("index", {
      dashboard: false,
      name: "Debe iniciar sesión",
      alert: true,
      alertTitle: "Debe iniciar sesión como administrador",
      alertMessage: "Debe iniciar sesión como administrador",
      alertIcon: "error",
      showConfirmButton: false,
      timer: 1000,
      ruta: "index",
      role
    });
  }
});

router.get("/formulario_adm", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  if (req.session.loggedin && req.session.role === "admin") {
    res.render("formulario_adm", {
      dashboard: true,
      name: req.session.name,
    });
  } else {
    res.render("index", {
      dashboard: false,
      name: "Debe iniciar sesión",
      alert: true,
      alertTitle: "Debe iniciar sesión como administrador",
      alertMessage: "Debe iniciar sesión como administrador",
      alertIcon: "error",
      showConfirmButton: false,
      timer: 1000,
      ruta: "index",
      role
    });
  }
});

router.get("/lista_agendas", async (req, res) => {
  const dataext = await getAgendasExtData();
  const role = req.session.loggedin ? req.session.role : "n_reg";
  if (req.session.loggedin && req.session.role === "admin") {
    res.render("lista_agendas" , {
      lista_agendas: true,
      name: req.session.name,
      agendaext: dataext
    });
  } else {
    res.render("index", {
      lista_agendas: false,
      name: "Debe iniciar sesión",
      alert: true,
      alertTitle: "Debe iniciar sesión como administrador",
      alertMessage: "Debe iniciar sesión como administrador",
      alertIcon: "error",
      showConfirmButton: false,
      timer: 1000,
      ruta: "index",
      role
    });
  }
});

router.get("/detalle_agenda/:id", async (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  const id = req.params.id;
  if (req.session.loggedin && req.session.role === "admin") {
    try {
      // Obtener detalles de la agenda específica según el ID
      const result = await pool.query('SELECT * FROM public.agenda_externo WHERE id = $1', [id]);
      const agendaDetails = result.rows[0]; // Suponiendo que solo quieres el primer resultado
  
      if (req.session.loggedin && req.session.role === "admin") {
        res.render("detalle_agenda", {
          lista_agendas: true,
          name: req.session.name,
          agendaext: [agendaDetails], // Pasa los detalles de la agenda como un arreglo
          agendaId: id
        });
      } else {
        // Resto del código de renderización para usuarios no administradores
      }
    } catch (error) {
      console.error(error);
      // Manejar el error según tus necesidades
      res.status(500).send('Error interno del servidor');
    }
  } else {
    res.render("index", {
      lista_agendas: false,
      name: "Debe iniciar sesión",
      alert: true,
      alertTitle: "Debe iniciar sesión como administrador",
      alertMessage: "Debe iniciar sesión como administrador",
      alertIcon: "error",
      showConfirmButton: false,
      timer: 1000,
      ruta: "index",
      role
    });
  }
});

router.post("/actualizar_estado_agenda", async (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  try {
      const { agendaId, observaciones } = req.body;
      const nuevoEstado = "Completado";

      await pool.query('UPDATE public.agenda_externo SET estado = $1 WHERE id = $2', [nuevoEstado, agendaId]);
      await pool.query('INSERT INTO observaciones_agenda (agenda_id, observaciones) VALUES ($1, $2)', [agendaId, observaciones]);

      res.redirect("/lista_agendas");
  } catch (err) {
      console.error(err);
      res.status(500).send("Error interno del servidor");
  }
});

router.get("/comprobante_adm", async (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  if (req.session.loggedin && req.session.role === "admin") {
    try {
      const comprobanteData = await getComprobante();
      res.render("comprobante_adm", {
        dashboard: true,
        name: req.session.name,
        data: { pagos: comprobanteData }
      });
    } catch (err) {
      console.error(err);
    }
  } else {
    res.render("index", {
      dashboard: false,
      name: "Debe iniciar sesión",
      alert: true,
      alertTitle: "Debe iniciar sesión como administrador",
      alertMessage: "Debe iniciar sesión como administrador",
      alertIcon: "error",
      showConfirmButton: false,
      timer: 1000,
      ruta: "index",
      role
    });
  }
});


router.get("/reg_admin", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  if (req.session.loggedin && req.session.role === "admin") {
    res.render("reg_admin", {
      reg_admin: true,
      name: req.session.name,
    });
  } else {
    res.render("index", {
      reg_admin: false,
      name: "Debe iniciar sesión",
      alert: true,
      alertTitle: "Debe iniciar sesión como administrador",
      alertMessage: "Debe iniciar sesión como administrador",
      alertIcon: "error",
      showConfirmButton: false,
      timer: 1000,
      ruta: "index",
      role
    });
  }
});

// Cerrar Sesion

router.get("/logout", (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  req.session.destroy(() => {
    res.render("index",{
      alert: true,
      alertTitle: "Sesión Cerrada",
      alertMessage: "Su sesión se ha cerrado correctamente",
      alertIcon: "success",
      showConfirmButton: false,
      timer: 2000,
      ruta: "index",
      role
    });
  });
});

router.get("/", (req, res) => {
  if (req.session.role === undefined){
    req.session.role = "n_reg"
  }
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("index", { role } );
});

// Compra Paypal
const getPaypalUrl = require('../js/session/paypal');

router.get("/producto", async (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  const paypalUrl = await getPaypalUrl();
  console.log(`PayPal URL: ${paypalUrl}`);
  res.render("producto", { paypalUrl: paypalUrl, role });
});

router.get("/servicio", async (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  res.render("servicio", { role });
});


//Comprobante y Guardar en BD
const executePayment = require('../js/session/executePayment');

router.get('/execute-payment', (req, res) => {
  const role = req.session.loggedin ? req.session.role : "n_reg";
  const token = req.query.token;
  executePayment(token, (err, paymentData) => {
      if (err) {
          // manejar error
      } else {
          if (paymentData.payment_source && paymentData.payment_source.paypal) {
              const id_pago = paymentData.id;
              const estado = paymentData.status;
              const email_paypal = paymentData.payment_source.paypal.email_address;
              const nombre_comprador = paymentData.payment_source.paypal.name.given_name + ' ' + paymentData.payment_source.paypal.name.surname;
              const codigo_pais = paymentData.payment_source.paypal.address.country_code;
              const nombre_envio = paymentData.purchase_units[0].shipping.name.full_name;
              const direccion_envio = paymentData.purchase_units[0].shipping.address.address_line_1 + ', ' + paymentData.purchase_units[0].shipping.address.admin_area_2 + ', ' + paymentData.purchase_units[0].shipping.address.admin_area_1 + ', ' + paymentData.purchase_units[0].shipping.address.postal_code + ', ' + paymentData.purchase_units[0].shipping.address.country_code;
              const monto_compra = paymentData.purchase_units[0].payments.captures[0].amount.value;
              const monto_bruto = paymentData.purchase_units[0].payments.captures[0].seller_receivable_breakdown.gross_amount.value;
              const comision_paypal = paymentData.purchase_units[0].payments.captures[0].seller_receivable_breakdown.paypal_fee.value;
              const monto_neto = paymentData.purchase_units[0].payments.captures[0].seller_receivable_breakdown.net_amount.value;

              pool.query(
                  'INSERT INTO public.comprobante("id_pago", "estado", "email_paypal", "nombre_comprador", "codigo_pais", "nombre_envio", "direccion_envio", "monto_compra", "monto_bruto", "comision_paypal", "monto_neto") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', 
                  [id_pago, estado, email_paypal, nombre_comprador, codigo_pais, nombre_envio, direccion_envio, monto_compra, monto_bruto, comision_paypal, monto_neto], 
                  async (error, results) => {
                      if (error) {
                          console.log(error);
                      } else {
                          res.render("paymentResult", {
                              alert: true,
                              alertTitle: "Compra Realizada",
                              alertMessage: "Compra Realizada",
                              alertIcon: "success",
                              showConfirmButton: false,
                              timer: 1500,
                              ruta: "",
                              paymentData: paymentData, role
                          });
                      }
                  }
              );
          }
      }
  });
});

//Comprobante PayPal
const PDFDocument = require('pdfkit');

router.get('/generate-pdf/:id_pago', async (req, res) => {
    const id_pago = req.params.id_pago;

    // Consulta a la base de datos para obtener los datos del pago
    const result = await pool.query('SELECT * FROM public.comprobante WHERE id_pago = $1', [id_pago]);

    if (result.rows.length > 0) {
        const paymentData = result.rows[0];

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();

        // Agregar las imágenes
        doc.image('./public/Img/paypal_logo.png', 450, 20, { width: 100 });

        // Agregar un título grande
        doc.fontSize(30).text('MotorsSolution', { align: 'center' });

        // Agregar un título al comprobante
        doc.fontSize(18).text('Comprobante de Compra', { align: 'center' });

        // Agregar una línea debajo del título
        doc.moveTo(50, 140).lineTo(550, 140).stroke();

        // Escribir los detalles de la compra en el PDF
        doc.fontSize(12).text(`ID de Pago: ${paymentData.id_pago}`, 70, 170);
        doc.text(`Estado: ${paymentData.estado}`, 70, 190);
        doc.text(`Email de PayPal: ${paymentData.email_paypal}`, 70, 210);
        doc.text(`Nombre del Comprador: ${paymentData.nombre_comprador}`, 70, 230);
        doc.text(`Código del País: ${paymentData.codigo_pais}`, 70, 250);
        doc.text(`Nombre de Envío: ${paymentData.nombre_envio}`, 70, 270);
        doc.text(`Dirección de Envío: ${paymentData.direccion_envio}`, 70, 290);
        doc.text(`Monto de la Compra: ${paymentData.monto_compra}`, 70, 310);
        doc.text(`Monto Bruto: ${paymentData.monto_bruto}`, 70, 330);
        doc.text(`Comisión de PayPal: ${paymentData.comision_paypal}`, 70, 350);
        doc.text(`Monto Neto: ${paymentData.monto_neto}`, 70, 370);


        // Agregar una línea debajo de los detalles de la compra
        doc.moveTo(50, 400).lineTo(550, 400).stroke();

        // Agregar la imagen del logo arriba de los agradecimientos
        const imgWidth = 100;
        const xPosition = (doc.page.width / 2) - (imgWidth / 2);
        doc.image('./public/Img/Logo-removebg-preview.png', xPosition, 450, { width: imgWidth });

        // Agregar un agradecimiento al final de la compra
        doc.fontSize(14).text('Gracias por comprar en MotorsSolution', 70, 580, { align: 'center' });

        // Agregar la fecha y hora en la zona inferior derecha
        doc.fontSize(10).text(`Fecha / hora: ${new Date().toLocaleString()}`, 370, 660);

        // Finalizar el PDF y guardarlo en el sistema de archivos
        doc.end();

        // Enviar el PDF como respuesta
        res.contentType('application/pdf');
        doc.pipe(res);
    } else {
        res.status(404).send('No se encontró el pago');
    }
});

module.exports = router;
