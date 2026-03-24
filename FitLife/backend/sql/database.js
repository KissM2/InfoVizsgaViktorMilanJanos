const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'fitlife',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//!SQL Queries
async function updateEdzo(nem, leiras, kompetenciak, kep, idezet, edzőterem_cím, email, id) {
    const query = 'UPDATE edzo INNER JOIN login ON login.id = edzo.edzo_id SET edzo.leiras = ?, edzo.kep = ?, edzo.idezet = ?, edzo.edzoterm_cim = ?, login.nem = ?, login.email=? WHERE login.id = ?;';
    const [rows] = await pool.execute(query, [nem, leiras, kompetenciak, kep, idezet, edzőterem_cím, email, id]);
    return rows;
}

async function selectAllTrainers() {
    const query = 'SELECT *, komment.ertekeles, komment.szoveg FROM edzo LEFT JOIN komment ON edzo.edzo_id=komment.edzo_id';
    const [rows] = await pool.execute(query);
    return rows;
}

async function insertUser(felh_nev, jelszo, email, telszam, nem, role, szul_datum) {
    const query = 'INSERT INTO login(felh_nev, jelszo, email, telszam, nem, role, szul_datum) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [rows] = await pool.execute(query, [felh_nev, jelszo, email, telszam, nem, role, szul_datum]);
    return rows;
}

async function login(email) {
    const query = 'SELECT jelszo FROM login WHERE email = ?;';
    const [rows] = await pool.execute(query, [email]);
    return rows;
}

async function checkUser(email) {
    const query = 'SELECT id FROM login WHERE email = ?;';
    const [rows] = await pool.execute(query, [email]);
    return rows;
}

async function updateUser(cel_testsuly, cel_alak, uzott_sport, magassag, testsuly, edzesen_kivuli_mozgas, email) {
    const query = "UPDATE felhasznalo INNER JOIN login ON felhasznalo.felhasznalo_id = login.id SET felhasznalo.cel_testsuly = ?, felhasznalo.cel_alak = ?, felhasznalo.uzott_sport = ?, felhasznalo.magassag = ?, felhasznalo.testsuly = ?, felhasznalo.edzesen_kivuli_mozgas = ? WHERE login.email = ?";
    const [rows] = await pool.execute(query, [cel_testsuly, cel_alak, uzott_sport, magassag, testsuly, edzesen_kivuli_mozgas, email]);
    return rows;
}

async function selectTrainerById(id) {
    const query = "SELECT login.felh_nev, login.email, login.tel_szam, login.nem, login.szul_datum, edzo.edzoterm_cim, edzo.kep, edzo.idezet, edzo.leiras FROM login INNER JOIN edzo ON login.id = edzo.edzo_id WHERE login.id = ? AND login.role = 'edzo' LIMIT 1";
    const [rows] = await pool.execute(query, [id]);
    return rows;
}

async function selectAllReceptek() {
    const query = "SELECT * FROM recept";
    const [rows] = await pool.execute(query);
    return rows;
}

//!Export
module.exports = {
    updateEdzo,
    selectAllTrainers,
    updateUser,
    selectTrainerById,
    selectAllReceptek,
    login,
    insertUser,
    checkUser
};