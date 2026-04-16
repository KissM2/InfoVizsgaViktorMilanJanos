const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');

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
router.get('/generalt-gyakorlatok', async (request, response) => {
    try {
        const userId = request.query.id;
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
        let hetiTerv = {};
        for (let d = 0; d < edzesiNapok.length; d++) {
            let aktualisNap = edzesiNapok[d];
            let napiAjanlas = [];

            for (let i = 0; i < gyakorlatok.length; i++) {
                let aktualisGyakorlat = gyakorlatok[i];
                let alapPont = szabalyok[aktualisGyakorlat.tipus];

                if (alapPont !== undefined) {
                    let randomFaktor = Math.floor(Math.random() * 4);
                    let vegsoPont = alapPont + randomFaktor;

                    if (vegsoPont > 0) {
                        napiAjanlas.push({
                            gyakorlat_id: aktualisGyakorlat.gyakorlat_id,
                            nev: aktualisGyakorlat.nev,
                            kor: aktualisGyakorlat.kor,
                            ismetles: aktualisGyakorlat.ismetles,
                            tipus: aktualisGyakorlat.tipus,
                            pontszam: vegsoPont
                        });
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

module.exports = router;