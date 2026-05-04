const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const requireLogin = require('../middleware/requireLogin.js');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, file.originalname); //?file eredeti neve
    }
});

const upload = multer({ storage });

// Súlyozás célok alapján
const pontozasSzabalyok = {
    'Izomépítés': { 'sulyzós': 15, 'saját_testsúlyos': 5, 'kardió': -10 },
    'Fogyás': { 'kardió': 15, 'sulyzós': 10, 'saját_testsúlyos': 5 },
    'Állóképesség': { 'kardió': 15, 'saját_testsúlyos': 10, 'sulyzós': -5 },
    'Erőemelés': { 'sulyzós': 20, 'saját_testsúlyos': 0, 'kardió': -15 }
};

router.get('/gyakorlatok', async (request, response) => {
    try {
        const gyakorlatok = await database.selectAllGyakorlatok();
        response.status(200).json(gyakorlatok);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Nem sikerült lekérni a gyakorlatokat." });
    }
});
router.post('/generalt-gyakorlatok', requireLogin.loginCheck, async (request, response) => {
    try {
        const userId = request.session.user.id;
        if (!userId) {
            return response.status(400).json({ message: "Hiányzó felhasználó ID." });
        }
        const userAdat = await database.getUserCel(userId);
        const gyakorlatok = await database.selectAllGyakorlatok();
        const edzesiNapok = await database.getUserEdzesNapok(userId);

        if (!userAdat) {
            return response.status(400).json({ message: "Felhasználó nem található." });
        }
        let idokeresztPercben = userAdat.edzesre_forditott_ido;
        let napiGyakorlatDb = Math.floor(idokeresztPercben / 8); // 8percet szamolok egy gyakorlatra pihenéssel.

        let szabalyok = pontozasSzabalyok[userAdat.cel_nev];
        if (!szabalyok) {
            szabalyok = { 'sulyzós': 0, 'saját_testsúlyos': 0, 'kardió': 0 };
        }
        let izomSorozat = [];
        if (edzesiNapok.length === 1) {
            izomSorozat = [['Mell', 'Hát', 'Váll', 'Bicepsz', 'Tricepsz', 'Láb', 'Has']];
        }
        else if (edzesiNapok.length === 2) {
            izomSorozat = [
                ['Mell', 'Hát', 'Váll', 'Bicepsz', 'Tricepsz'],
                ['Láb', 'Has']
            ];
        }
        else {
            izomSorozat = [
                ['Mell', 'Váll', 'Tricepsz'],
                ['Hát', 'Bicepsz'],
                ['Láb', 'Has']
            ];
        }
        let hetiTerv = {};
        for (let d = 0; d < edzesiNapok.length; d++) {
            let aktualisNap = edzesiNapok[d];
            let napiIzmok = izomSorozat[d % izomSorozat.length];
            let napiAjanlas = [];

            for (let i = 0; i < gyakorlatok.length; i++) {
                let aktualisGyakorlat = gyakorlatok[i];
                let aznapiIzomE = napiIzmok.includes(aktualisGyakorlat.izomcsoport_nev);
                let kardioE = aktualisGyakorlat.tipus === 'kardió';

                if (aznapiIzomE || kardioE) {
                    let alapPont = szabalyok[aktualisGyakorlat.tipus];
                    if (alapPont !== undefined) {
                        let randomFaktor = Math.floor(Math.random() * 4);
                        let vegsoPont = alapPont + randomFaktor;

                        if (vegsoPont > 0) {
                            napiAjanlas.push({
                                gyakorlat_id: aktualisGyakorlat.gyakorlat_id,
                                nev: aktualisGyakorlat.gyakorlat_nev,
                                leiras: aktualisGyakorlat.leiras,
                                kor: aktualisGyakorlat.kor,
                                ismetles: aktualisGyakorlat.ismetles,
                                tipus: aktualisGyakorlat.tipus,
                                izomcsoport_nev: aktualisGyakorlat.izomcsoport_nev,
                                pontszam: vegsoPont
                            });
                        }
                    }
                }
            }
            napiAjanlas.sort(function (a, b) {
                return b.pontszam - a.pontszam;
            });
            let levagottLista = napiAjanlas.slice(0, napiGyakorlatDb);
            hetiTerv[aktualisNap] = levagottLista;
        }

        response.status(200).json(hetiTerv);
    } catch (error) {
        response.status(500).json({ message: "Hiba a generálás során." });
    }
});
router.post('/mentes-edzesterv', requireLogin.loginCheck, async (request, response) => {
    try {
        const { adatok } = request.body;
        if (!adatok || adatok.length === 0) {
            return response.status(400).json({ message: "Nincs adat." });
        }
        const userId = request.session.user.id;
        if (!userId) {
            return response.status(401).json({ message: "Be kell jelentkezni" });
        }
        const tervCsoportId = Date.now().toString();

        for (const elem of adatok) {
            await database.saveEdzestervSor({
                terv_csoport_id: tervCsoportId,
                felhasznalo_id: userId,
                weekday_sorszam: elem.nap,
                gyakorlat_id: elem.gyakorlat_id,
                sorrend: elem.sorrend,
            });
        }
        response.status(200).json({ message: "Edzésterv sikeresen mentve!" });
    } catch (error) {
        response.status(500).json({ message: "Hiba a mentés során." });
    }
});
router.get('/betoltes-edzesterv', requireLogin.loginCheck, async (request, response) => {
    try {
        const userId = request.session.user.id;
        if (!userId) {
            return response.status(400).json({ message: "Nincs id." });
        }
        const adatok = await database.getLegutobbiEdzesterv(userId);
        const formazott = {};
        for (const sor of adatok) {
            const nap = sor.weekday_sorszam;
            if (!formazott[nap]) {
                formazott[nap] = [];
            }
            formazott[nap].push({
                gyakorlat_id: sor.gyakorlat_id,
                nev: sor.nev,
                leiras: sor.leiras,
                kor: sor.kor,
                ismetles: sor.ismetles,
                izomcsoport_nev: sor.izomcsoport_nev
            });
        }

        response.status(200).json(formazott);
    } catch (error) {
        response.status(500).json({ message: "Hiba a terv betöltésekor." });
    }
});
router.get('/getIzomcsoportok', async (request, response) => {
    try {
        const izomcsoportok = await database.selectAllIzomcsoport();
        response.status(200).json({ 
            message: "Izomcsoportok sikeresen lekérve.", 
            results: izomcsoportok 
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Hiba az izomcsoportok lekérésekor." });
    }
});
router.post('/postUjGyakorlat', requireLogin.loginCheck, requireLogin.adminCheck, upload.none(), async (request, response) => {
    try {
        const { 
            gyakorlat_nev,
            leiras,
            kor,
            ismetles,
            tipus,
            izomcsoport_id,
        } = request.body;

        const result = await database.insertGyakorlat(
            gyakorlat_nev,
            leiras,
            kor,
            ismetles,
            tipus,
            izomcsoport_id
        );

        if(result != "Sikeres gyakorlat felvétel"){
            return response.status(400).json({ message: "Hiba az új gyakorlat tranzakciója során." });
        }

        response.status(200).json({ message: "Új gyakorlat sikeresen felvéve." });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Hiba az új gyakorlat felvételkor." });
    }
});
router.delete('/deleteGyakorlat', requireLogin.loginCheck, requireLogin.adminCheck, async (request, response) => {
    try {
        const { id } = request.query;

        const result = await database.deleteGyakorlat(id);

        if (result.affectedRows < 1) {
            return response.status(400).json({ message: "DB hiba a gyakorlat törlésekor." });
        }

        response.status(200).json({ message: "Gyakorlat sikeresen törölve." });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Hiba a gyakorlat törlésekor." });
    }
});
module.exports = router;