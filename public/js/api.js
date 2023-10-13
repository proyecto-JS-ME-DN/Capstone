// api.js

const express = require('express');
const router = express.Router();
const pg = require('pg');

const conString = "postgres://zplgxrfq:APvDvrAQdcb52ADYBWT_P2OUH3UaP-Rc@motty.db.elephantsql.com/zplgxrfq";
const client = new pg.Client(conString);

// Middleware para manejar errores
function handleError(res, error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
}

// Ruta para obtener datos de la base de datos
router.get('/datos', (req, res) => {

  console.log("Solicitud a /api/datos recibida.");
  client.connect((err) => {
    if (err) {
      console.log(`Error del primer if ${err}`);
      handleError(res, err);
      return;
    }
    console.log("Conexión a la base de datos establecida.");

    const query = 'SELECT * FROM categoria_prod';

    client.query(query, (err, result) => {
      if (err) {
          console.log(`Error del segundo if ${err}`);
          handleError(res, err);
          return;
      }
      console.log("Consulta a la base de datos completada.");
      res.json(result.rows); // Envia los datos en formato JSON
    });
  });
});

module.exports = router;