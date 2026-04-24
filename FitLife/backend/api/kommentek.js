const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const requireLogin = require('../middleware/requireLogin');

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
router.post('/kommentek', requireLogin.loginCheck, async (request, response) => {
    try {
        const { szoveg, ertekeles, edzo_id} = request.body;
        
        const felhasznalo_id = request.session.user.id;

        if (!szoveg || !ertekeles || !edzo_id) {
            return response.status(400).json({ message: 'Minden mező kitöltése kötelező!' });
        }

        await database.insertKomment(szoveg, ertekeles, edzo_id, felhasznalo_id);
        response.status(201).json({ message: 'Komment sikeresen elmentve!' });
    } catch (error) {
        response.status(500).json({ message: 'Szerver hiba a mentés során.' });
    }
});

//GET /api/getAllKommentek'
router.get('/getAllKommentek', async (request, response) => {
    try {
        const kommentek = await database.selectAllKommentek();
        response.status(200).json({  
            message: "Kommentek sikeresen lekérve",
            results: kommentek 
        });
    } catch (error) {
        response.status(500).json({ message: 'Kommentek lekérése sikertelen' });
    }
});

//GET /api/kommentek : egy adott edző kommentjei
router.get('/getKommentekForAdmin', async (request, response) => {
    try {
        const {edzo_id, user_id} = request.query;
        if (!edzo_id && !user_id){
            response.status(400).json({ message: 'Hiányzó edző ID.' });
        }

        let kommentek;

        if (edzo_id){
            kommentek = await database.selectKommentekByEdzoIdForAdmin(edzo_id);
        } else if (user_id){
            kommentek = await database.selectKommentekByUserIdForAdmin(user_id);
        }

        response.status(200).json({ results: kommentek });
    } catch (error) {
        response.status(500).json({ message: 'Szerver hiba.' });
    }
});
module.exports = router;