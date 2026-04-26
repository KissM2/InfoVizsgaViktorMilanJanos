const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
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

        const kor = new Date().getFullYear() - new Date(adatok.szul_datum).getFullYear();

        //Mifflin-St Jeor képlet
        let bmr = (10 * adatok.testsuly) + (6.25 * adatok.magassag) - (5 * kor);
        if (adatok.nem === 'Férfi') {
            bmr += 5;
        }
        else {
            bmr -= 161
        }

        //edzesen kivuli mozgas szorzoi
        const szorzok = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725 }; //1 Ülőmunka 2 Séta 3 Aktiv f 4 rendszeres sport
        const faktor = szorzok[adatok.EKM_id] || 1.2; //alapbol 1.2 legyen
        let napiSzukseglet = bmr * faktor;

        if (adatok.cel_testsuly < adatok.testsuly) {
            napiSzukseglet -= 500;
        } 
        else if (adatok.cel_testsuly > adatok.testsuly) {
            napiSzukseglet += 300;
        }

        const veglegesKcal = Math.round(napiSzukseglet);

        await database.updateCalorieGoal(userId, veglegesKcal);

        response.status(200).json({
            szamitottKaloria: veglegesKcal,
            message: "Kalória cél kiszámolva és elmentve."
        });

    } catch (error) {
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
        
        const allergenek = JSON.parse(request.body.allergenek);

        const result = await database.insertRecept(
            nev,
            leiras,
            etkezes_tipus,
            zsir,
            protein,
            szenhidrat,
            allergenek
        );

        if(result != "sikeres recept rögzítés"){
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
module.exports = router;