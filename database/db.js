const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

pool.connect((error, client, done) => {
    if(error){
        console.error(`Error de conexión: ${error}`);
        return;
    }
    console.log('\x1b[36m%s\x1b[0m', 'Conexión exitosa a la base de datos');
    done();
});


module.exports = pool;
