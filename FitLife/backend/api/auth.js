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
router.post('/updateJelszo', validator.validatePassword, async (request, response) => {
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

router.get('/getErintettekForAdmin', async (request, response) =>{
    try {
        const komment_id = request.query.komment_id;
        const authData = await database.selectLoginDataByKommentId(komment_id);
        response.status(200).json({
            message: "Kommenthez tartozók adatai sikeresen lekérve",
            results: authData
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Kommenthez tartozók adatai lekérése sikertelen"
        });
    }
});

router.delete('/deleteUser', async (request, response) =>{
    try {
        const felhasznalo_id = request.query.id;
        const result = await database.deleteFelhasznalo(felhasznalo_id);

        if(result.affectedRows === 0){
            return response.status(404).json({
                message: "Hiba történt a felhasználó törlésekor."
            });
        }

        response.status(200).json({
            message: "Felhasználó törlése sikeres.",
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Felhasználó törlése sikertelen."
        });
    }
});

router.post('/restoreUser', async (request, response) =>{
    try {
        const felhasznalo_id = request.body.id;
        const result = await database.restoreFelhasznalo(felhasznalo_id);

        if(result.affectedRows === 0){
            return response.status(404).json({
                message: "Hiba történt a felhasználó visszaállításakor."
            });
        }

        response.status(200).json({
            message: "Felhasználó visszaállítása sikeres.",
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Felhasználó visszaállítása sikertelen."
        });
    }
});

router.post('/felhasznaloSzerepModositas', async (request, response) =>{
    try {
        if(request.body.ujRole == 'admin'){
            return response.status(403).json({
                message: "Nem lehetséges admin szerepre módosítani egy felhasználó szerepét."
            });
        }
        const felhasznalo_id = request.body.id;
        const ujRole = request.body.ujRole;
        const result = await database.updateFelhasznaloRole(felhasznalo_id, ujRole);

        if(result.affectedRows === 0){
            return response.status(404).json({
                message: "Hiba történt a felhasználó szerepének módosításakor."
            });
        }

        response.status(200).json({
            message: "Felhasználó szerepének módosítása sikeres.",
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Felhasználó szerepének módosítása sikertelen."
        });
    }
});

module.exports = router;
