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
async function updateEdzo(edzoterem_cim_lat, edzoterem_cim_lng, kep, idezet, leiras, id) {
    const query = 'UPDATE edzo SET edzoterem_cim=POINT(?,?),kep=?,idezet=?,leiras=? WHERE edzo.edzo_id = ?;';
    const [rows] = await pool.execute(query, [edzoterem_cim_lng, edzoterem_cim_lat, kep, idezet, leiras, id]);
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

async function updateUser(testsuly, magassag, edzesre_forditott_ido, cel_alak, cel_testsuly, uzott_sport, edzesen_kivuli_mozgas, id) {
    const query = "UPDATE felhasznalo SET testsuly=?,magassag=?,edzesre_forditott_ido=?,cel_alak=,cel_testsuly=?,uzott_sport=?,edzesen_kivuli_mozgas=? WHERE felhasznalo.felhasznalo_id = ?";
    const [rows] = await pool.execute(query, [testsuly, magassag, edzesre_forditott_ido, cel_alak, cel_testsuly, uzott_sport, edzesen_kivuli_mozgas, id]);
    return rows;
}

async function selectTrainerById(id) {
    const query = "SELECT login.felh_nev, login.email, login.telszam,login.nem, login.szul_datum, edzo.edzoterem_cim, edzo.kep, edzo.idezet, edzo.leiras FROM login INNER JOIN edzo ON login.id = edzo.edzo_id WHERE login.id = ? AND login.role = 'edzo' LIMIT 1";
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
async function selectAllTrainers() {
    const query = `SELECT login.id, login.felh_nev AS nev, edzo.kep, edzo.leiras AS kompetenciak, edzo.edzoterem_cim, edzo.idezet FROM edzo INNER JOIN login ON edzo.edzo_id = login.id`;
    const [rows] = await pool.execute(query);
    return rows;
}
async function selectEdzoTerem(id) {
    const query = "select edzo.edzoterem_cim from edzo where edzo.edzo_id LIKE ?";
    const [rows] = await pool.execute(query, [id]);
    return rows;
}
async function insertUser(testsuly, magassag, edzesre_forditott_ido, cel_alak, cel_testsuly, uzott_sport, edzesen_kivuli_mozgas) {
    const query = "INSERT INTO felhasznalo(testsuly, magassag, edzesre_forditott_ido, napi_kaloria_bevitel, cel_alak, cel_testsuly, uzott_sport, edzesen_kivuli_mozgas) VALUES (?,?,?,?,?,?,?,?,?)";
    const [rows] = await pool.execute(query, [testsuly, magassag, edzesre_forditott_ido, cel_alak, cel_testsuly, uzott_sport, edzesen_kivuli_mozgas]);
    return rows;
}
async function insertEdzo(edzo_id,edzoterem_cim_lng, edzoterem_cim_lat, kep, idezet, leiras, kompetenciak) {
    const query = "INSERT INTO edzo(edzo_id, edzoterem_cim, kep, idezet, leiras, kompetenciak) VALUES (?,POINT(?,?),?,?,?,?)";
    const [rows] = await pool.execute(query, [edzo_id, edzoterem_cim_lng, edzoterem_cim_lat, kep, idezet, leiras, kompetenciak]);
    return rows;
}
async function selectAllAllergen() {
    const query = "SELECT * FROM allergen";
    const [rows] = await pool.execute(query);
    return rows;
}
async function selectAllEdzoterem() {
    const query = "SELECT DISTINCT edzo.edzoterem_cim FROM edzo";
    const [rows] = await pool.execute(query);
    return rows;
}

async function selectAllTrainersByDist(lng, lat) {
    const query = `
        SELECT 
            login.id, 
            login.felh_nev AS nev, 
            edzo.kep, 
            edzo.leiras AS kompetenciak, 
            edzo.edzoterem_cim, 
            edzo.idezet, 
            ROUND(ST_Distance_Sphere(edzo.edzoterem_cim, POINT(?, ?))) AS tavolsag 
        FROM edzo 
        INNER JOIN login ON edzo.edzo_id = login.id 
        ORDER BY tavolsag ASC`;
    
    const [rows] = await pool.execute(query, [lng, lat]);
    return rows;
}
async function selectKommentekByEdzoId(edzo_id) {
    const query = `
        SELECT k.komment_id, k.szoveg, k.ertekeles, k.statusz, k.edzo_id, l.felh_nev AS felhasznalo_nev 
        FROM komment k
            LEFT JOIN login l ON k.felhasznalo_id = l.id
        WHERE k.edzo_id = ?
        ORDER BY k.komment_id DESC
    `;
    const [rows] = await pool.execute(query, [edzo_id]);
    return rows;
}

async function insertKomment(szoveg, ertekeles, edzo_id, felhasznalo_id) {
    const query = `INSERT INTO komment (szoveg, ertekeles, statusz, edzo_id, felhasznalo_id) VALUES (?, ?, 'aktiv', ?, ?)`;
    const [result] = await pool.execute(query, [szoveg, ertekeles, edzo_id, felhasznalo_id]);
    return result;
}

async function insertHetiBeosztasSingle(weekday, start, end, mettol, edzoId) {
    const query = `
        INSERT INTO heti_beosztas 
        (weekday, start, end, mettol_ervenyes, edzo_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
        weekday,
        start,
        end,
        mettol,
        edzoId
    ]);

    return result;
}

async function checkHetiBeosztasExists(edzoId, mettol) {
    const query = `
        SELECT 1 
        FROM heti_beosztas 
        WHERE edzo_id = ? AND mettol_ervenyes = ?
        LIMIT 1
    `;

    const [rows] = await pool.execute(query, [edzoId, mettol]);
    return rows.length > 0;
}


async function insertKulonlegesAlkalom(datum, start, end, statusz, edzoId) {
    const query = `
        INSERT INTO kulonleges_alkalom 
        (datum, start, end, statusz, edzo_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
        datum,
        start,
        end,
        statusz,
        edzoId
    ]);

    return result;
}

async function checkKulonlegesAlkalomExists(edzoId, datum) {
    const query = `
        SELECT 1 
        FROM kulonleges_alkalom 
        WHERE edzo_id = ? AND datum = ?
        LIMIT 1
    `;

    const [rows] = await pool.execute(query, [edzoId, datum]);
    return rows.length > 0;
}



async function getCalendarData(edzoId) {
    const hetiQuery = `
        SELECT weekday, start, end, mettol_ervenyes
        FROM heti_beosztas
        WHERE edzo_id = ?
    `;

    const kulonlegesQuery = `
        SELECT datum, start, end, statusz
        FROM kulonleges_alkalom
        WHERE edzo_id = ?
    `;

    const foglalasQuery = `
        SELECT datum, start, end, statusz, felhasznalo_id
        FROM foglalas
        WHERE edzo_id = ?
    `;

    const [heti] = await pool.execute(hetiQuery, [edzoId]);
    const [kulonleges] = await pool.execute(kulonlegesQuery, [edzoId]);
    const [foglalas] = await pool.execute(foglalasQuery, [edzoId]);

    return { heti, kulonleges, foglalas };
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
    insertEdzo,
    selectAllEdzoterem,
    selectAllTrainersByDist,
    selectKommentekByEdzoId,
    insertKomment,
    insertHetiBeosztasSingle,
    checkHetiBeosztasExists,
    checkKulonlegesAlkalomExists,
    insertKulonlegesAlkalom,
    getCalendarData
};