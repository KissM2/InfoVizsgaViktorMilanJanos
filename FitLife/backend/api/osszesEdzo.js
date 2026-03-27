const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');

router.get('/edzok', async (req, res) => {
    try {
        const edzok = await database.selectAllTrainers();
        res.status(200).json(edzok);
    } catch (err) {
        console.error("Hiba az edzők lekérésekor:", err);
        res.status(500).json({ message: "Szerver hiba történt." });
    }
});

module.exports = router;