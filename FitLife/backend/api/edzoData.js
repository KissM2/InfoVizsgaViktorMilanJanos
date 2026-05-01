const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');
const loginCheck = require('../middleware/requireLogin.js');
const checkEdzoData = require('../middleware/checkEdzoData.js');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');
const { request } = require('http');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../../frontend/images'));
    },
    filename: (request, file, callback) => {
        callback(null, request.session.user.id + file.originalname); //? session id + file eredeti neve, hogy biztosan egyedi legyen
    }
});

const upload = multer({ storage });

//!Edző adatainak mentése
//? POST /api/edzoDataInsert
router.post('/edzoDataInsert', upload.single('kep'), checkEdzoData.checkEdzoData, loginCheck.loginCheck, async (request, response) =>{
    try {
        const {
            edzoterem_cim_lat,
            edzoterem_cim_lng,
            idezet,
            leiras,
            kompetenciak
        } = request.body;

        const kep = request.file.filename;

        database.updateEdzo(
            request.session.user.id,
            edzoterem_cim_lng,
            edzoterem_cim_lat,
            kep,
            idezet,
            leiras,
            kompetenciak
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

//? POST /api/edzoDataUpdate
router.post('/edzoDataUpdate', upload.single('kep'), checkEdzoData.checkEdzoData, loginCheck.loginCheck, async (request, response) =>{
    try {
        const {
            edzoterem_cim_lat,
            edzoterem_cim_lng,
            idezet, 
            leiras,
            kompetenciak
        } = request.body;

        const kep = request.file.filename;

        database.updateEdzo(
            edzoterem_cim_lat,
            edzoterem_cim_lng,
            kep,
            idezet,
            leiras,
            kompetenciak,
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


module.exports = router;
