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
router.get('/edzoProfil?id=:id', async (request, response) => {
    try {
        if (!request.params.id) {
            return response.status(400).json({
                message: 'Hiányzó edző ID.'
            });
        }
        request.params.id = request.params.id;
        const edzo = await database.selectTrainerById(request.params.id);
        response.status(200).json({
            message: 'Sikeres lekérdezés.',
            results: edzo
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

module.exports = router;