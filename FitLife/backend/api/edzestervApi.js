const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');

router.get('/gyakorlatok', async (request, response) => {
    try {
        const gyakorlatok = await database.selectAllGyakorlatok();
        response.status(200).json(gyakorlatok);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Nem sikerült lekérni a gyakorlatokat." });
    }
});

module.exports = router;