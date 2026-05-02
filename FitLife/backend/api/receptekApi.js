const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const requireLogin = require('../middleware/requireLogin.js');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage });

router.get('/receptek', async (request, response) => {
    try {
        const receptek = await database.selectAllReceptek();
        response.status(200).json(receptek);
    } catch (error) {
        response.status(500).json({ message: "Nem sikerült lekérni a recepteket." });
    }
});
router.get('/szamitott-kaloria', requireLogin.loginCheck, async (request, response) => {
    try {
        const userId = request.session.user.id;
        const adatok = await database.getUserPhysicalData(userId);

        if (!adatok) {
            return response.status(404).json({ message: "Felhasználói adatok nem találhatók." });
        }

        const veglegesKcal = await szamitottKaloriaGeneralas(userId, adatok);

        response.status(200).json({
            message: "Kalória cél kiszámolva és elmentve.",
            szamitottKaloria: veglegesKcal,
            celAlak: adatok.cel_alak_nev,
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Szerverhiba a számítás során." });
    }
});
router.post('/postUjRecept', upload.none(), async (request, response) => {
    try {
        const {
            nev,
            leiras,
            etkezes_tipus,
            zsir,
            protein,
            szenhidrat,
        } = request.body;

        const allergenek = request.body.allergenek ? JSON.parse(request.body.allergenek) : [];

        const result = await database.insertRecept(
            nev,
            leiras,
            etkezes_tipus,
            zsir,
            protein,
            szenhidrat,
            allergenek
        );

        if (result !== "sikeres recept rögzítés") {
            return response.status(400).json({ message: "DB hiba a recept rögzítésekor." });
        }

        response.status(200).json({ message: "Recept sikeresen rögzítve." });

    } catch (error) {
        response.status(500).json({ message: "Nem sikerült rögzíteni a receptet." });
    }
});
router.delete('/deleteRecept', async (request, response) => {
    try {
        const receptId = request.query.id;
        const result = await database.deleteRecept(receptId);
        if(result.affectedRows !== 1){
            return response.status(400).json({ message: "DB hiba a recept törlésekor." });
        }
        response.status(200).json({ message: "Recept sikeresen törölve." });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Nem sikerült törölni a receptet." });
    }
});

router.post('/generateHetiEtrend', requireLogin.loginCheck, async (request, response) => {
    try {
        const userId = request.session.user.id;

        const fizikaiAdatok = await database.getUserPhysicalData(userId);

        if (!fizikaiAdatok) {
            return response.status(404).json({
                message: "Felhasználói adatok nem találhatók."
            });
        }

        const kaloriaIgeny = await szamitottKaloriaGeneralas(userId, fizikaiAdatok);
        const celAlak = fizikaiAdatok.cel_alak_nev;

        const receptek = await getReceptekAllergenekkelBackend();

        const allergiak = await database.selectAorPById(userId, 'a') || [];
        const preferenciak = await database.selectAorPById(userId, 'p') || [];

        const elozoHetiEtrend = request.session.elozoHetiEtrend || null;

        const hetiEtrend = hetiEtrendGeneralasBackend(
            receptek,
            kaloriaIgeny,
            celAlak,
            allergiak,
            preferenciak,
            elozoHetiEtrend
        );

        request.session.elozoHetiEtrend = hetiEtrend;

        response.status(200).json({
            message: "Heti étrend sikeresen legenerálva.",
            kaloriaIgeny,
            celAlak,
            hetiEtrend
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Nem sikerült legenerálni a heti étrendet."
        });
    }
});

router.post('/saveHetiEtrend', requireLogin.loginCheck, async (request, response) => {
    try {
        const userId = request.session.user.id;
        const { hetiEtrend, csoport_id } = request.body;

        if (!Array.isArray(hetiEtrend)) {
            return response.status(400).json({ message: "Érvénytelen heti étrend adatok." });
        }

        const csoportId = typeof csoport_id === 'number' ? csoport_id : null;
        const savedCsoportId = await database.saveHetiEtrend(userId, hetiEtrend, csoportId);
        request.session.elozoHetiEtrend = hetiEtrend;

        response.status(200).json({ message: "Heti étrend sikeresen elmentve.", csoport_id: savedCsoportId });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Nem sikerült elmenteni az étrendet." });
    }
});

router.get('/getHetiEtrendek', requireLogin.loginCheck, async (request, response) => {
    try {
        const userId = request.session.user.id;
        const hetiEtrendek = await database.getAllHetiEtrendekByUser(userId);
        response.status(200).json(hetiEtrendek);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Nem sikerült lekérni a mentett étrendeket." });
    }
});

router.delete('/deleteHetiEtrend', requireLogin.loginCheck, async (request, response) => {
    try {
        const userId = request.session.user.id;
        const csoportId = request.query.csoport_id ? Number(request.query.csoport_id) : null;

        if (request.query.csoport_id && Number.isNaN(csoportId)) {
            return response.status(400).json({ message: "Érvénytelen csoport_id." });
        }

        await database.deleteHetiEtrendByUser(userId, csoportId);
        if (csoportId === null) {
            request.session.elozoHetiEtrend = null;
        }

        response.status(200).json({ message: "Heti étrend sikeresen törölve.", csoport_id: csoportId });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Nem sikerült törölni az étrendet." });
    }
});

// Helper functions
function szamolKcal(protein, szenhidrat, zsir) {
    return (protein * 4) + (szenhidrat * 4) + (zsir * 9);
}

async function szamitottKaloriaGeneralas(userId, adatok) {
    const kor = new Date().getFullYear() - new Date(adatok.szul_datum).getFullYear();

    let bmr = (10 * adatok.testsuly) + (6.25 * adatok.magassag) - (5 * kor);

    if (adatok.nem === 'Férfi') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    const szorzok = {
        1: 1,
        2: 1.2,
        3: 1.4,
        4: 1.5
    };

    const faktor = szorzok[adatok.EKM_id] || 1.2;

    let napiSzukseglet = bmr * faktor;

    if (adatok.cel_testsuly < adatok.testsuly) {
        napiSzukseglet -= 500;
    } else if (adatok.cel_testsuly > adatok.testsuly) {
        napiSzukseglet += 300;
    }

    const veglegesKcal = Math.round(napiSzukseglet);

    await database.updateCalorieGoal(userId, veglegesKcal);

    return veglegesKcal;
}

async function getReceptekAllergenekkelBackend() {
    const receptek = await database.selectAllReceptek();

    for (const recept of receptek) {
        const allergenek = await database.selectReceptAllergenekById(recept.recept_id);
        recept.allergenek = allergenek.map(a => a.allergen_id);
    }

    return receptek;
}

function makroCelok(celAlak, kaloriaIgeny) {
    switch (celAlak) {
        case "Izomépítés":
            return {
                protein: kaloriaIgeny * 0.30 / 4,
                szenhidrat: kaloriaIgeny * 0.45 / 4,
                zsir: kaloriaIgeny * 0.25 / 9
            };

        case "Fogyás":
            return {
                protein: kaloriaIgeny * 0.35 / 4,
                szenhidrat: kaloriaIgeny * 0.30 / 4,
                zsir: kaloriaIgeny * 0.35 / 9
            };

        case "Erőemelés":
            return {
                protein: kaloriaIgeny * 0.30 / 4,
                szenhidrat: kaloriaIgeny * 0.50 / 4,
                zsir: kaloriaIgeny * 0.20 / 9
            };

        case "Állóképesség":
            return {
                protein: kaloriaIgeny * 0.20 / 4,
                szenhidrat: kaloriaIgeny * 0.60 / 4,
                zsir: kaloriaIgeny * 0.20 / 9
            };

        default:
            return {
                protein: kaloriaIgeny * 0.30 / 4,
                szenhidrat: kaloriaIgeny * 0.40 / 4,
                zsir: kaloriaIgeny * 0.30 / 9
            };
    }
}

function hetiEtrendGeneralasBackend(
    receptek,
    kaloriaIgeny,
    celAlak,
    allergiak,
    preferenciak,
    elozoHetiEtrend
) {
    const ujHet = [];

    for (let napIndex = 0; napIndex < 7; napIndex++) {
        const elozoNap = elozoHetiEtrend ? elozoHetiEtrend[napIndex] : null;

        const napiEtrend = napiEtrendMakrovalBackend(
            receptek,
            kaloriaIgeny,
            celAlak,
            allergiak,
            preferenciak,
            elozoNap,
            napIndex
        );

        ujHet.push(napiEtrend);
    }

    return ujHet;
}

function napiEtrendMakrovalBackend(
    receptek,
    kaloriaIgeny,
    celAlak,
    allergiak,
    preferenciak,
    elozoNap,
    napIndex
) {
    const napiCel = makroCelok(celAlak, kaloriaIgeny);

    const reggeli = legjobbReceptTop3RandomBackend(
        receptekTipusSzerintBackend(receptek, "reggeli", allergiak, preferenciak),
        {
            protein: napiCel.protein * 0.25,
            szenhidrat: napiCel.szenhidrat * 0.25,
            zsir: napiCel.zsir * 0.25
        },
        elozoNap ? elozoNap.etkezesek : [],
        "reggeli"
    );

    const ebed = legjobbReceptTop3RandomBackend(
        receptekTipusSzerintBackend(receptek, "ebed", allergiak, preferenciak),
        {
            protein: napiCel.protein * 0.40,
            szenhidrat: napiCel.szenhidrat * 0.40,
            zsir: napiCel.zsir * 0.40
        },
        elozoNap ? elozoNap.etkezesek : [],
        "ebed"
    );

    const vacsora = legjobbReceptTop3RandomBackend(
        receptekTipusSzerintBackend(receptek, "vacsora", allergiak, preferenciak),
        {
            protein: napiCel.protein * 0.35,
            szenhidrat: napiCel.szenhidrat * 0.35,
            zsir: napiCel.zsir * 0.35
        },
        elozoNap ? elozoNap.etkezesek : [],
        "vacsora"
    );

    const etkezesek = [];

    if (reggeli) {
        etkezesek.push({
            etkezes_tipus: "reggeli",
            recept: reggeli
        });
    }

    if (ebed) {
        etkezesek.push({
            etkezes_tipus: "ebed",
            recept: ebed
        });
    }

    if (vacsora) {
        etkezesek.push({
            etkezes_tipus: "vacsora",
            recept: vacsora
        });
    }

    let osszKcal = 0;

    for (const item of etkezesek) {
        osszKcal += szamolKcal(item.recept.protein, item.recept.szenhidrat, item.recept.zsir);
    }

    if (osszKcal < kaloriaIgeny * 0.9) {
        const csemege = legjobbReceptTop3RandomBackend(
            receptekTipusSzerintBackend(receptek, "csemege", allergiak, preferenciak),
            {
                protein: napiCel.protein * 0.10,
                szenhidrat: napiCel.szenhidrat * 0.10,
                zsir: napiCel.zsir * 0.10
            },
            elozoNap ? elozoNap.etkezesek : [],
            "csemege"
        );

        if (csemege) {
            etkezesek.push({
                etkezes_tipus: "csemege",
                recept: csemege
            });

            osszKcal += szamolKcal(csemege.protein, csemege.szenhidrat, csemege.zsir);
        }
    }

    return {
        nap_index: napIndex,
        napi_kcal: Math.round(osszKcal),
        etkezesek
    };
}

function receptekTipusSzerintBackend(receptek, tipus, allergiak, preferenciak) {
    return receptek.filter(recept =>
        recept.etkezes_tipus === tipus &&
        receptSzurhetoBackend(recept, allergiak, preferenciak)
    );
}

function receptSzurhetoBackend(recept, allergiak, preferenciak) {
    const tiltottak = tiltottAllergenIdkBackend(allergiak, preferenciak);

    if (!recept.allergenek || recept.allergenek.length === 0) {
        return true;
    }

    return !recept.allergenek.some(allergenId => tiltottak.includes(allergenId));
}

function tiltottAllergenIdkBackend(allergiak, preferenciak) {
    const allergiaIdk = allergiak.map(a => a.allergen_id);
    const preferenciaIdk = preferenciak.map(p => p.allergen_id);

    return [
        ...allergiaIdk,
        ...preferenciaIdk
    ];
}

function legjobbReceptTop3RandomBackend(lista, celMakro, elozoEtkezesek = [], etkezesTipus) {
    const elozoAzonosTipusu = elozoEtkezesek.find(e => e.etkezes_tipus === etkezesTipus);
    const elozoReceptId = elozoAzonosTipusu?.recept?.recept_id ?? null;
    let szurt = lista;

    if (elozoReceptId !== null && lista.length > 1) {
        szurt = lista.filter(r => r.recept_id !== elozoReceptId);
    }

    if (szurt.length === 0) {
        console.warn("Nincs megfelelő recept a szűrés után.");
        return null;
    }

    const pontozott = szurt.map(recept => ({
        recept,
        pont:
            Math.abs(celMakro.protein - recept.protein) +
            Math.abs(celMakro.szenhidrat - recept.szenhidrat) +
            Math.abs(celMakro.zsir - recept.zsir)
    }));

    pontozott.sort((a, b) => a.pont - b.pont);
    const top3 = pontozott.slice(0, 3);
    return top3[Math.floor(Math.random() * top3.length)].recept;
}

module.exports = router;