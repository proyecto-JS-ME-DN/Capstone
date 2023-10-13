// // La función que se encarga de cargar y mostrar los datos
// function mostrarDatos() {
//     var tableBody = document.querySelector("#data-table tbody");

//     fetch("/api/datos")
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Limpiar cualquier contenido anterior
//             tableBody.innerHTML = "";

//             // Verifica si la respuesta contiene datos válidos
//             if (Array.isArray(data)) {
//                 // Iterar sobre los datos y crear filas en la tabla
//                 data.forEach(row => {
//                     var newRow = tableBody.insertRow();
//                     var idCell = newRow.insertCell(0);
//                     var categoriaCell = newRow.insertCell(1);

//                     idCell.textContent = row.id_cat_prod;
//                     categoriaCell.textContent = row.cat_prod;
//                 });
//             } else {
//                 console.error("La respuesta del servidor no contiene datos válidos.");
//             }
//         })
//         .catch(error => {
//             console.error("Error al obtener datos:", error);
//             // Muestra un mensaje de error en la página web
//             tableBody.innerHTML = `<tr><td colspan="2">Error al cargar los datos.</td></tr>`;
//         });
// }

// // Llama a la función para cargar y mostrar los datos
// mostrarDatos();



// app.js
const pg = require('pg');
const express = require('express');
const app = express();
const conString = "postgres://zplgxrfq:APvDvrAQdcb52ADYBWT_P2OUH3UaP-Rc@motty.db.elephantsql.com/zplgxrfq";


const client = new pg.Client(conString);

// Conéctate a la base de datos
client.connect()
  .then(() => console.log('Conexión a la base de datos exitosa'))
  .catch(err => console.error('Error de conexión a la base de datos', err));

// Define rutas o endpoints para obtener datos desde la base de datos
app.get('/datos', async (req, res) => {
  try {
    const query = 'SELECT * FROM categoria_prod';
    const result = await client.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener datos de la base de datos', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Inicia el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
