const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'fitlife',
    dateStrings:true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//!SQL Queries

//login tábla

//insert
async function insertLogin(felh_nev, jelszo, email, telszam, nem, role, szul_datum) {
    const query = 'INSERT INTO login(felh_nev, jelszo, email, telszam, nem, role, szul_datum) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [rows] = await pool.execute(query, [felh_nev, jelszo, email, telszam, nem, role, szul_datum]);
    return rows;
}

//update
async function updateLoginData(felh_nev, email, telszam, nem, szul_datum, id) {
    const query = "UPDATE login SET login.felh_nev = ?, login.email = ?, login.telszam = ?, login.nem = ?, login.szul_datum = ? WHERE login.id = ?";
    const [rows] = await pool.execute(query, [felh_nev, email, telszam, nem, szul_datum, id]);
    return rows;
}
async function updateJelszo(hash, userId) {
    const query = "UPDATE login SET jelszo = ? WHERE id = ?";
    const [rows] = await pool.execute(query, [hash, userId]);
    return rows;
}

//select
async function login(email) {
    const query = 'SELECT login.jelszo, login.id, login.role FROM login WHERE email = ?;';
    const [rows] = await pool.execute(query, [email]);
    return rows;
}
async function checkUser(email) {
    const query = 'SELECT login.id FROM login WHERE email = ?;';
    const [rows] = await pool.execute(query, [email]);
    return rows;
}
async function selectTrainerById(id) {
    const query = "SELECT login.felh_nev, login.email, login.telszam,login.nem, login.szul_datum, edzo.edzoterem_cim, edzo.kep, edzo.idezet, edzo.leiras,(SELECT AVG(ertekeles) FROM komment WHERE edzo_id = edzo.edzo_id) AS ertekeles_atlag  FROM login INNER JOIN edzo ON login.id = edzo.edzo_id WHERE login.id = ? AND login.role = 'edzo' LIMIT 1";
    const [rows] = await pool.execute(query, [id]);
    return rows;
}
async function selectLoginDataById(id) {
    const query = 'SELECT login.email, login.felh_nev, login.telszam, login.nem, login.szul_datum FROM login WHERE login.id = ?;';
    const [rows] = await pool.execute(query, [id]);
    return rows;
}
async function selectAllLoginData() {
    const query = 'SELECT login.id, login.email, login.felh_nev, login.telszam, login.nem, login.szul_datum, login.role FROM login where login.role NOT LIKE "admin";';
    const [rows] = await pool.execute(query);
    return rows;
}
async function selectAllAdminLoginData() {
    const query = 'SELECT login.id, login.email, login.felh_nev, login.telszam, login.nem, login.szul_datum, login.role FROM login where login.role = "admin";';
    const [rows] = await pool.execute(query);
    return rows;
}

//felhasznalo tábla

//insert


//update
async function updateUser(testsuly, magassag, edzesre_forditott_ido, cel_alak_id, cel_testsuly, EKM_id, id) {
    const query = "UPDATE felhasznalo SET testsuly=?,magassag=?,edzesre_forditott_ido=?,cel_alak_id=?,cel_testsuly=?,EKM_id=? WHERE felhasznalo.felhasznalo_id = ?";
    const [rows] = await pool.execute(query, [testsuly, magassag, edzesre_forditott_ido, cel_alak_id, cel_testsuly, EKM_id, id]);
    return rows;
}

//select
async function getUserCel(userId) {
    const query = `
        SELECT felhasznalo.edzesre_forditott_ido, cel_alak.nev AS cel_nev 
        FROM felhasznalo
        JOIN cel_alak ON felhasznalo.cel_alak_id = cel_alak.id
        WHERE felhasznalo.felhasznalo_id = ?`;
    const [rows] = await pool.execute(query, [userId]);
    return rows[0];
}
//felhasznalo_edzesi_napok

//insert

//update

//select
async function getUserEdzesNapok(userId) {
    const query = `SELECT nap_sorszam FROM felhasznalo_edzesi_napok WHERE felhasznalo_id = ?`;
    const [rows] = await pool.execute(query, [userId]);
    let napok = [];
    for(let i = 0; i < rows.length; i++) {
        napok.push(rows[i].nap_sorszam);
    }
    return napok;
}
async function selectFelhDataById(id) {
    const query = 'SELECT felhasznalo.testsuly, felhasznalo.magassag, felhasznalo.edzesre_forditott_ido, felhasznalo.cel_alak_id, felhasznalo.cel_testsuly, felhasznalo.EKM_id FROM felhasznalo WHERE felhasznalo.felhasznalo_id = ?;';
    const [rows] = await pool.execute(query, [id]);
    return rows;
}

//edzo tábla

//insert
async function insertEdzo(edzo_id,edzoterem_cim_lng, edzoterem_cim_lat, kep, idezet, leiras, kompetenciak) {
    const query = "INSERT INTO edzo(edzo_id, edzoterem_cim, kep, idezet, leiras, kompetenciak) VALUES (?,POINT(?,?),?,?,?,?)";
    const [rows] = await pool.execute(query, [edzo_id, edzoterem_cim_lng, edzoterem_cim_lat, kep, idezet, leiras, kompetenciak]);
    return rows;
}

//update
async function updateEdzo(edzoterem_cim_lat, edzoterem_cim_lng, kep, idezet, leiras, id) {
    const query = 'UPDATE edzo SET edzoterem_cim=POINT(?,?),kep=?,idezet=?,leiras=? WHERE edzo.edzo_id = ?;';
    const [rows] = await pool.execute(query, [edzoterem_cim_lng, edzoterem_cim_lat, kep, idezet, leiras, id]);
    return rows;
}

//select
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
async function selectTrainersByDist(lng, lat) {
    const query = `
        SELECT
            login.id,
            login.felh_nev AS nev,
            edzo.kep,
            edzo.leiras AS kompetenciak,
            edzo.edzoterem_cim,
            edzo.idezet
        FROM edzo
        INNER JOIN login ON edzo.edzo_id = login.id
        where ST_Distance_Sphere(edzo.edzoterem_cim, POINT(?, ?)) < 51`;
    
    const [rows] = await pool.execute(query, [lng, lat]);
    return rows;
}
//edzesterv tábla

//insert
async function saveEdzestervSor(adat) {
    const query = "INSERT INTO edzesterv (terv_csoport_id, weekday_sorszam, gyakorlat_id, sorrend, felhasznalo_id) VALUES (?, ?, ?, ?, ?)";
    const [rows] = await pool.execute(query, [adat.terv_csoport_id, adat.weekday_sorszam, adat.gyakorlat_id, adat.sorrend, adat.felhasznalo_id]);
    return rows;
}
//update

//select
async function getLegutobbiEdzesterv(userId) {
    const [csoportIdRes] = await pool.execute("SELECT terv_csoport_id FROM edzesterv WHERE felhasznalo_id = ? ORDER BY terv_csoport_id DESC LIMIT 1",[userId]);
    const legutobbiId = csoportIdRes[0].terv_csoport_id;
    const query = `
        SELECT e.weekday_sorszam, e.sorrend, g.gyakorlat_id, g.nev, g.leiras, g.kor, g.ismetles, i.nev AS izomcsoport_nev
        FROM edzesterv e
        JOIN gyakorlat g ON e.gyakorlat_id = g.gyakorlat_id
        LEFT JOIN gyakorlat_izomcsoport gi ON g.gyakorlat_id = gi.gyakorlat_id
        LEFT JOIN izomcsoport i ON gi.izom_id = i.izom_id
        WHERE e.terv_csoport_id = ?
        ORDER BY e.weekday_sorszam, e.sorrend
    `;
    const [rows] = await pool.execute(query, [legutobbiId]);
    return rows;
}

//komment tábla

//insert
async function insertKomment(szoveg, ertekeles, edzo_id, felhasznalo_id) {
    const query = `INSERT INTO komment (szoveg, ertekeles, statusz, edzo_id, felhasznalo_id) VALUES (?, ?, 'aktiv', ?, ?)`;
    const [result] = await pool.execute(query, [szoveg, ertekeles, edzo_id, felhasznalo_id]);
    return result;
}

//update


//select
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
async function selectKommentekByUserIdForAdmin(user_id) {
    const query = `
        SELECT k.komment_id, k.szoveg, k.ertekeles, k.statusz, e.felh_nev as edzo_nev, f.felh_nev
        FROM komment k
            INNER JOIN login f ON k.felhasznalo_id = f.id
            INNER JOIN login e ON k.edzo_id = e.id
        WHERE k.felhasznalo_id = ?
        ORDER BY k.komment_id DESC
    `;
    const [rows] = await pool.execute(query, [user_id]);
    return rows;
}
async function selectKommentekByEdzoIdForAdmin(edzo_id) {
    const query = `
        SELECT k.komment_id, k.szoveg, k.ertekeles, k.statusz, e.felh_nev as edzo_nev, f.felh_nev
        FROM komment k
            INNER JOIN login e ON k.edzo_id = e.id
            INNER JOIN login f ON k.felhasznalo_id = f.id
        WHERE k.edzo_id = ?
        ORDER BY k.komment_id DESC
    `;
    const [rows] = await pool.execute(query, [edzo_id]);
    return rows;
}
async function selectAllKommentek() {
    const query = `
    SELECT k.komment_id, k.szoveg, k.ertekeles, k.statusz, e.felh_nev as edzo_nev, f.felh_nev
        FROM komment k
            INNER JOIN login e ON k.edzo_id = e.id
            INNER JOIN login f ON k.felhasznalo_id = f.id
    `;
    const [rows] = await pool.execute(query);
    return rows;
}

//gyakorlat tábla

//insert


//update


//select
async function selectAllGyakorlatok() {
    const query = "SELECT gyakorlat.gyakorlat_id, gyakorlat.nev AS gyakorlat_nev, gyakorlat.leiras, gyakorlat.kor, gyakorlat.ismetles, gyakorlat.tipus, izomcsoport.nev AS izomcsoport_nev FROM gyakorlat LEFT JOIN gyakorlat_izomcsoport ON gyakorlat.gyakorlat_id = gyakorlat_izomcsoport.gyakorlat_id LEFT JOIN izomcsoport ON gyakorlat_izomcsoport.izom_id = izomcsoport.izom_id";
    const [rows] = await pool.execute(query);
    return rows;
}

//receptek tábla


//insert


//update


//select
async function selectAllReceptek() {
    const query = "SELECT * FROM recept";
    const [rows] = await pool.execute(query);
    return rows;
}

//allergen tábla

//insert


//update


//select
async function selectAllAllergen() {
    const query = "SELECT * FROM allergen";
    const [rows] = await pool.execute(query);
    return rows;
}

//allergias_ra tábla

//heti_beosztas tábla

//insert
async function insertAllergiasRa(id, allergia) {
    const query = "INSERT INTO allergias_ra(felhasznalo_id, allergen_id) VALUES(?,?)";
    const [rows] = await pool.execute(query, [id, allergia]);
    return rows;
}

//update


//delete
async function deleteAllergiasRa(id, allergen_id) {
    const query = "DELETE FROM allergias_ra WHERE allergias_ra.felhasznalo_id = ? AND allergias_ra.allergen_id = ?";
    const [rows] = await pool.execute(query, [id, allergen_id]);
    return rows;
}

//select
async function selectAorPById(id, tipus) {
    const query = "SELECT allergen.allergen_id FROM allergias_ra INNER JOIN allergen on allergias_ra.allergen_id = allergen.allergen_id WHERE allergias_ra.felhasznalo_id = ? AND allergen.tipus = ?";
    const [rows] = await pool.execute(query, [id, tipus]);
    return rows;
}

//insert
async function insertHetiBeosztasSingle(weekday, start, end, mettol, edzoId) {
    const query = `
        INSERT INTO heti_beosztas
        (weekday, start, end, mettol_ervenyes, edzo_id, statusz)
        VALUES (?, ?, ?, ?, ?, 'aktiv')
    `;
    await pool.execute(query, [weekday, start, end, mettol, edzoId]);
}

//delete
async function softDeleteHetiBeosztas(edzoId, mettol) {
    const query = `
        UPDATE heti_beosztas
        SET statusz = 'torolt'
        WHERE edzo_id = ?
        AND mettol_ervenyes = ?
    `;
    await pool.execute(query, [edzoId, mettol]);
}

//select
// heti beosztás lekérése
async function getHetiBeosztas(edzoId) {
    const query = `
        SELECT *
        FROM heti_beosztas
        WHERE edzo_id = ?
        AND statusz = 'aktiv'
    `;
    const [rows] = await pool.execute(query, [edzoId]);
    return rows;
}
async function checkHetiBeosztasExists(edzoId, mettol) {
    const query = `
        SELECT 1
        FROM heti_beosztas
        WHERE edzo_id = ?
        AND mettol_ervenyes = ?
        AND statusz = 'aktiv'
        LIMIT 1
    `;
    const [rows] = await pool.execute(query, [edzoId, mettol]);
    return rows.length > 0;
}
// heti beosztás van-e benne
async function isInHetiBeosztas(edzoId, weekday, ido) {
    const query = `
        SELECT 1
        FROM heti_beosztas
        WHERE edzo_id = ?
        AND weekday = ?
        AND statusz = 'aktiv'
        AND start <= ?
        AND end >= ?
        LIMIT 1
    `;
    const [rows] = await pool.execute(query, [
        edzoId,
        weekday,
        ido,
        ido
    ]);
    return rows.length > 0;
}
//kulonleges_alkalom tábla

// összes KA
async function getKulonlegesAlkalmak(edzoId) {
    const query = `
        SELECT *
        FROM kulonleges_alkalom
        WHERE edzo_id = ?
        AND statusz <> 'torolt'
    `;
    const [rows] = await pool.execute(query, [edzoId]);
    return rows;
}


// pontos KA
async function getKAByExact(edzoId, datum, start, end) {
    const query = `
        SELECT *
        FROM kulonleges_alkalom
        WHERE edzo_id = ?
        AND datum = ?
        AND start = ?
        AND end = ?
        AND statusz <> 'torolt'
        LIMIT 1
    `;
    const [rows] = await pool.execute(query, [edzoId, datum, start, end]);
    return rows[0];
}

// insert
async function insertKulonlegesAlkalom(datum, start, end, statusz, edzoId) {
    const query = `
        INSERT INTO kulonleges_alkalom (datum, start, end, statusz, edzo_id)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [
        datum,
        start,
        end,
        statusz,
        edzoId
    ]);
    return result.affectedRows > 0;
}

// update
async function updateKAStatus(ka_id, statusz) {
    const query = `
        UPDATE kulonleges_alkalom
        SET statusz = ?
        WHERE ka_id = ?
    `;
    const [result] = await pool.execute(query, [statusz, ka_id]);
    return result.affectedRows > 0;
}
//soft delete
async function markInvalidKAAsDeleted(edzoId, mettol) {
    const query = `
        UPDATE kulonleges_alkalom ka
        SET ka.statusz = 'torolt'
        WHERE ka.edzo_id = ?
        AND ka.statusz <> 'torolt'
        AND NOT EXISTS (
            SELECT 1
            FROM heti_beosztas hb
            WHERE hb.edzo_id = ka.edzo_id
            AND hb.statusz = 'aktiv'
            AND hb.weekday = WEEKDAY(ka.datum)
            AND hb.mettol_ervenyes = ?
            AND hb.start <= ka.start
            AND hb.end >= ka.start
        ) `;
    await pool.execute(query, [edzoId, mettol]);
}
//cel_alak tábla

//select
async function selectAllCelAlak() {
    const query = `SELECT * FROM cel_alak`;
    const [rows] = await pool.execute(query);
    return rows;
}

//EKM tábla

//select
async function selectAllEKM() {
    const query = `SELECT * FROM edzesen_kivuli_mozgas`;
    const [rows] = await pool.execute(query);
    return rows;
}


//select
// async function checkKulonlegesAlkalomExists(edzoId, datum) {
//     const query = `
//         SELECT 1 
//         FROM kulonleges_alkalom 
//         WHERE edzo_id = ? AND datum = ?
//         LIMIT 1
//     `;

//     const [rows] = await pool.execute(query, [edzoId, datum]);
//     return rows.length > 0;
// }

//szét kéne szedni
async function getFoglalas(edzoId) {
    const query = `
        SELECT *
        FROM foglalas
        WHERE edzo_id = ?
        AND statusz <> 'torolt'
    `;
    const [rows] = await pool.execute(query, [edzoId]);
    return rows;
}
//update users?
// async function updateUserProfile(email, felh, telsz, userId) {
//     const query = `
//         UPDATE users
//         SET login.email = ?, login.felh_nev = ?, login.telszam = ?
//         WHERE login.id= ? AND login.role = 'edzo';
//     `;

//     await pool.execute(query, [email, felh, telsz, userId]);
// }

//tranzakció(felhasznalo + allergias_ra)
async function insertUser(testsuly, magassag, edzesre_forditott_ido, cel_alak_id, cel_testsuly, EKM_id, id, allergiak, preferenciak) {
    const conn = await pool.getConnection();
    try{
        // Tranzakció indítása
        await conn.beginTransaction();

        // felhaszbáló rögzítése
        const [result1] = await conn.execute(
            "INSERT INTO felhasznalo(felhasznalo_id, testsuly, magassag, edzesre_forditott_ido, cel_alak_id, cel_testsuly, EKM_id) VALUES (?,?,?,?,?,?,?)",
            [id, testsuly, magassag, edzesre_forditott_ido, cel_alak_id, cel_testsuly, EKM_id]
        );

        if (result1.affectedRows !== 1) {
          throw new Error("Sikertelen levonás");
        }

        // allergiák hozzá adása
        for (let i = 0; i < allergiak.length; i++) {   
            const [result2] = await conn.execute(
                "INSERT INTO allergias_ra(felhasznalo_id, allergen_id) VALUES (?,?)",
                [id, allergiak[i].allergen_id]
            );
            if (result2.affectedRows !== 1) {
                throw new Error("Sikertelen jóváírás");
            }
        }
        
        // allergiák hozzá adása
        for (let i = 0; i < preferenciak.length; i++) {   
            const [result3] = await conn.execute(
                "INSERT INTO allergias_ra(felhasznalo_id, allergen_id) VALUES (?,?)",
                [id, preferenciak[i].allergen_id]
            );
            if (result3.affectedRows !== 1) {
                throw new Error("Sikertelen jóváírás");
            }
        }

        // ✅ Minden sikeres → COMMIT
        await conn.commit();
        console.log("Tranzakció sikeres");
        return "Tranzakció sikeres";
    } catch (err) {
        // ❌ Hiba esetén → ROLLBACK
        await conn.rollback();
        console.error("Tranzakció visszagörgetve:", err.message);
        throw err;

    } finally {
        // Kapcsolat vissza a poolba
        conn.release();
    }
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
    insertKulonlegesAlkalom,
    getFoglalas,
    selectTrainersByDist,
    softDeleteHetiBeosztas,
    isInHetiBeosztas,
    getKulonlegesAlkalmak,
    getHetiBeosztas,
    getKAByExact,
    updateKAStatus,
    markInvalidKAAsDeleted,
    getCalendarData,
    selectTrainersByDist,
    getUserCel,
    getUserEdzesNapok,
    saveEdzestervSor,
    getLegutobbiEdzesterv,
    selectAllCelAlak,
    selectLoginDataById,
    selectFelhDataById,
    selectAllEKM,
    updateLoginData,
    updateJelszo,
    insertAllergiasRa,
    selectAorPById,
    deleteAllergiasRa,
    selectAllLoginData,
    selectAllKommentek,
    selectKommentekByUserIdForAdmin,
    selectKommentekByEdzoIdForAdmin,
    selectAllAdminLoginData
};
