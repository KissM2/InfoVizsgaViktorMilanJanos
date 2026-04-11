const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');

//GET /api/kommentek : egy adott edző kommentjei
router.get('/kommentek', async (request, response) => {
    try {
        const edzo_id = request.query.edzo_id;
        if (!edzo_id){
            response.status(400).json({ message: 'Hiányzó edző ID.' });
        } 

        const kommentek = await database.selectKommentekByEdzoId(edzo_id);
        response.status(200).json({ results: kommentek });
    } catch (error) {
        response.status(500).json({ message: 'Szerver hiba.' });
    }
});

// POST: uj komment
router.post('/kommentek', async (request, response) => {
    try {
        const { szoveg, ertekeles, edzo_id} = request.body;
        
        const felhasznalo_id = request.session.user.id;

        if (!felhasznalo_id) {
            return response.status(401).json({ message: 'Be kell jelentkezned!' });
        }

        if (!szoveg || !ertekeles || !edzo_id) {
            response.status(400).json({ message: 'Minden mező kitöltése kötelező!' });
        }

        await database.insertKomment(szoveg, ertekeles, edzo_id, felhasznalo_id);
        response.status(201).json({ message: 'Komment sikeresen elmentve!' });
    } catch (error) {
        response.status(500).json({ message: 'Szerver hiba a mentés során.' });
    }
});



module.exports = router;