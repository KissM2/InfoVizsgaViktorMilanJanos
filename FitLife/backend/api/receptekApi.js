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