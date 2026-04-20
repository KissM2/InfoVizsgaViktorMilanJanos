const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');

//? POST /api/edzoDataInsert
router.get('/getEKMOptions', async (request, response) =>{
    try {
        const EKMOptions = await database.selectAllEKM();
        response.status(200).json({
            message: "Edzésen kívüli mozgás opciók sikeresen lekérve",
            result: EKMOptions
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Edzésen kívüli mozgás opciók lekérése sikertelen"
        });
    }
});

module.exports = router;
