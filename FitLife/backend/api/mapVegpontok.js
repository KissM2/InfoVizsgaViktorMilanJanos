const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');

//middleware
const {loginCheck} = require('../middleware/requireLogin.js');


//?GET /api/getEdzoTerem
router.get('/getEdzoTerem', async (request, response) => {
    try {
        if(!request.query.edzoid){
            return response.status(500).json({ message: "Nincs megadva edzo." });    
        }
        const edzoTerem = await database.selectEdzoTerem(request.query.edzoid);
        response.status(200).json({
            edzoTerem: edzoTerem[0].edzoterem_cim
        });
    } catch (error) {
        response.status(500).json({ message: "Nem sikerült lekérni az edzőtermet." });
    }
});

router.get('/getAllEdzoterem', async (request, response) => {
    try {
        const edzoteremAdatok = await database.selectAllEdzoterem();
        response.status(200).json({
            message: "Edzőzermek adatai sikeresen lekérve.", 
            edzoteremAdatok: edzoteremAdatok
        });
    } catch (error) {
        response.status(500).json({ message: "Nem sikerült lekérni az edzőtermeket." });
    }
});

module.exports = router;
