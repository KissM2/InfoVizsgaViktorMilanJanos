const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fitlife',
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
async function deleteFelhasznalo(userId) {
    const query = "UPDATE login SET deleted_at = NOW() WHERE id = ?";
    const [rows] = await pool.execute(query, [userId]);
    return rows;
}
async function restoreFelhasznalo(userId) {
    const query = "UPDATE login SET deleted_at = NULL WHERE id = ?";
    const [rows] = await pool.execute(query, [userId]);
    return rows;
}
async function updateFelhasznaloRole(id, ujRole) {
    const query = "UPDATE login SET role = ? WHERE id = ?";
    const [rows] = await pool.execute(query, [ujRole, id]);
    return rows;
}

async function saveResetToken(email, token, expires) {
    const query = "UPDATE login SET reset_token = ?, reset_expires = ? WHERE email = ?";
    await pool.execute(query, [token, expires, email]);
}
async function clearResetToken(userId) {
    const query = "UPDATE login SET reset_token = NULL, reset_expires = NULL WHERE id = ?";
    await pool.execute(query, [userId]);
}

//select
async function login(email) {
    const query = 'SELECT login.jelszo, login.id, login.role FROM login WHERE email = ? AND deleted_at IS NULL;';
    const [rows] = await pool.execute(query, [email]);
    return rows;
}
async function checkUser(email) {
    const query = 'SELECT login.id FROM login WHERE email = ?;';
    const [rows] = await pool.execute(query, [email]);
    return rows;
}
async function selectTrainerById(id) {
    const query = "SELECT edzo.kompetenciak, login.felh_nev, login.email, login.telszam,login.nem, login.szul_datum, edzo.edzoterem_cim, edzo.kep, edzo.idezet, edzo.leiras,(SELECT AVG(ertekeles) FROM komment WHERE edzo_id = edzo.edzo_id AND statusz = 'aktív') AS ertekeles_atlag  FROM login INNER JOIN edzo ON login.id = edzo.edzo_id WHERE login.id = ? AND login.role = 'edzo' LIMIT 1";
    const [rows] = await pool.execute(query, [id]);
    return rows;
}
async function selectLoginDataById(id) {
    const query = 'SELECT login.email, login.felh_nev, login.telszam, login.nem, login.szul_datum FROM login WHERE login.id = ?;';
    const [rows] = await pool.execute(query, [id]);
    return rows;
}
async function getUserByToken(token) {
    const query = "SELECT id FROM login WHERE reset_token = ? AND reset_expires > NOW()";
    const [rows] = await pool.execute(query, [token]);
      return rows[0];
}
async function getUserPhysicalData(userId) {
    const query = `
        SELECT l.nem, l.szul_datum, f.testsuly, f.cel_testsuly, f.magassag, f.EKM_id, cel_alak.nev AS "cel_alak_nev"
        FROM login l
        INNER JOIN felhasznalo f ON l.id = f.felhasznalo_id
        INNER JOIN cel_alak on cel_alak.id = f.cel_alak_id
        WHERE l.id = ?`;
    const [rows] = await pool.execute(query, [userId]);
      return rows[0];
}

async function selectAllLoginData() {
    const query = 'SELECT login.id, login.email, login.felh_nev, login.telszam, login.nem, login.szul_datum, login.role, login.deleted_at FROM login LEFT JOIN edzo ON edzo.edzo_id = login.id WHERE login.role NOT LIKE "admin" AND login.id NOT IN(SELECT edzo_id FROM edzo WHERE statusz = "jelentkezett");';
    const [rows] = await pool.execute(query);
    return rows;
}
async function selectAllAdminLoginData() {
    const query = 'SELECT login.id, login.email, login.felh_nev, login.role, login.deleted_at FROM login where login.role = "admin";';
    const [rows] = await pool.execute(query);
    return rows;
}
async function selectLoginDataByKommentId(komment_id) {
    const query = 'SELECT login.id, login.email, login.felh_nev, login.telszam, login.nem, login.szul_datum, login.role, login.deleted_at FROM login LEFT JOIN komment a ON login.id = a.felhasznalo_id LEFT JOIN komment b ON login.id = b.edzo_id WHERE a.komment_id = ? OR b.komment_id = ?;';
    const [rows] = await pool.execute(query, [komment_id, komment_id]);
    return rows;
}
async function selectJelentkezok() {
    const query = "SELECT login.id, login.email, login.felh_nev, login.telszam, login.nem, login.szul_datum FROM login INNER JOIN edzo on login.id = edzo.edzo_id WHERE edzo.statusz = 'jelentkezett'";
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
async function updateCalorieGoal(userId, kcal) {
    const query = "UPDATE felhasznalo SET napi_kaloria_bevitel = ? WHERE felhasznalo_id = ?";
    await pool.execute(query, [kcal, userId]);
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
async function getUserSurveyDone(id) {
    const query = `SELECT count(*) AS "counter" FROM felhasznalo WHERE felhasznalo.felhasznalo_id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows;
}
//felhasznalo_edzesi_napok

//insert

//update

async function insertEdzesiNap(id, nap) {
    const query = "INSERT INTO felhasznalo_edzesi_napok(felhasznalo_id, nap_sorszam) VALUES(?,?)";
    const [rows] = await pool.execute(query, [id, nap]);
    return rows;
}
//update


//delete
async function deleteEdzesiNap(id, nap) {
    const query = "DELETE FROM felhasznalo_edzesi_napok WHERE felhasznalo_edzesi_napok.felhasznalo_id = ? AND felhasznalo_edzesi_napok.nap_sorszam = ?";
    const [rows] = await pool.execute(query, [id, nap]);
    return rows;
}

//select
async function getUserEdzesNapok(userId) {
    const query = `SELECT nap_sorszam FROM felhasznalo_edzesi_napok WHERE felhasznalo_id = ?`;
    const [rows] = await pool.execute(query, [userId]);
    let napok = [];
    for (let i = 0; i < rows.length; i++) {
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
async function insertEdzo(edzo_id, edzoterem_cim_lng, edzoterem_cim_lat, kep, idezet, leiras, kompetenciak) {
    const query = "INSERT INTO edzo(edzo_id, edzoterem_cim, kep, idezet, leiras, kompetenciak) VALUES (?,POINT(?,?),?,?,?,?)";
    const [rows] = await pool.execute(query, [edzo_id, edzoterem_cim_lng, edzoterem_cim_lat, kep, idezet, leiras, kompetenciak]);
    return rows;
}

//update
async function updateEdzo(edzoterem_cim_lat, edzoterem_cim_lng, kep, idezet, leiras,kompetenciak, id) {
    const query = 'UPDATE edzo SET edzoterem_cim=POINT(?,?),kep=?,idezet=?,leiras=?,kompetenciak=? WHERE edzo.edzo_id = ?;';
    const [rows] = await pool.execute(query, [edzoterem_cim_lng, edzoterem_cim_lat, kep, idezet, leiras, kompetenciak, id]);
    return rows;
}
async function updateStatuszElfogadva(id) {
    const query = 'UPDATE edzo SET statusz = "elfogadva" WHERE edzo.edzo_id = ?;';
    const [rows] = await pool.execute(query, [id]);
    return rows;
}

//select
async function selectAllTrainers() {
    const query = `SELECT login.id, login.felh_nev AS nev, edzo.kep, edzo.leiras AS kompetenciak, edzo.edzoterem_cim, edzo.idezet FROM edzo INNER JOIN login ON edzo.edzo_id = login.id WHERE statusz LIKE "elfogadva";`;
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
        WHERE  edzo.statusz LIKE "elfogadva"
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
        where ST_Distance_Sphere(edzo.edzoterem_cim, POINT(?, ?)) < 26`;
    
    const [rows] = await pool.execute(query, [lng, lat]);
    return rows;
}
async function selectAllTrainersByName(name) {
    const query = `SELECT login.id, login.felh_nev AS nev, edzo.kep, edzo.leiras AS kompetenciak, edzo.edzoterem_cim, edzo.idezet 
                    FROM edzo 
                        INNER JOIN login ON edzo.edzo_id = login.id 
                    WHERE edzo.statusz LIKE "elfogadva" AND login.felh_nev LIKE ?`;
    const [rows] = await pool.execute(query, [`%${name}%`]);
    return rows;
}
async function getEdzoSurveyDone(id) {
    const query = `SELECT COUNT(*) AS "counter" FROM edzo WHERE edzo.edzo_id = ? AND edzo.statusz LIKE "elfogadva" AND edzo.edzoterem_cim IS NOT NULL`;
    const [rows] = await pool.execute(query, [id]);
    return rows;
}
async function selectJelentkezoEById(id) {
    const query = `SELECT edzo.statusz FROM edzo WHERE edzo.edzo_id = ?`;
    const [rows] = await pool.execute(query, [id]);
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
    const [csoportIdRes] = await pool.execute("SELECT terv_csoport_id FROM edzesterv WHERE felhasznalo_id = ? ORDER BY terv_csoport_id DESC LIMIT 1", [userId]);
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
async function kommentInaktivalas(komment_id) {
    const query = "UPDATE komment SET statusz = 'inaktiv' WHERE komment_id = ?";
    const [rows] = await pool.execute(query, [komment_id]);
    return rows;
}

async function kommentAktivalas(komment_id) {
    const query = "UPDATE komment SET statusz = 'aktiv' WHERE komment_id = ?";
    const [rows] = await pool.execute(query, [komment_id]);
    return rows;
}

//select
async function selectKommentekByEdzoId(edzo_id) {
    const query = `
        SELECT k.komment_id, k.szoveg, k.ertekeles, k.statusz, k.edzo_id, l.felh_nev AS felhasznalo_nev 
        FROM komment k
            LEFT JOIN login l ON k.felhasznalo_id = l.id
        WHERE k.edzo_id = ? AND k.statusz LIKE "aktív"
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


//delete
async function deleteGyakorlat(id) {
    const query = "DELETE FROM gyakorlat WHERE gyakorlat_id = ?";
    const [rows] = await pool.execute(query, [id]);
    return rows;
}

//select
async function selectAllGyakorlatok() {
    const query = "SELECT gyakorlat.gyakorlat_id, gyakorlat.nev AS gyakorlat_nev, gyakorlat.leiras, gyakorlat.kor, gyakorlat.ismetles, gyakorlat.tipus, izomcsoport.nev AS izomcsoport_nev FROM gyakorlat LEFT JOIN gyakorlat_izomcsoport ON gyakorlat.gyakorlat_id = gyakorlat_izomcsoport.gyakorlat_id LEFT JOIN izomcsoport ON gyakorlat_izomcsoport.izom_id = izomcsoport.izom_id";
    const [rows] = await pool.execute(query);
    return rows;
}

//receptek tábla


//insert


//update


//delete

async function deleteRecept(id) {
    const query = "DELETE FROM recept WHERE recept_id = ?";
    const [rows] = await pool.execute(query, [id]);
    return rows;
}

//select
async function selectAllReceptek() {
    const query = "SELECT * FROM recept";
    const [rows] = await pool.execute(query);
    return rows;
}

async function saveHetiEtrend(userId, hetiEtrend, csoportId = null) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        if (csoportId == null) {
            const [rows] = await conn.execute(
                "SELECT COALESCE(MAX(csoport_id), 0) + 1 AS nextId FROM etrend WHERE felhasznalo_id = ?",
                [userId]
            );
            csoportId = rows[0].nextId || 1;
        }

        await conn.execute("DELETE FROM etrend WHERE felhasznalo_id = ? AND csoport_id = ?", [userId, csoportId]);

        const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
        const etkezesSorszama = {
            reggeli: 1,
            ebed: 2,
            vacsora: 3,
            csemege: 4
        };

        for (const napiEtrend of hetiEtrend) {
            if (typeof napiEtrend.nap_index !== 'number' || napiEtrend.nap_index < 0 || napiEtrend.nap_index > 6) {
                continue;
            }

            const weekday = napok[napiEtrend.nap_index] || `Nap ${napiEtrend.nap_index}`;
            if (!Array.isArray(napiEtrend.etkezesek)) {
                continue;
            }

            for (const etkezes of napiEtrend.etkezesek) {
                if (!etkezes || !etkezes.recept || typeof etkezes.recept.recept_id !== 'number') {
                    continue;
                }

                const sorszama = etkezesSorszama[etkezes.etkezes_tipus] || 0;
                await conn.execute(
                    "INSERT INTO etrend (csoport_id, weekday, etkezes_sorszama, felhasznalo_id, recept_id) VALUES (?, ?, ?, ?, ?)",
                    [csoportId, weekday, sorszama, userId, etkezes.recept.recept_id]
                );
            }
        }

        await conn.commit();
        return csoportId;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

async function deleteHetiEtrendByUser(userId, csoportId = null) {
    if (csoportId == null) {
        const query = "DELETE FROM etrend WHERE felhasznalo_id = ?";
        const [rows] = await pool.execute(query, [userId]);
        return rows;
    }

    const query = "DELETE FROM etrend WHERE felhasznalo_id = ? AND csoport_id = ?";
    const [rows] = await pool.execute(query, [userId, csoportId]);
    return rows;
}

async function getAllHetiEtrendekByUser(userId) {
    const query = `
        SELECT
            e.csoport_id,
            e.weekday,
            e.etkezes_sorszama,
            r.recept_id,
            r.nev,
            r.leiras,
            r.etkezes_tipus,
            r.zsir,
            r.protein,
            r.szenhidrat
        FROM etrend e
        JOIN recept r ON e.recept_id = r.recept_id
        WHERE e.felhasznalo_id = ?
        ORDER BY e.csoport_id ASC, e.weekday ASC, e.etkezes_sorszama ASC`;

    const [rows] = await pool.execute(query, [userId]);

    const weekdayIndex = {
        "Hétfő": 0,
        "Kedd": 1,
        "Szerda": 2,
        "Csütörtök": 3,
        "Péntek": 4,
        "Szombat": 5,
        "Vasárnap": 6
    };

    const plans = {};

    for (const row of rows) {
        const csoportId = row.csoport_id;
        if (!plans[csoportId]) {
            plans[csoportId] = {
                csoport_id: csoportId,
                hetiEtrend: Array.from({ length: 7 }, (_, napIndex) => ({ nap_index: napIndex, etkezesek: [] }))
            };
        }

        const napIdx = typeof weekdayIndex[row.weekday] === 'number' ? weekdayIndex[row.weekday] : 0;
        plans[csoportId].hetiEtrend[napIdx].etkezesek.push({
            etkezes_tipus: row.etkezes_tipus,
            recept: {
                recept_id: row.recept_id,
                nev: row.nev,
                leiras: row.leiras,
                etkezes_tipus: row.etkezes_tipus,
                zsir: row.zsir,
                protein: row.protein,
                szenhidrat: row.szenhidrat
            }
        });
    }

    return Object.values(plans).sort((a, b) => a.csoport_id - b.csoport_id);
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
//allergiat_okoz tábla

//insert

//update

//select
async function selectReceptAllergenekById(recept_id) {
    const query = "SELECT allergiat_okoz.allergen_id FROM allergiat_okoz WHERE allergiat_okoz.recept_id = ?";
    const [rows] = await pool.execute(query, [recept_id]);
    return rows;
}
/* =========================
   HETI BEOSZTÁS
========================= */

//heti_beosztas tábla

//insert
async function insertHetiBeosztasSingle(weekday, start, end, mettol, edzoId) {
    await pool.execute(`
        INSERT INTO heti_beosztas
        (weekday, start, end, mettol_ervenyes, edzo_id, statusz)
        VALUES (?, ?, ?, ?, ?, 'aktiv')
    `, [
        weekday,
        start,
        end,
        mettol,
        edzoId
    ]);
}

async function softDeleteHetiBeosztas(edzoId, mettol) {
    await pool.execute(`
        UPDATE heti_beosztas
        SET statusz = 'torolt'
        WHERE edzo_id = ?
        AND mettol_ervenyes = ?
    `, [edzoId, mettol]);
}

async function getHetiBeosztas(edzoId) {
    const [rows] = await pool.execute(`
        SELECT 
            weekday,
            TIME_FORMAT(start, '%H:%i') AS start,
            TIME_FORMAT(end, '%H:%i') AS end,
            mettol_ervenyes,
            edzo_id
        FROM heti_beosztas
        WHERE edzo_id = ?
        AND statusz = 'aktiv'
    `, [edzoId]);

    return rows;
}

async function checkHetiBeosztasExists(edzoId, mettol) {
    const [rows] = await pool.execute(`
        SELECT 1 FROM heti_beosztas
        WHERE edzo_id = ?
        AND mettol_ervenyes = ?
        AND statusz = 'aktiv'
        LIMIT 1
    `, [edzoId, mettol]);

    return rows.length > 0;
}

async function isInHB(edzoId, datum, weekday, ido) {

    const [rows] = await pool.execute(`
        SELECT 1
        FROM heti_beosztas hb
        WHERE hb.edzo_id = ?
        AND hb.statusz = 'aktiv'
        AND hb.weekday = ?
        AND TIME_FORMAT(hb.start, '%H:%i') <= ?
        AND TIME_FORMAT(hb.end, '%H:%i') >= ?
        AND hb.mettol_ervenyes = (
            SELECT MAX(hb2.mettol_ervenyes)
            FROM heti_beosztas hb2
            WHERE hb2.edzo_id = ?
            AND hb2.statusz = 'aktiv'
            AND hb2.mettol_ervenyes <= ?
        )
        LIMIT 1
    `, [edzoId, weekday, ido, ido, edzoId, datum]);

    return rows.length > 0;
}

/* =========================
   KA
========================= */

async function getKulonlegesAlkalmak(edzoId) {
    const [rows] = await pool.execute(`
        SELECT 
            ka_id,
            datum,
            TIME_FORMAT(ido, '%H:%i') AS ido,
            statusz,
            edzo_id
        FROM kulonleges_alkalom
        WHERE edzo_id = ?
        AND statusz <> 'torolt'
    `, [edzoId]);

    return rows;
}

async function isBlockedByKA(edzoId, datum, ido) {

    const [rows] = await pool.execute(`
        SELECT 1 FROM kulonleges_alkalom
        WHERE edzo_id = ?
        AND datum = ?
        AND TIME_FORMAT(ido, '%H:%i') = ?
        AND statusz = 'aktiv'
        LIMIT 1
    `, [edzoId, datum, ido]);

    return rows.length > 0;
}

async function getKAByExact(edzoId, datum, ido) {

    const [rows] = await pool.execute(`
        SELECT 
            ka_id,
            datum,
            TIME_FORMAT(ido, '%H:%i') AS ido,
            statusz
        FROM kulonleges_alkalom
        WHERE edzo_id = ?
        AND datum = ?
        AND TIME_FORMAT(ido, '%H:%i') = ?
        AND statusz <> 'torolt'
        LIMIT 1
    `, [edzoId, datum, ido]);

    return rows[0];
}

async function insertKulonlegesAlkalom(datum, ido, statusz, edzoId) {
    await pool.execute(`
        INSERT INTO kulonleges_alkalom (datum, ido, statusz, edzo_id)
        VALUES (?, ?, ?, ?)
    `, [datum, ido, statusz, edzoId]);
}

async function updateKAStatus(id, statusz) {
    await pool.execute(`
        UPDATE kulonleges_alkalom
        SET statusz = ?
        WHERE ka_id = ?
    `, [statusz, id]);
}

async function markInvalidKAAsDeleted(edzoId, mettol) {
    await pool.execute(`
        UPDATE kulonleges_alkalom
        SET statusz = 'torolt'
        WHERE edzo_id = ?
        AND statusz <> 'torolt'
        AND datum >= ?
    `, [edzoId, mettol]);
}

/* =========================
   FOGLALÁS
========================= */

async function getOwnBooking(datum, ido, userId, edzoId) {

    const [rows] = await pool.execute(`
        SELECT *
        FROM foglalas
        WHERE datum = ?
        AND TIME_FORMAT(ido, '%H:%i') = ?
        AND felhasznalo_id = ?
        AND edzo_id = ?
        LIMIT 1
    `, [datum, ido, userId, edzoId]);

    return rows[0];
}

async function insertBooking(datum, ido, userId, edzoId) {
    await pool.execute(`
        INSERT INTO foglalas
        (datum, ido, statusz, felhasznalo_id, edzo_id)
        VALUES (?, ?, 'aktiv', ?, ?)
    `, [datum, ido, userId, edzoId]);
}

async function updateBookingStatus(id, statusz) {
    await pool.execute(`
        UPDATE foglalas
        SET statusz = ?
        WHERE foglalas_id = ?
    `, [statusz, id]);
}

async function isSlotTakenByOther(datum, ido, userId, edzoId) {

    const [rows] = await pool.execute(`
        SELECT 1 FROM foglalas
        WHERE datum = ?
        AND TIME_FORMAT(ido, '%H:%i') = ?
        AND edzo_id = ?
        AND statusz = 'aktiv'
        AND felhasznalo_id <> ?
        LIMIT 1
    `, [datum, ido, edzoId, userId]);

    return rows.length > 0;
}

async function deleteInactiveElsewhereAtSameTime(userId, edzoId, datum, ido) {

    await pool.execute(`
        UPDATE foglalas
        SET statusz = 'torolt'
        WHERE felhasznalo_id = ?
        AND edzo_id <> ?
        AND datum = ?
        AND TIME_FORMAT(ido, '%H:%i') = ?
        AND statusz = 'inaktiv'
    `, [userId, edzoId, datum, ido]);
}

/* =========================
   GETEK
========================= */

async function getFoglalas(edzoId) {
    const [rows] = await pool.execute(`
        SELECT 
            f.datum,
            TIME_FORMAT(f.ido, '%H:%i') AS ido,
            f.statusz,
            f.felhasznalo_id,
            l.felh_nev AS felhasznalo_nev
        FROM foglalas f
        JOIN login l ON l.id = f.felhasznalo_id
        WHERE f.edzo_id = ?
        AND f.statusz <> 'torolt'
    `, [edzoId]);

    return rows;
}

async function getFoglalasNoNames(edzoId) {
    const [rows] = await pool.execute(`
        SELECT 
            datum,
            TIME_FORMAT(ido, '%H:%i') AS ido,
            statusz,
            felhasznalo_id
        FROM foglalas
        WHERE edzo_id = ?
        AND statusz <> 'torolt'
    `, [edzoId]);

    return rows;
}

async function getMyBookings(userId) {
    const [rows] = await pool.execute(`
        SELECT 
            f.datum,
            TIME_FORMAT(f.ido, '%H:%i') AS ido,
            f.statusz,
            f.edzo_id,
            l.felh_nev AS edzo_nev
        FROM foglalas f
        JOIN login l ON l.id = f.edzo_id
        WHERE f.felhasznalo_id = ?
        AND f.statusz <> 'torolt'
        ORDER BY f.datum, f.ido
    `, [userId]);

    return rows;
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

//izomcsoport tábla

//select
async function selectAllIzomcsoport() {
    const query = `SELECT * FROM izomcsoport`;
    const [rows] = await pool.execute(query);
    return rows;
}
//tranzakció(felhasznalo + allergias_ra)
async function insertUser(testsuly, magassag, edzesre_forditott_ido, cel_alak_id, cel_testsuly, EKM_id, id, allergiak, preferenciak, edzesiNapok) {
    const conn = await pool.getConnection();
    try {
        // Tranzakció indítása
        await conn.beginTransaction();

        // felhasználó rögzítése
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
        
        // preferenciák hozzá adása
        for (let i = 0; i < preferenciak.length; i++) {   
            const [result3] = await conn.execute(
                "INSERT INTO allergias_ra(felhasznalo_id, allergen_id) VALUES (?,?)",
                [id, preferenciak[i].allergen_id]
            );
            if (result3.affectedRows !== 1) {
                throw new Error("Sikertelen jóváírás");
            }
        }

        //edzesi napok hozzá adása
        for (let i = 0; i < edzesiNapok.length; i++) {   
            const [result3] = await conn.execute(
                "INSERT INTO felhasznalo_edzesi_napok(felhasznalo_id, nap_sorszam) VALUES (?,?)",
                [id, edzesiNapok[i]]
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

//gyakorlat tábla + izomcsoport kapcsoló tábla tranzakció
async function insertGyakorlat(nev, leiras, kor, ismetles, tipus, izomcsoport_id) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [result] = await conn.execute(
            "INSERT INTO gyakorlat (nev, leiras, kor, ismetles, tipus) VALUES (?, ?, ?, ?, ?)",
            [nev, leiras, kor, ismetles, tipus]
        );

        if (result.affectedRows !== 1) {
            throw new Error("Sikertelen gyakorlat felvétel");
        }

        const gyakorlatId = result.insertId;

        await conn.execute(
            "INSERT INTO gyakorlat_izomcsoport (gyakorlat_id, izom_id) VALUES (?, ?)",
            [gyakorlatId, izomcsoport_id]
        );

        await conn.commit();
        console.log("Gyakorlat sikeresen felvéve");
        return "Sikeres gyakorlat felvétel";
    } catch (err) {
        await conn.rollback();
        console.error("Gyakorlat felvétel visszagörgetve:", err.message);
        throw err;
    } finally {
        conn.release();
    }
}

//recept tábala + allergiat_okoz tábla tranzakció
async function insertRecept(nev, leiras, etkezes_tipus, zsir, protein, szenhidrat, allergenek ) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [result] = await conn.execute(
            "INSERT INTO recept (nev, leiras, etkezes_tipus, zsir, protein, szenhidrat) VALUES (?, ?, ?, ?, ?, ?)",
            [nev, leiras, etkezes_tipus, zsir, protein, szenhidrat]
        );

        if (result.affectedRows !== 1) {
            throw new Error("Sikertelen gyakorlat felvétel");
        }

        const receptId = result.insertId;

        // allergének hozzá adása
        if (allergenek && allergenek.length > 0){
            for (let i = 0; i < allergenek.length; i++) {   
                const [result2] = await conn.execute(
                    "INSERT INTO allergiat_okoz (recept_id, allergen_id) VALUES (?,?)",
                    [receptId, allergenek[i].allergen_id]
                );
                if (result2.affectedRows !== 1) {
                    throw new Error("Sikertelen jóváírás");
                }
            }
        }

        await conn.commit();
        console.log("Recept sikeresen felvéve");
        return "sikeres recept rögzítés";
    } catch (err) {
        await conn.rollback();
        console.error("Recept felvétel visszagörgetve:", err.message);
        throw err;
    } finally {
        conn.release();
    }
}

//tranzakció jelentkezéshez (login + edzo)
async function insertJelentkezes(felh_nev, jelszo, email, telszam, nem, role, szul_datum) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [result] = await conn.execute(
            "INSERT INTO login (felh_nev, jelszo, email, telszam, nem, role, szul_datum) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [felh_nev, jelszo, email, telszam, nem, role, szul_datum]
        );

        if (result.affectedRows !== 1) {
            throw new Error("Sikertelen jelentkezés");
        }

        const result2 = await conn.execute(
            "INSERT INTO edzo (edzo_id, statusz) VALUES (?, 'jelentkezett')",
            [result.insertId]
        );

        await conn.commit();
        console.log("Jelentkezés sikeresen felvéve");
        return result.insertId ;
    } catch (err) {
        await conn.rollback();
        console.error("Jelentkezés felvétel visszagörgetve:", err.message);
        throw err;
    } finally {
        conn.release();
    }
}

// jelentkezés törléséhez tranzakció (edzo + login)
async function deleteJelentkezes(id) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        await conn.execute(
            "DELETE FROM edzo WHERE edzo_id = ?",
            [id]
        );

        const [result] = await conn.execute(
            "DELETE FROM login WHERE id = ?",
            [id]
        );

        if (result.affectedRows !== 1) {
            throw new Error("Sikertelen jelentkezés törlés");
        }

        await conn.commit();
        
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

//top4 edzo
async function selectTopFourTrainers() {
    const query = `
    SELECT 
    e.edzo_id as id,
    l.felh_nev as nev,
    e.kep,
    e.leiras AS kompetenciak,
    e.idezet
    FROM edzo e
INNER JOIN komment k ON e.edzo_id = k.edzo_id
INNER JOIN login l ON e.edzo_id = l.id
INNER JOIN (
    SELECT AVG(ertekeles) AS avg_ertekeles
    FROM komment
    WHERE statusz = 'aktiv'
) global

WHERE k.statusz = 'aktiv'

GROUP BY e.edzo_id, e.kep

HAVING COUNT(k.komment_id) >= 2

ORDER BY 
    (
        (COUNT(k.komment_id) / (COUNT(k.komment_id) + 5)) * AVG(k.ertekeles)
        +
        (5 / (COUNT(k.komment_id) + 5)) * global.avg_ertekeles
    ) DESC

LIMIT 4;`;
    const [rows] = await pool.execute(query);
    return rows;
}
//!Export
module.exports = {
    selectTopFourTrainers,
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
    selectAllEdzoterem,
    selectAllTrainersByDist,
    selectKommentekByEdzoId,
    insertKomment,
    insertHetiBeosztasSingle,
    checkHetiBeosztasExists,
    insertKulonlegesAlkalom,
    selectTrainersByDist,
    softDeleteHetiBeosztas,
    getKulonlegesAlkalmak,
    getHetiBeosztas,
    getKAByExact,
    updateKAStatus,
    markInvalidKAAsDeleted,
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
    getUserPhysicalData,
    insertAllergiasRa,
    selectAorPById,
    deleteAllergiasRa,
    saveResetToken,
    clearResetToken,
    getUserByToken,
    selectAllLoginData,
    selectAllKommentek,
    selectKommentekByUserIdForAdmin,
    selectKommentekByEdzoIdForAdmin,
    selectAllAdminLoginData,
    selectLoginDataByKommentId,
    deleteFelhasznalo,
    restoreFelhasznalo,
    kommentInaktivalas,
    kommentAktivalas,
    updateFelhasznaloRole,
    selectAllIzomcsoport,
    insertGyakorlat,
    deleteGyakorlat,
    insertRecept,
    deleteRecept,
    saveHetiEtrend,
    deleteHetiEtrendByUser,
    getAllHetiEtrendekByUser,
    selectJelentkezok,
    insertJelentkezes,
    deleteJelentkezes,
    updateStatuszElfogadva,
    selectAllTrainersByName,
    getEdzoSurveyDone,
    getUserSurveyDone,
    selectJelentkezoEById,
    isBlockedByKA,
    isSlotTakenByOther,
    isInHB,
    getFoglalas,
    getFoglalasNoNames,
    getMyBookings,
    getOwnBooking,
    updateBookingStatus,
    insertBooking,
    deleteInactiveElsewhereAtSameTime,
    updateCalorieGoal,
    selectReceptAllergenekById,
};
