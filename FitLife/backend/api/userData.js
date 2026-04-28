const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');
const checkUser = require('../middleware/checkUserData.js');
const loginCheck = require('../middleware/requireLogin.js');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');
const { request } = require('http');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, file.originalname); //?file eredeti neve
    }
});

const upload = multer({ storage });

//?Post /api/userData
router.post('/userDataInsert', upload.single("file") ,loginCheck.loginCheck, checkUser.checkUserData, checkUser.checkAllergiak, checkUser.checkPreferenciak, async (request, response) =>{
    try {

        const { 
            testsuly,
            magassag,
            edzesre_forditott_ido,
            cel_alak,
            cel_testsuly,
            edzesen_kivuli_mozgas,
            etelAllergiak,
            etelPreferenciak,
        } = request.body;
        
        database.insertUser(
            testsuly,
            magassag,
            edzesre_forditott_ido,
            cel_alak,
            cel_testsuly,
            edzesen_kivuli_mozgas,
            request.session.user.id,
            JSON.parse(etelAllergiak),
            JSON.parse(etelPreferenciak),
        );

        response.status(200).json({
            message: "adatok sikeresen mentve",
        })

    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Hiba a végponton."
        });
    }
});

//?Post /api/userDataUpdate
router.post('/userDataUpdate', upload.none() ,checkUser.checkUserData, loginCheck.loginCheck, async (request, response) =>{
    try {

        const { 
            testsuly,
            magassag,
            edzesre_forditott_ido,
            cel_alak,
            cel_testsuly,
            edzesen_kivuli_mozgas
        } = request.body;

        database.updateUser(
            testsuly,
            magassag,
            edzesre_forditott_ido,
            cel_alak,
            cel_testsuly,
            edzesen_kivuli_mozgas,
            request.session.user.id
        );

        response.status(200).json({
            message: "adatok sikeresen frissítve",
        })

    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Hiba a végponton."
        });
    }
});

router.get('/getUserData', loginCheck.loginCheck, async (request, response) =>{
    try {
        const id = request.session.user.id;
        const userData = await database.selectFelhDataById(id);
        response.status(200).json({
            message: "Személyi adatok sikeresen lekérve",
            result: userData
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Személyi adatok lekérése sikertelen"
        });
    }
});

router.post('/postAllergiak', loginCheck.loginCheck, checkUser.checkAllergiak, async (request,response) =>{
    try {
        const {etelAllergiak} = request.body;

        const allergiakMost = await database.selectAorPById(request.session.user.id, 'a');

        etelAllergiak.forEach(allergia => {
            let i = 0;
            while(i < allergiakMost.length && allergia.allergen_id != allergiakMost[i].allergen_id){
                i++
            }
            if(i == allergiakMost.length){
                database.insertAllergiasRa(request.session.user.id, allergia.allergen_id);
            }else{
                if(i < allergiakMost.length){
                    allergiakMost.splice(i,1);
                }
            }            
        });

        allergiakMost.forEach(allergia =>{      
            database.deleteAllergiasRa(request.session.user.id, allergia.allergen_id);
        });

        response.status(200).json({
            message: "Allergia adatok feltöltése sikeres"
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Allergia adatok feltöltése sikertelen"
        });
    }
});

router.post('/postPreferenciak', loginCheck.loginCheck, checkUser.checkPreferenciak, async (request,response) =>{
    try {
        const {etelPreferenciak} = request.body;

        const preferenciakMost = await database.selectAorPById(request.session.user.id, 'p');

        etelPreferenciak.forEach(preferencia => {
            let i = 0;
            while(i < preferenciakMost.length && preferencia.allergen_id != preferenciakMost[i].allergen_id){
                i++
            }
            if(i == preferenciakMost.length){
                database.insertAllergiasRa(request.session.user.id, preferencia.allergen_id);
            }else{
                if(i < preferenciakMost.length){
                    preferenciakMost.splice(i,1);
                }
            } 
        });

        preferenciakMost.forEach(preferencia =>{  
            database.deleteAllergiasRa(request.session.user.id, preferencia.allergen_id);
        });

        response.status(200).json({
            message: "Preferencia adatok feltöltése sikeres"
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Preferencia adatok feltöltése sikertelen"
        });
    }
});

router.get('/getAllergiasRa', loginCheck.loginCheck, async (request, response) =>{
    try {
        const allergiak = await database.selectAorPById(request.session.user.id, 'a');
        const preferenciak = await database.selectAorPById(request.session.user.id, 'p');

        response.status(200).json({
            message: "Allergiák és preferenciák lekérése sikeres",
            allergiak: allergiak,
            preferenciak: preferenciak,
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Allergiák és preferenciák lekérése sikertelen"
        });
    }
});

router.get('/getEdzesiNapok', loginCheck.loginCheck, async (request, response) =>{
    try {
        const userId = request.session.user.id;
        const edzesiNapok = await database.getUserEdzesNapok(userId);

        response.status(200).json({
            message: "Edzési napok lekérése sikeres",
            edzesiNapok: edzesiNapok,
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Edzési napok lekérése sikertelen"
        });
    }
});

router.post('/postEdzesiNapok', loginCheck.loginCheck, async (request, response) =>{
    try {
        const userId = request.session.user.id;
        const {edzesiNapok} = request.body;

        const edzesiNapokMost = await database.getUserEdzesNapok(userId);

        edzesiNapok.forEach(edzesiNap => {
            let i = 0;
            while(i < edzesiNapokMost.length && edzesiNap.id != edzesiNapokMost[i]){
                i++
            }
            if(i == edzesiNapokMost.length){
                database.insertEdzesiNap(request.session.user.id, edzesiNap.id);
            }else{
                if(i < edzesiNapokMost.length){
                    edzesiNapokMost.splice(i,1);
                }
            } 
        });

        edzesiNapokMost.forEach(edzesiNap =>{  
            database.deleteEdzesiNap(request.session.user.id, edzesiNap);
        });            

        response.status(200).json({
            message: "Edzési napok lekérése sikeres",
            edzesiNapok: edzesiNapok,
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Edzési napok eltárolása sikertelen"
        });
    }
});

module.exports = router;
