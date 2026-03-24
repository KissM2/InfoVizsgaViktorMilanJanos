const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');
const bcrypt = require('bcrypt'); //?npm install bcrypt
const validator = require('../middleware/Validalas.js');
const checkIfEmailUsed = require('../middleware/checkIfEmailUsed.js');

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
        const { fullname, email, password, birthdate, phone } = request.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUser = await database.insertUser(fullname, hashedPassword, email, "felhasznalo", birthdate, phone);

        request.session.user = {
            email: email,
            role: "felhasznalo"
        }

        return response.status(201).json({
            message: 'Sikeres felhasználó rögzítés.',
            results: insertUser
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
        const { fullname, email, password, birthdate, phone } = request.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUser = await database.insertUser(fullname, hashedPassword, email, "edzo", birthdate, phone);

        request.session.user = {
            email: email,
            role: "edzo"
        }

        return response.status(201).json({
            message: 'Sikeres edző rögzítés.',
            results: insertUser
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

module.exports = router;
