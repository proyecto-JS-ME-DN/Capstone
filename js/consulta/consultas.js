const pool = require('../../database/db');

//Consulta SQL
async function getLoginData() {
    try {
        const result = await pool.query('SELECT * FROM public.login');
        return result.rows;
    } catch (err) {
        console.error(err);
    }
  }
  
  async function getContactoData() {
    try {
        const result = await pool.query('SELECT * FROM public.contacto');
        return result.rows;
    } catch (err) {
        console.error(err);
    }
  }
  
  async function getAgendasExtData() {
    try {
        const result = await pool.query('SELECT * FROM public.agenda_externo');
        return result.rows;
    } catch (err) {
        console.error(err);
    }
  }

  module.exports = { getLoginData, getContactoData, getAgendasExtData };

