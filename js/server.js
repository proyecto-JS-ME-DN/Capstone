// const http = require('http');
 
// const hostname = '127.0.0.1';
// const port = 3000;
 
// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Prueba Server Local Node.JS');
// });
 
// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

// server.js (en tu servidor web)
const express = require('express');
const { Pool } = require('pg');
const app = express();

// Configura el pool de PostgreSQL
const pool = new Pool({
  connectionString: 'postgres://zplgxrfq:APvDvrAQdcb52ADYBWT_P2OUH3UaP-Rc@motty.db.elephantsql.com/zplgxrfq',
});

// Ruta para la API que realiza la consulta
app.get('/api/categoria_prod', (req, res) => {
  pool.query('SELECT * FROM categoria_prod', (error, result) => {
    if (error) {
      console.error('Error al ejecutar la consulta', error);
      res.status(500).json({ error: 'Error al obtener los datos' });
    } else {
      res.json(result.rows);
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor web iniciado en el puerto 3000');
});
