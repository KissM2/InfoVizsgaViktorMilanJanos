const express = require('express');
const router = express.Router();
const loginCheck = require('../middleware/requireLogin.js');
const database = require('../sql/database.js');

router.get('/getEdzoidopontok',loginCheck.loginCheck, async (request, response) =>{
    try {
        const id=request.session.user.id;
        const data=await database.getEdzoIdopontok(id);
        response.status(200).json({
            message: "Időpontok sikeresen lekérve",
            result: idopontok
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Időpontok lekérése sikertelen"
        });
    }
});
module.exports = router;