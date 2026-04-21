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
router.post('/userDataInsert', upload.single("file") ,checkUser.checkUserData, loginCheck.loginCheck, async (request, response) =>{
    try {

        const { 
            testsuly,
            magassag,
            edzesre_forditott_ido,
            cel_alak,
            cel_testsuly,
            edzesen_kivuli_mozgas
        } = request.body;

        database.insertUser(
            testsuly,
            magassag,
            edzesre_forditott_ido,
            cel_alak,
            cel_testsuly,
            edzesen_kivuli_mozgas,
            request.session.user.id
        );

        response.status(200).json({
            message: "adatok sikeresen mentve",
        })

    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Hiba a végponton."
        });
    }
});

//?Post /api/userDataUpdate
router.post('/userDataUpdate', upload.none() ,checkUser.checkUserData, loginCheck.loginCheck, async (request, response) =>{
    try {

        const { 
            testsuly,
            magassag,
            edzesre_forditott_ido,
            cel_alak,
            cel_testsuly,
            edzesen_kivuli_mozgas
        } = request.body;

        database.updateUser(
            testsuly,
            magassag,
            edzesre_forditott_ido,
            cel_alak,
            cel_testsuly,
            edzesen_kivuli_mozgas,
            request.session.user.id
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

router.get('/getUserData', loginCheck.loginCheck, async (request, response) =>{
    try {
        const id = request.session.user.id;
        const userData = await database.selectFelhDataById(id);
        response.status(200).json({
            message: "Személyi adatok sikeresen lekérve",
            result: userData
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Személyi adatok lekérése sikertelen"
        });
    }
});

router.post('postAllergiak', loginCheck.loginCheck, checkUser.checkAllergiak, async (request,response) =>{
    try {
        const {etelAllergiak} = request.body;

        const allergiakMost = database.selectAorPById(request.session.user.id, 'a');

        let hozzaAdandoak = [];

        etelAllergiak.forEach(allergia => {
            let i = 0;
            while(i < allergiakMost.length && allergia != allergiakMost[i]){
                i++
            }
            if(i == allergiakMost.length){
                database.insertAllergiasRa(request.session.user.id, allergia);
            }
        });
        response.status(200).json({
            message: "Allergia adatok feltöltése sikeres"
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Allergia adatok feltöltése sikertelen"
        });
    }
});

router.post('postPreferenciak', loginCheck.loginCheck, checkUser.checkPreferenciak, async (request,response) =>{
    try {
        const {etelPreferenciak} = request.body;

        const preferenciakMost = database.selectAorPById(request.session.user.id, 'p');

        etelPreferenciak.forEach(preferencia => {
            let i = 0;
            while(i < preferenciakMost.length && preferencia != preferenciakMost[i]){
                i++
            }
            if(i == preferenciakMost.length){
                database.insertAllergiasRa(request.session.user.id, preferencia);
            }
        });
        response.status(200).json({
            message: "Preferencia adatok feltöltése sikeres"
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Preferencia adatok feltöltése sikertelen"
        });
    }
});

router.get('getAllergiasRa', loginCheck.loginCheck, async (request, response) =>{
    try {
        const allergiak = database.selectAorPById(request.session.user.id, 'p');
        const preferenciak = database.selectAorPById(request.session.user.id, 'a');

        response.status(200).json({
            message: "Allergiák és preferenciák lekérése sikeres",
            allergiak: allergiak,
            preferenciak: preferenciak,
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Allergiák és preferenciák lekérése sikertelen"
        });
    }
});

module.exports = router;
