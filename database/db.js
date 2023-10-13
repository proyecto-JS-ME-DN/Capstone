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
        console.log('el error de conexión es: '+error);
        return;
    }
    console.log('Conectado a la base de datos');
    done();
});

module.exports = pool;
