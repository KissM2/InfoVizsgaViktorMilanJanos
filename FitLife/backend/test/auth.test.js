const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs/promises');

const authRouter = require('../api/auth.js');
const database = require('../sql/database.js');

// MOCKOLÁS - Kicseréljük az igazi modulokat dublőrökre
jest.mock('../sql/database.js');
jest.mock('bcrypt');
jest.mock('fs/promises');

// Létrehozunk egy "Teszt" Express szervert hogy ne a valódit kelljen elindítani
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Szimuláljuk a Session-t
app.use(session({
    secret: 'teszt-titok',
    resave: false,
    saveUninitialized: true
}));

app.use('/api', authRouter);

// Létrehozunk egy "böngészőt" (agent), ami megjegyzi a bejelentkezést a tesztek között
const agent = request.agent(app);

describe('Auth Router Végpontok Tesztelése', () => {

    // Minden teszt előtt lenullázzuk a mockolt függvényeket
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // 1. Teszt: /api/userRegister
    it('1. POST /api/userRegister - Sikeresen regisztrál egy új felhasználót', async () => {
        // MOCKOLÁS: Megmondjuk a dublőrnek, mit válaszoljon a middleware-nek és a route-nak
        database.checkUser.mockResolvedValue([]);
        database.login.mockResolvedValue([]); 
        database.insertLogin.mockResolvedValue({ insertId: 100 });
        bcrypt.hash.mockResolvedValue('titkositott_jelszo_teszt');

        const response = await request(app)
            .post('/api/userRegister')
            .send({
                felh_nev: 'Teszt Elek',
                email: 'teszt@fitlife.hu',
                telszam: '+36301234567',
                nem: 'férfi',
                szul_datum: '1990-01-01',
                password: 'Jelszo123!'
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Sikeres felhasználó rögzítés.');
        expect(database.insertLogin).toHaveBeenCalledTimes(1); 
    });

    // 2. Teszt: /api/edzoRegister
    it('2. POST /api/edzoRegister - Sikeres edző regisztráció (Fájlfeltöltéssel)', async () => {
        database.checkUser.mockResolvedValue([]);
        database.login.mockResolvedValue([]);
        database.insertJelentkezes.mockResolvedValue(200);
        bcrypt.hash.mockResolvedValue('titkositott_jelszo_teszt');
        fs.rename.mockResolvedValue();

        const response = await request(app)
            .post('/api/edzoRegister')
            .field('felh_nev', 'Edző Teszt')
            .field('email', 'edzo@fitlife.hu')
            .field('telszam', '+36309876543')
            .field('nem', 'nő')
            .field('szul_datum', '1995-05-05')
            .field('password', 'EdzoJelszo123!')
            .attach('cv', Buffer.from('kamu-pdf-tartalom'), 'cv.pdf')
            .attach('coverLetter', Buffer.from('kamu-pdf-tartalom'), 'motivacio.pdf');

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Sikeres edző rögzítés.');
        expect(database.insertJelentkezes).toHaveBeenCalledTimes(1);
    });

    // 3. Teszt: /api/login
    it('3. POST /api/login - Sikeres bejelentkezés', async () => {
        database.login.mockResolvedValue([{ 
            id: 1, 
            jelszo: 'titkositott_jelszo_teszt', 
            role: 'felhasznalo' 
        }]);
        bcrypt.compare.mockResolvedValue(true);
        database.getUserSurveyDone.mockResolvedValue([{ counter: 1 }]);

        const response = await agent
            .post('/api/login')
            .send({
                email: 'teszt@fitlife.hu',
                password: 'Jelszo123!'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Sikeres bejelentkezés.');
        expect(response.body.role).toBe('felhasznalo');
    });

    // 4. Teszt: /api/getLoginStatus
    it('4. GET /api/getLoginStatus - Visszaadja a belépett felhasználó státuszát', async () => {
        const response = await agent.get('/api/getLoginStatus');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Belépési státusz sikeresen lekérve');
        expect(response.body.id).toBe(1);
        expect(response.body.role).toBe('felhasznalo');
    });

    // 5. Teszt: /api/getAuthData
    it('5. GET /api/getAuthData - Lekéri a bejelentkezési adatokat profilhoz', async () => {
        database.selectLoginDataById.mockResolvedValue([{
            email: 'teszt@fitlife.hu',
            felh_nev: 'Teszt Elek',
            telszam: '+36301234567',
            nem: 'férfi',
            szul_datum: '1990-01-01'
        }]);

        const response = await agent.get('/api/getAuthData');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Bejelentkezési adatok sikeresen lekérve');
        expect(response.body.result[0].felh_nev).toBe('Teszt Elek');
        expect(database.selectLoginDataById).toHaveBeenCalledWith(1);
    });

});