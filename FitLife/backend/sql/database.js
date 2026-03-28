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
async function updateEdzo(edzőterem_cím, kep, idezet, leiras, id) {
    const query = 'UPDATE edzo SET edzoterm_cim=?,kep=?,idezet=?,leiras=? WHERE edzo.edzo_id = ?;';
    const [rows] = await pool.execute(query, [edzőterem_cím, kep, idezet, leiras, id]);
    return rows;
}

async function selectAllTrainers() {
    const query = 'SELECT *, komment.ertekeles, komment.szoveg FROM edzo LEFT JOIN komment ON edzo.edzo_id=komment.edzo_id';
    const [rows] = await pool.execute(query);
    return rows;
}

async function insertLogin(felh_nev, jelszo, email, telszam, nem, role, szul_datum) {
    const query = 'INSERT INTO login(felh_nev, jelszo, email, telszam, nem, role, szul_datum) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [rows] = await pool.execute(query, [felh_nev, jelszo, email, telszam, nem, role, szul_datum]);
    return rows;
}

async function login(email) {
    const query = 'SELECT login.jelszo, login.id FROM login WHERE email = ?;';
    const [rows] = await pool.execute(query, [email]);
    return rows;
}

async function checkUser(email) {
    const query = 'SELECT login.id FROM login WHERE email = ?;';
    const [rows] = await pool.execute(query, [email]);
    return rows;
}

async function updateUser(testsuly ,magassag ,edzesre_forditott_ido , cel_alak, cel_testsuly, uzott_sport, edzesen_kivuli_mozgas, id) {
    const query = "UPDATE felhasznalo SET testsuly=?,magassag=?,edzesre_forditott_ido=?,cel_alak=,cel_testsuly=?,uzott_sport=?,edzesen_kivuli_mozgas=? WHERE felhasznalo.felhasznalo_id = ?";
    const [rows] = await pool.execute(query, [testsuly ,magassag ,edzesre_forditott_ido , cel_alak, cel_testsuly, uzott_sport, edzesen_kivuli_mozgas, id]);
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
async function selectAllGyakorlatok() {
    const query = "SELECT gyakorlat.gyakorlat_id, gyakorlat.nev AS gyakorlat_nev, gyakorlat.leiras, gyakorlat.kor, gyakorlat.ismetles, izomcsoport.nev AS izomcsoport_nev FROM gyakorlat LEFT JOIN gyakorlat_izomcsoport ON gyakorlat.gyakorlat_id = gyakorlat_izomcsoport.gyakorlat_id LEFT JOIN izomcsoport ON gyakorlat_izomcsoport.izom_id = izomcsoport.izom_id";
    const [rows] = await pool.execute(query);
    return rows;
}
async function selectEdzoTerem(id) {
    const query = "select edzo.edzoterm_cim from edzo where edzo.edzo_id LIKE ?";
    const [rows] = await pool.execute(query, [id]);
    return rows;
}
async function insertUser(testsuly, magassag, edzesre_forditott_ido, cel_alak, cel_testsuly, uzott_sport, edzesen_kivuli_mozgas) {
    const query = "INSERT INTO felhasznalo(testsuly, magassag, edzesre_forditott_ido, napi_kaloria_bevitel, cel_alak, cel_testsuly, uzott_sport, edzesen_kivuli_mozgas) VALUES (?,?,?,?,?,?,?,?,?)";
    const [rows] = await pool.execute(query, [testsuly, magassag, edzesre_forditott_ido, cel_alak, cel_testsuly, uzott_sport, edzesen_kivuli_mozgas]);
    return rows;
}
async function insertEdzo(edzoterm_cim, kep, idezet, leiras) {
    const query = "INSERT INTO edzo(edzoterm_cim, kep, idezet, leiras) VALUES (?,?,?,?,?)";
    const [rows] = await pool.execute(query, [edzoterm_cim, kep, idezet, leiras]);
    return rows;
}
async function selectAllAllergen() {
    const query = "SELECT * FROM allergen";
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
    insertLogin,
    checkUser,
    selectAllGyakorlatok,
    selectEdzoTerem,
    insertUser,
    selectAllAllergen,
    insertEdzo
};