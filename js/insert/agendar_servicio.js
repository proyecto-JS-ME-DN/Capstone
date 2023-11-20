// Formulario Servicio

// routes/formservicio.js
const express = require('express');
const router = express.Router();
const pool = require('../../database/db');
const twilio = require('twilio');

const accountSid = 'AC9d306df50c70d692d47d50000a2c8862';
const authToken = 'e4b7deccb4c39a5004f236365b6f16ba';
const twclient = twilio(accountSid, authToken);

router.post("/agendar_servicio", async (req, res) => {
  const {nombre,correo,patente,marca,modelo,tipo,fecha,hora,descripcion} = req.body;
  const estado = "Pendiente";
  pool.query(
    "INSERT INTO public.agenda_externo(nombre,correo,patente,marca,modelo,tipo,fecha,hora,descripcion,estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [nombre,correo,patente,marca,modelo,tipo,fecha,hora,descripcion,estado], async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        const role = req.session.loggedin ? req.session.role : "n_reg";
        const defaultMessage = `\tBienvenido a MotorsSolution!\n\nSu agenda se ha registrado exitosamente✅.\n\n--Datos Cliente--\nNombre: ${req.body.nombre}\nCorreo: ${req.body.correo}\n\n--Datos Vehículo--\nMarca: ${req.body.marca}\nModelo: ${req.body.modelo}\nPatente: ${req.body.patente}\n\n--Fecha--\nSu agenda se encuentra registrada para el dia: ${req.body.fecha}, a las ${req.body.hora} hrs.`;
        const toNumber = '+56940702817'; // Reemplaza con el número de destino deseado

        // Enviar mensaje
        twclient.messages
          .create({
            body: defaultMessage,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:${toNumber}`
          })
          .then(message => {
            console.log(message.sid);
          })
          .catch(error => {
            console.error(error);
          });
        res.render("servicio", {
          alert: true,
          alertTitle: "Agenda Registrada",
          alertMessage: "Agenda Registrada",
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