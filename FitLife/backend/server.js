//!Module-ok importálása
require('dotenv').config();
const express = require('express'); //?npm install express
const session = require('express-session'); //?npm install express-session
const path = require('path');

//!Beállítások
const app = express();
const router = express.Router();

const ip = process.env.HOST || '127.0.0.1';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json()); //?Middleware JSON
app.set('trust proxy', 1); //?Middleware Proxy

//!Session beállítása:
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    })
);

//!Routing
//?Főoldal:
router.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/index.html'));
});
router.get('/bejelentkezes', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/bejelentkez.html'));
});
router.get('/user_regisztral', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/user_regisztralas.html'));
});
router.get('/edzo_regisztral', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/trainer_regisztralas.html'));
});
router.get('/userSurvey', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/userSurvey.html'));
});
router.get('/edzoSurvey', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/edzoSurvey.html'));
});
router.get('/edzofo', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/edzofo.html'));
});
router.get('/edzo', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/edzo.html'));
});
router.get('/traineradat', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/trainer-datas.html'));
});
router.get('/trainersedit', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/trainers-edit.html'));
});
router.get('/esznt', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/edzo_szerk_nt.html'));
});
router.get('/userProfil', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/user_profil.html'));
});
router.get('/tesztn', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/naptarteszt.html'));
});
//!API endpoints
app.use('/', router);
const authEndpoints = require('./api/auth.js');
const userDataEndpoints = require('./api/userData.js');
const edzoDataEndpoints = require('./api/edzoData.js');
const edzoProfilEndpoints = require('./api/edzoProfil.js');
const receptekApi = require('./api/receptekApi.js');
const edzestervApi = require('./api/edzestervApi.js');
const mapApi = require('./api/mapVegpontok.js');
const allergenApi = require('./api/allergenek.js');
const kommentek = require('./api/kommentek.js');
const naptarak=require('./api/naptarakApi.js');
const celAlakVegpontok = require('./api/celAlakVegpontok.js');
const EKMVegpontok = require('./api/EKMVegpontok.js');

app.use('/api', authEndpoints);
app.use('/api', userDataEndpoints);
app.use('/api', edzoDataEndpoints);
app.use('/api', edzoProfilEndpoints);
app.use('/api', receptekApi);
app.use('/api', edzestervApi);
app.use('/api', mapApi);
app.use('/api', allergenApi);
app.use('/api', kommentek);
app.use('/api',naptarak);
app.use('/api', celAlakVegpontok);
app.use('/api', EKMVegpontok);

//!Szerver futtatása
app.use(express.static(path.join(__dirname, '../frontend'))); //?frontend mappa tartalmának betöltése az oldal működéséhez
app.listen(port, ip, () => {
    console.log(`Szerver elérhetősége: http://${ip}:${port}`);
});

//?Szerver futtatása terminalból: npm run dev
//?Szerver leállítása (MacBook és Windows): Control + C
//?Terminal ablak tartalmának törlése (MacBook): Command + K
