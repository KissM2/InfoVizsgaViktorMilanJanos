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

module.exports = router;