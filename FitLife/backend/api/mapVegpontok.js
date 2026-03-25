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
            edzoTerem: edzoTerem[0].edzoterm_cim
        });
    } catch (error) {
        response.status(500).json({ message: "Nem sikerült lekérni az edzőtermet." });
    }
});

module.exports = router;
