const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');

//? POST /api/edzoDataInsert
router.get('/getAllAllergen', async (request, response) =>{
    try {
        const allergenek = await database.selectAllAllergen();
        response.status(200).json({
            message: "Allergének sikeresen lekérve",
            result: allergenek
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Allergének lekérése sikertelen"
        });
    }
});

module.exports = router;
