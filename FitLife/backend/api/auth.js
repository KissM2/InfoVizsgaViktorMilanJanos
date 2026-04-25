const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');
const bcrypt = require('bcrypt'); //?npm install bcrypt
const validator = require('../middleware/Validalas.js');
const checkIfEmailUsed = require('../middleware/checkIfEmailUsed.js');
const requireLogin = require('../middleware/requireLogin.js')
const crypto = require('crypto');// Beépített Hosszú, kitalálhatatlan azonosító (Token) gyártásá
const nodemailer = require('nodemailer');

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
        const { 
            felh_nev,
            email,
            telszam,
            nem,
            szul_datum,
            password,
        } = request.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertLogin = await database.insertLogin(felh_nev, hashedPassword, email, telszam, nem, "felhasznalo", szul_datum, );

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
        const {
            felh_nev,
            email,
            telszam,
            nem,
            szul_datum,
            password, 
        } = request.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertLogin = await database.insertLogin(felh_nev, hashedPassword, email, telszam, nem, "edzo", szul_datum, );

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

router.post('/updateAuthData', upload.none(), requireLogin.loginCheck, validator.validateEmail ,validator.validateRegister, checkIfEmailUsed.checkIfEmailUsed, async (request, response) =>{
    try {
        const {
            felh_nev,
            email,
            telszam,
            nem,
            szul_datum,
        } = request.body;

        database.updateLoginData(
            felh_nev,
            email,
            telszam,
            nem,
            szul_datum,
            request.session.user.id,
        );

        response.status(200).json({
            message: "Bejelentkezési adatok sikeresen frissítve"
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Bejelentkezési adatok frissítése sikertelen"
        });
    }
});
router.post('/updateJelszo', requireLogin.loginCheck, validator.validatePassword, async (request, response) => {
    try {
        const userId = request.session.user.id; 
        const { jelszo } = request.body;

        const hash = await bcrypt.hash(jelszo, 10);
        await database.updateJelszo(hash, userId);
        
        response.status(200).json({ message: "Sikeres jelszócsere!" });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ message: "Szerverhiba!" });
    }
});

// Email küldő beállítása
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'pelda@gmail.com',
        pass: 'pelda'
    }
});

router.post('/forgot-password', async (request, response) => {
    try {
        const { email } = request.body;
        const user = await database.login(email);

        if (!user || user.length === 0) {
            return response.status(200).json({ message: "Ha létezik a fiók, elküldtük az emailt." });
        }

        //Token generalas
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // Jelenlegi idő + 1 óra
        await database.saveResetToken(email, token, expires);

        // Email küldése
        const resetLink = `http://127.0.0.1:3000/html/jelszo_modositas.html?token=${token}`;
        
        await transporter.sendMail({
            from: '"FitLife" <noreply@fitlife.hu>',
            to: email,
            subject: 'FitLife - Jelszó visszaállítása',
            html: `<h3>Szia!</h3>
                   <p>Kattints az alábbi linkre a jelszavad visszaállításához. Ez a link 1 órán belül lejár.</p>
                   <a href="${resetLink}">${resetLink}</a>`
        });

        response.status(200).json({ message: "Ha létezik a fiók, elküldtük az emailt." });

    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Szerverhiba történt." });
    }
});
router.post('/reset-password', upload.none(), async (request, response) => {
    try {
        const { token, jelszo } = request.body;

        if (!token || !jelszo) {
            return response.status(400).json({ message: "Hiányzó adatok!" });
        }
        const user = await database.getUserByToken(token);

        if (!user) {
            return response.status(400).json({ message: "Érvénytelen vagy lejárt link!" });
        }
        const hash = await bcrypt.hash(jelszo, 10);
        await database.updateJelszo(hash, user.id);

        //linket ne lehessen ujra hasznalni
        await database.clearResetToken(user.id);

        response.status(200).json({ message: "Sikeres jelszócsere! Most már bejelentkezhetsz." });

    } catch (error) {
        console.error("Hiba a jelszó visszaállításakor:", error);
        response.status(500).json({ message: "Szerverhiba történt." });
    }
});
router.get('/getAllAuthData', async (request, response) =>{
    try {
        const authData = await database.selectAllLoginData();
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

router.post('/kijelentkezes', (request, response) => {
    request.session.destroy((err) => {
        if (err) {
            return response.status(500).json({ message: "Hiba a kijelentkezés során." });
        }
        response.clearCookie('connect.sid');
        response.status(200).json({ message: "Sikeres kijelentkezés." });
    });
});

module.exports = router;
