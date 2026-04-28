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
        // Adunk a feltöltött file-nak egy ideiglenes egyedi nevet
        callback(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });
// Megmodnjuk hogy hány filet vár a végpont és a neveiket
const trainerApplicationUpload = upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
]);

// Vissza adja hogy mi kell legyen az új filename. Az önélatrajz: cv+user.id, a motivációs levelet: cl+user.id
function getApplicationFileName(prefix, userId, originalName) {
    return `${prefix}${userId}${path.extname(originalName)}`;
}

function getUploadedFile(request, fieldName) {
    return request.files?.[fieldName]?.[0] || null;
}

// Ha az adatbázis lekérdezések vagy a validáció közben hiba keletkezik akkor letöröljük a feltöltött fileokat
async function cleanupUploadedFiles(files) {
    await Promise.all(
        files
            .filter(Boolean)
            .map(file => fs.unlink(file.path).catch(() => {}))
    );
}
async function cleanupSavedFiles(savedPaths) {
    await Promise.all(savedPaths.map(filePath => fs.unlink(filePath).catch(() => {})));
}

// Átnevezzük a fileokat
async function renameUploadedFile(file, prefix, userId) {
    const targetFileName = getApplicationFileName(prefix, userId, file.originalname);
    const targetFilePath = path.join(file.destination, targetFileName);

    await fs.rename(file.path, targetFilePath);
    return targetFilePath;
}

// Vissza adjuk a felhasználóhoz tartozó filet
async function findApplicationPathByUserId(prefix, userId) {
    const uploadsDirectory = path.join(__dirname, '../uploads');
    const files = await fs.readdir(uploadsDirectory);
    const applicationFileName = files.find(fileName => new RegExp(`^${prefix}${userId}(\\..+)?$`, 'i').test(fileName));

    if (!applicationFileName) {
        return null;
    }

    return path.join(uploadsDirectory, applicationFileName);
}

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
router.post('/edzoRegister', trainerApplicationUpload, validator.validateEmailPassword ,validator.validateRegister, checkIfEmailUsed.checkIfEmailUsed,  async (request, response) => {
    // Elmentjük a fileok helyét, hogyha hiba van a jelentkezés közben akkor törölni tudjuk őket
    const savedPaths = [];
    let insertedUserId = null;

    try {
        const {
            felh_nev,
            email,
            telszam,
            nem,
            szul_datum,
            password, 
        } = request.body;

        const cvFile = getUploadedFile(request, 'cv');
        const coverLetterFile = getUploadedFile(request, 'coverLetter');

        if (!cvFile || !coverLetterFile) {
            await cleanupUploadedFiles([cvFile, coverLetterFile]);
            return response.status(400).json({
                message: "Az önéletrajz és a motivációs levél feltöltése kötelező."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await database.insertJelentkezes(felh_nev, hashedPassword, email, telszam, nem, "edzo", szul_datum, );
        insertedUserId = result;
        // Átnevezzük a fileokat
        savedPaths.push(await renameUploadedFile(cvFile, 'cv', insertedUserId));
        savedPaths.push(await renameUploadedFile(coverLetterFile, 'coverLetter', insertedUserId));

        request.session.user = {
            id: insertedUserId,
            email: email,
            role: "edzo"
        }

        return response.status(201).json({
            message: 'Sikeres edző rögzítés.',
        });

    } catch (error) {
        console.log(error.message);
        await cleanupUploadedFiles([
            getUploadedFile(request, 'cv'),
            getUploadedFile(request, 'coverLetter')
        ]);
        await cleanupSavedFiles(savedPaths);

        // Ha hiba van a fileok kezelése alatt akkor kitöröljük a jelentkezést, hogy a felhasznál újra tudjon próbálkozni
        if (insertedUserId !== null) {
            await database.deleteJelentkezes(insertedUserId).catch((rollbackError) => {
                console.error('Jelentkezés rollback sikertelen:', rollbackError.message);
            });
        }
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
                message: 'Hibás belépési adatok, vagy a fiók megszűnt.'
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
        
        let elfogadva = true;
        let surveyDone = true;
        let result = null;
        
        if(login[0].role == "edzo"){
            const accepted = await database.selectJelentkezoEById(login[0].id);
            if(accepted.statusz == "elfogadva" ){
                result = await database.getEdzoSurveyDone(login[0].id);
            }else{
                elfogadva = false;
            }
        }else if(login[0].role == "felhasznalo"){
            result = await database.getUserSurveyDone(login[0].id);
        }

        if(result){
            surveyDone = result[0].counter > 0;
        }


        return response.status(200).json({
            message: 'Sikeres bejelentkezés.',
            role: login[0].role,
            elfogadva: elfogadva,
            surveyDone: surveyDone,
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

router.delete('/deleteUser', requireLogin.loginCheck, async (request, response) => {
    try {
        const felhasznalo_id = request.session.user.id; 
        const result = await database.deleteFelhasznalo(felhasznalo_id);

        if(result.affectedRows === 0){
            return response.status(404).json({
                message: "Hiba történt a felhasználó törlésekor."
            });
        }
        request.session.destroy((err) => {
            if (err) {
                console.error("Hiba a session törlésekor:", err);
            }
            response.clearCookie('connect.sid');
            response.status(200).json({
                message: "Felhasználó törlése és kijelentkeztetése sikeres."
            });
        });
    } catch (error) {
        response.status(500).json({
            message: "Szerverhiba a felhasználó törlése során."
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

router.get('/getAllAdminAuthData', async (request, response) =>{
    try {
        const authData = await database.selectAllAdminLoginData();
        response.status(200).json({
            message: "Admin bejelentkezési adatok sikeresen lekérve",
            result: authData
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Admin bejelentkezési adatok lekérése sikertelen"
        });
    }
});

router.post('/adminRegister', upload.none(), validator.validateEmailPassword , checkIfEmailUsed.checkIfEmailUsed, async (request, response) => {
    try {
        const {email, password, felh_nev} = request.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertLogin = await database.insertLogin(felh_nev, hashedPassword, email, null, null, "admin", null);
        
        if(insertLogin.affectedRows === 0){
            return response.status(404).json({
                message: "Hiba történt az admin rögzítésekor."
            });
        }

        response.status(200).json({
            message: "Sikeres admin rögzítés."
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Admin rögzítése sikertelen"
        });
    }
});

router.get('/getJelentkezok', requireLogin.adminCheck, async (request, response) => {
    try {
        const jelentkezok = await database.selectJelentkezok();
        response.status(200).json({
            message: "Jelentkezők sikeresen lekérve",
            results: jelentkezok
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "Jelentkezők lekérése sikertelen"
        });
    }
});

// Vissza adja az önéletrajzot userId alapján
router.get('/jelentkezok/:userId/cv', requireLogin.adminCheck, async (request, response) => {
    try {
        const { userId } = request.params;

        if (!/^\d+$/.test(userId)) {
            return response.status(400).json({
                message: "Érvénytelen felhasználó azonosító."
            });
        }

        const cvPath = await findApplicationPathByUserId('cv', userId);

        if (!cvPath) {
            return response.status(404).json({
                message: "A CV nem található."
            });
        }

        return response.download(cvPath, path.basename(cvPath));
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "A CV letöltése sikertelen."
        });
    }
});

// Vissza adja a motivációs levelet userId alapján
router.get('/jelentkezok/:userId/cover-letter', requireLogin.adminCheck, async (request, response) => {
    try {
        const { userId } = request.params;

        if (!/^\d+$/.test(userId)) {
            return response.status(400).json({
                message: "Érvénytelen felhasználó azonosító."
            });
        }

        const coverLetterPath = await findApplicationPathByUserId('coverLetter', userId);

        if (!coverLetterPath) {
            return response.status(404).json({
                message: "A motivációs levél nem található."
            });
        }

        return response.download(coverLetterPath, path.basename(coverLetterPath));
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "A motivációs levél letöltése sikertelen."
        });
    }
});

router.delete('/deleteJelentkezo', requireLogin.adminCheck, async(request, response) =>{
    try {
        const id = request.query.id
        const result = await database.deleteJelentkezes(id);
        await fs.unlink('./uploads/coverLetter' + id + '.pdf');
        await fs.unlink('./uploads/cv' + id + '.pdf');
        response.status(200).json({
            message: "Edző jelentkezése sikeresen elutasítva"
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "A jelentkezés elutasítása sikertelen."
        });
    }
});

router.post('/postJelentkezoelfogadas', requireLogin.adminCheck, async(request, response) =>{
    try {
        const id = request.body.id
        const result = await database.updateStatuszElfogadva(id);
        response.status(200).json({
            message: "Edző jelentkezése sikeresen elfogadva"
        })
    } catch (error) {
        console.error(error.message);
        response.status(500).json({
            message: "A jelentkezés elfogadása sikertelen."
        });
    }
});

module.exports = router;
