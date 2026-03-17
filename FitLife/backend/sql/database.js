const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'exampledb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//!SQL Queries
async function updateEdzo(nem,leiras, kompetenciak, kep, idezet,edzőterem_cím,email,id) {
    const query = 'UPDATE edzo inner JOIN login ON login.id = edzo.edzo_id SET edzo.leiras = ?, edzo.kep = ?, edzo.idezet = ?, edzo.edzoterm_cim = ?, login.nem = ?,login.email=? WHERE login.id = ?;';
    const [rows] = await pool.execute(query,[nem,leiras, kompetenciak, kep, idezet,edzőterem_cím,email,id]);
    return rows;
}
async function selectAllTrainers() {
    const query = 'SELECT edzo.*, komment.ertekeles,komment.szoveg from edzo left join komment on edzo.edzo_id=komment.edzo_id';
    const [rows] = await pool.execute(query);
    return rows;
}
//!Export
module.exports = {
    updateEdzo,selectAllTrainers
};
