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

const imagesDir = path.join(__dirname, '../../frontend/images');

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, imagesDir);
    },
    filename: (request, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${request.session.user.id}_${Date.now()}${ext}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    fileFilter: (request, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Csak kép tölthető fel!'), false);
        }
    }
});

async function deleteOldImage(filename) {
    if (!filename) return;

    const oldPath = path.join(__dirname, '../../frontend/images', filename);

    try {
        await fs.unlink(oldPath);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
}

//!Edző adatainak mentése
//? POST /api/edzoDataInsert
router.post('/edzoDataInsert', upload.single('kep'), checkEdzoData.checkEdzoData, loginCheck.loginCheck, async (request, response) => {
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
router.post('/edzoDataUpdate', loginCheck.loginCheck, upload.single('kep'), checkEdzoData.checkEdzoData, async (request, response) => {
    try {
        const {
            edzoterem_cim_lat,
            edzoterem_cim_lng,
            idezet,
            leiras,
            kompetenciak
        } = request.body;

        const userId = request.session.user.id;
        const newImage = request.file ? request.file.filename : undefined;

        const oldImage = await database.getEdzoImage(userId);
        if (oldImage && newImage && oldImage !== newImage) {
            await deleteOldImage(oldImage);
        }
        // ha nincs új kép → marad a régi
        const finalImage = newImage ?? oldImage;

        await database.updateEdzo(
            edzoterem_cim_lat,
            edzoterem_cim_lng,
            finalImage,
            idezet,
            leiras,
            kompetenciak,
            userId
        );

        response.status(200).json({
            message: 'adatok sikeresen frissítve',
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: 'Hiba a végponton.'
        });
    }
}
);


module.exports = router;
