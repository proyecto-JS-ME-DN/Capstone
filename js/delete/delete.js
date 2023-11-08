// js/delete/delete.js

const pool = require('../../database/db');

async function eliminar(req, res) {
    const id = req.params.id;
    try {
        await pool.query('DELETE FROM public.login WHERE id = $1', [id]);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
    }
}

module.exports = eliminar;
