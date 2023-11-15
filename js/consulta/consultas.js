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

  async function getComprobante() {
    try {
        const result = await pool.query('SELECT * FROM public.comprobante');
        return result.rows;
    } catch (err) {
        console.error(err);
    }
  }

  async function buscar(req, res) {
    const id = req.query.id;
    try {
        let result;
        if (id) {
            result = await pool.query('SELECT * FROM public.login WHERE id = $1', [id]);
        } else {
            result = await pool.query('SELECT * FROM public.login');
        }
        res.render('dashboard', { data: { login: result.rows } });
    } catch (err) {
        console.error(err);
    }
}

  module.exports = { getLoginData, getContactoData, getAgendasExtData, getComprobante, buscar };

