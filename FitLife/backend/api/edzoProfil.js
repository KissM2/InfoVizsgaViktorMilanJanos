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

module.exports = router;