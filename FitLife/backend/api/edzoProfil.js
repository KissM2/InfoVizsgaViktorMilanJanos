const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

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

//?GET /api/osszesEdzo
router.get('/osszesEdzo', async (request, response) => {
    try {
        const edzok = await database.selectAllTrainers();
        response.status(200).json({
            message: 'Sikeres lekérdezés.',
            results: edzok
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba történt a szerver oldalon.'
        });
    }
});


//?GET /api/edzoProfil?id=:id
router.get('/edzoProfil', async (request, response) => {
    try {
        const azon=request.query.id;
        if (!azon) {
            return response.status(400).json({
                message: 'Hiányzó edző ID.'
            });
        }
        const edzo = await database.selectTrainerById(azon);
        if (!edzo) {
            return response.status(404).json({
                message: 'Edző nem található.'
            });
        }
        response.status(200).json({
            message: 'Sikeres lekérdezés.',
            results: edzo[0]
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba történt a szerver oldalon.'
        });
    }
});

router.get('/topNegyEdzo', async (request, response) => {
    try {
        const edzok = await database.selectTopFourTrainers();
        response.status(200).json({
            message: 'Sikeres lekérdezés.',
            results: edzok
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba történt a szerver oldalon.'
        });
    }
});

//?GET /api/osszesEdzo?lng=:lng&lat=:lat
router.get('/osszesEdzoKorzetben', async (request, response) => {
    try {
        const { lng, lat } = request.query;
        const edzok = await database.selectTrainersByDist(lng, lat);
        response.status(200).json({
            message: 'Edzők sikeresen lekérve.',
            results: edzok
        });
    } catch (error) {
        response.status(500).json({
            message: 'Hiba történt a szerver oldalon az edzők lekérdezésekor.'
        });
    }
});

module.exports = router;