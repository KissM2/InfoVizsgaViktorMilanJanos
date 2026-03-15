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
async function selectall() {
    const query = 'SELECT * FROM exampletable;';
    const [rows] = await pool.execute(query);
    return rows;
}
async function updateUser(cel_testsuly, cel_alak, uzott_sport, magassag, testsuly, edzesen_kivuli_mozgas, email) {
    const query = "UPDATE felhasznalo INNER JOIN login ON felhasznalo.felhasznalo_id = login.id SET felhasznalo.cel_testsuly = ?, felhasznalo.cel_alak = ?, felhasznalo.uzott_sport = ?, felhasznalo.magassag = ?, felhasznalo.testsuly = ?, felhasznalo.edzesen_kivuli_mozgas = ? WHERE login.email = ?";
    const [rows] = await pool.execute(query, [cel_testsuly, cel_alak, uzott_sport, magassag, testsuly, edzesen_kivuli_mozgas, email]);
    return rows;
}
//!Export
module.exports = {
    selectall,updateUser
};
