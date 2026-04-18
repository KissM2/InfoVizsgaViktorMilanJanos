const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');
const bcrypt = require('bcrypt'); //?npm install bcrypt
const validator = require('../middleware/Validalas.js');
const checkIfEmailUsed = require('../middleware/checkIfEmailUsed.js');
const requireLogin = require('../middleware/requireLogin.js')

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, file.originalname); //?file eredeti neve
    }
});

const upload = multer({ storage });

//!Endpoints:
//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

//?GET /api/testsql
router.get('/testsql', async (request, response) => {
    try {
        const selectall = await database.selectall();
        response.status(200).json({
            message: 'Ez a végpont működik.',
            results: selectall
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});

//?Post /api/userRegister
router.post('/userRegister', upload.none(), validator.validateEmailPassword ,validator.validateRegister, checkIfEmailUsed.checkIfEmailUsed, async (request, response) => {
    try {
        const { fullname, email, password, birthdate, phone, nem} = request.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertLogin = await database.insertLogin(fullname, hashedPassword, email, phone, nem, "felhasznalo", birthdate, );

        request.session.user = {
            id: insertLogin.insertId,
            email: email,
            role: "felhasznalo"
        }

        return response.status(201).json({
            message: 'Sikeres felhasználó rögzítés.',
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).json({
            message: 'Ez a végpont nem működik: '
        });
    }
});

//?Post /api/edzoRegister
router.post('/edzoRegister', upload.single('cv'), validator.validateEmailPassword ,validator.validateRegister, checkIfEmailUsed.checkIfEmailUsed,  async (request, response) => {
    try {
        const { fullname, email, password, birthdate, nem ,phone } = request.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertLogin = await database.insertLogin(fullname, hashedPassword, email, phone, nem, "edzo", birthdate, );

        request.session.user = {
            id: insertLogin.insertId,
            email: email,
            role: "edzo"
        }

        return response.status(201).json({
            message: 'Sikeres edző rögzítés.',
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).json({
            message: 'Ez a végpont nem működik: '
        });
    }
});

//?Post /api/login
router.post('/login', upload.none(), validator.validateEmailPassword, async (request, response) => {
    try {
        const { email, password } = request.body;

        const login = await database.login(email);   

        if (login.length === 0) {    
            return response.status(401).json({
                message: 'Hibás email cím.'
            });
        }

        const passwordMatch = await bcrypt.compare(password, login[0].jelszo);

        if (!passwordMatch) {
                return response.status(401).json({
                    message: 'Hibás jelszó.'
                });
            }

        request.session.user = {
            id: login[0].id,
            email: email,
            role : login[0].role
        }

        return response.status(200).json({
            message: 'Sikeres bejelentkezés.'
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).json({
            message: 'Ez a végpont nem működik: '
        });
    }
});

//?GET /api/getLoginStatus
router.get('/getLoginStatus', requireLogin.loginCheck, async (request, response) =>
 {
    try {
        response.status(200).json({
            message: 'Belépési státusz sikeresen lekérve',
            id: request.session.user.id,
            role: request.session.user.role,
        })
    } catch (error) {
        console.log(error.message);
        response.status(500).json({
            message: 'Ez a végpont nem működik: '
        });
    }
 });

router.get('/getAuthData', requireLogin.loginCheck, async (request, response) =>{
    try {
        const id = request.session.user.id;
        const authData = await database.selectLoginDataById(id);
        response.status(200).json({
            message: "Bejelentkezési adatok sikeresen lekérve",
            result: authData
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Bejelentkezési adatok lekérése sikertelen"
        });
    }
});
module.exports = router;
