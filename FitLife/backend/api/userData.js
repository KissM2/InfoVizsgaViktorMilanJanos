const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');
const checkUser = require('../middleware/checkUserData.js');
const loginCheck = require('../middleware/requireLogin.js');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');
const { request } = require('http');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, file.originalname); //?file eredeti neve
    }
});

const upload = multer({ storage });

//?Post /api/userData
router.post('/userData', upload.single("file") ,checkUser.checkUserData, loginCheck.loginCheck, async (request, response) =>{
    try {

        const { 
            celTestsuly, 
            cel_alak, 
            uzott_sport, 
            magassag, 
            testsuly, 
            edzesIdo,
            edzesen_kivuli_mozgas
        } = request.body;

        database.updateUser(
            celTestsuly,
            cel_alak,
            uzott_sport,
            magassag,
            testsuly,
            edzesIdo,
            edzesen_kivuli_mozgas,
            request.session.email
        );

        response.status(200).json({
            message: "adatok sikeresen frissítve",
        })

    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Hiba a végponton."
        });
    }
});


module.exports = router;
