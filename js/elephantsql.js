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

// elephantsql.js
function fetchAndDisplayData() {
  fetch('/api/categoria_prod') // Ruta de la API en tu servidor web
    .then(response => response.json())
    .then(data => {
      console.log(data); // Muestra los datos en la consola del navegador
      // Aquí puedes realizar operaciones adicionales con los datos, como mostrarlos en tu sitio web
    })
    .catch(error => console.error('Error al obtener los datos', error));
}

fetchAndDisplayData();




