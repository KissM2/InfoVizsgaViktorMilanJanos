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

async function insertUser(felh_nev, jelszo, email, telszam, nem, role, szul_datum){
    const query = 'INSERT INTO login(felh_nev, jelszo, email, telszam, nem, role, szul_datum) values (?, ?, ?, ?, ?, ?, ?)';
    const [rows] = await pool.execute(query, [felh_nev, jelszo, email, telszam, nem, role, szul_datum]);
    return rows;
}

async function login(email) {
    const query = 'SELECT login.jelszo FROM exampletable where login.email = ?;';
    const [rows] = await pool.execute(query, [email]);
    return rows;
}


//!Export
module.exports = {
    selectall
};
