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
router.get('/getAllKommentek', requireLogin.loginCheck, requireLogin.adminCheck, async (request, response) => {
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
router.get('/getKommentekForAdmin', requireLogin.loginCheck, requireLogin.adminCheck, async (request, response) => {
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

router.delete('/kommentInaktivalas', requireLogin.loginCheck, requireLogin.adminCheck, async (request, response) =>{
    try {
        const komment_id = request.query.komment_id;
        const result = await database.kommentInaktivalas(komment_id);

        if(result.affectedRows === 0){
            return response.status(404).json({
                message: "Hiba történt a komment inaktiválása során."
            });
        }

        response.status(200).json({
            message: "Komment inaktiválása sikeres.",
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Komment inaktiválása sikertelen."
        });
    }
});

router.post('/kommentAktivalas', requireLogin.loginCheck, requireLogin.adminCheck, async (request, response) =>{
    try {
        const komment_id = request.body.komment_id;
        const result = await database.kommentAktivalas(komment_id);

        if(result.affectedRows === 0){
            return response.status(404).json({
                message: "Hiba történt a komment aktiválása során."
            });
        }

        response.status(200).json({
            message: "Komment aktiválása sikeres.",
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Komment aktiválása sikertelen."
        });
    }
});

module.exports = router;