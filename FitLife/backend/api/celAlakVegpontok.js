const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');

//? POST /api/edzoDataInsert
router.get('/getCelAlakOptions', async (request, response) =>{
    try {
        const celAlakOptions = await database.selectAllCelAlak();
        response.status(200).json({
            message: "Cél alak opciók sikeresen lekérve",
            result: celAlakOptions
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Cél alak opciók lekérése sikertelen"
        });
    }
});

module.exports = router;
