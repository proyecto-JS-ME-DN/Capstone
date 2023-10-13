// var pg = require('pg');
// var conString = "postgres://zplgxrfq:APvDvrAQdcb52ADYBWT_P2OUH3UaP-Rc@motty.db.elephantsql.com/zplgxrfq"
// var client = new pg.Client(conString);

// client.connect(function(err) {
//   if(err) {
//     return console.error('No se puede conectar con Postgre', err);
//   }
//   client.query('select * from categoria_prod', function(err, result) {
//     if(err) {
//       return console.error('error al ejecutar la query', err);
//     }
//     console.log(result.rows);
//     client.end();
//   });
// });

console.log('Archivo elephantsql.js se está ejecutando en Vercel');


// const cors = require('cors');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;


// Incluye la API que creaste
// const apiRouter = require('./api');

// app.use(cors());

// Usa la API en una ruta específica, por ejemplo, '/api'
// app.use('/api', apiRouter);

app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
