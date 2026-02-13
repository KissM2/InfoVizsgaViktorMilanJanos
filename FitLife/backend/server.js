//!Module-ok importálása
const express = require('express'); //?npm install express
const session = require('express-session'); //?npm install express-session
const path = require('path');

//!Beállítások
const app = express();
const router = express.Router();

const ip = '127.0.0.1';
const port = 3000;

app.use(express.json()); //?Middleware JSON
app.set('trust proxy', 1); //?Middleware Proxy

//!Session beállítása:
app.use(
    session({
        secret: 'titkos_kulcs', //?Ezt generálni kell a későbbiekben
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
    response.sendFile(path.join(__dirname, '../frontend/html/surveyTemplate.html'));
});
router.get('/foglalasok', (request, response) => {
    response.sendFile(path.join(__dirname, '../frontend/html/foglalasok.html'));
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

//!API endpoints
app.use('/', router);
const endpoints = require('./api/api.js');
app.use('/api', endpoints);

//!Szerver futtatása
app.use(express.static(path.join(__dirname, '../frontend'))); //?frontend mappa tartalmának betöltése az oldal működéséhez
app.listen(port, ip, () => {
    console.log(`Szerver elérhetősége: http://${ip}:${port}`);
});

//?Szerver futtatása terminalból: npm run dev
//?Szerver leállítása (MacBook és Windows): Control + C
//?Terminal ablak tartalmának törlése (MacBook): Command + K