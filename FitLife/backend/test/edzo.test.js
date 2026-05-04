const request = require('supertest');
const express = require('express');
const session = require('express-session');
const database = require('../sql/database.js');

const edzoProfilRouter = require('../api/edzoProfil.js'); 
const kommentekRouter = require('../api/kommentek.js');
const receptekRouter = require('../api/receptekApi.js');

jest.mock('../sql/database.js');

const app = express();
app.use(express.json());

app.use(session({ 
    secret: 'teszt', 
    resave: false, 
    saveUninitialized: true 
}));

// Teszt-login: Beállítjuk a felhasználót (kommenteléshez kell)
app.get('/test-login-user', (req, res) => {
    req.session.user = { id: 1, role: 'felhasznalo' };
    res.send('ok');
});

// Teszt-login: Beállítjuk az admint (recept felvételéhez kell)
app.get('/test-login-admin', (req, res) => {
    req.session.user = { id: 99, role: 'admin' };
    res.send('ok');
});

app.use('/api', edzoProfilRouter);
app.use('/api', kommentekRouter);
app.use('/api', receptekRouter);

const agent = request.agent(app);

describe('Edző, Komment és Admin funkciók Tesztelése', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('1. GET /api/osszesEdzoKorzetben - Távolságalapú keresés', async () => {
        // Szimuláljuk, hogy az SQL kiszámolta a távolságot
        database.selectAllTrainersByDist.mockResolvedValue([
            { id: 2, nev: 'Edző Teszt', tavolsag: 1200 } // 1200 méterre van
        ]);

        const response = await agent.get('/api/osszesEdzoKorzetben?lng=19.04&lat=47.49');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Edzők sikeresen lekérve.');
        expect(response.body.results[0].tavolsag).toBe(1200);
        expect(database.selectAllTrainersByDist).toHaveBeenCalledWith('19.04', '47.49');
    });

    it('2. GET /api/topNegyEdzo - Top 4 edző lekérése', async () => {
        database.selectTopFourTrainers.mockResolvedValue([
            { id: 1, nev: 'Top Edző 1' },
            { id: 2, nev: 'Top Edző 2' },
            { id: 3, nev: 'Top Edző 3' },
            { id: 4, nev: 'Top Edző 4' }
        ]);

        const response = await agent.get('/api/topNegyEdzo');

        expect(response.status).toBe(200);
        expect(response.body.results.length).toBe(4);
    });

    it('3. POST /api/kommentek - Sikeres értékelés leadása', async () => {
        await agent.get('/test-login-user'); // Belépés felhasználóként
        database.insertKomment.mockResolvedValue();

        const response = await agent.post('/api/kommentek').send({
            szoveg: 'Nagyon jó edzés volt!',
            ertekeles: 5,
            edzo_id: 2
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Komment sikeresen elmentve!');
        expect(database.insertKomment).toHaveBeenCalledWith('Nagyon jó edzés volt!', 5, 2, 1);
    });

    it('4. POST /api/postUjRecept - Admin: Új recept felvétele (JSON tömbbel)', async () => {
        await agent.get('/test-login-admin'); // Belépés adminként
        
        // A te kódod konkrétan ezt a stringet várja vissza a sikeres tranzakciónál
        database.insertRecept.mockResolvedValue("sikeres recept rögzítés");

        const response = await agent.post('/api/postUjRecept')
            .field('nev', 'Zabkása')
            .field('leiras', 'Finom reggeli')
            .field('etkezes_tipus', 'reggeli')
            .field('zsir', '5')
            .field('protein', '15')
            .field('szenhidrat', '40')
            // A form-data-ban a tömböt stringként (JSON) küldi a frontend
            .field('allergenek', '[{"allergen_id": 2}]'); 

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Recept sikeresen rögzítve.');
        expect(database.insertRecept).toHaveBeenCalled();
    });

    it('5. DELETE /api/deleteRecept - Admin: Recept törlése', async () => {
        await agent.get('/test-login-admin'); // Belépés adminként
        database.deleteRecept.mockResolvedValue({ affectedRows: 1 });

        const response = await agent.delete('/api/deleteRecept?id=10');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Recept sikeresen törölve.');
        expect(database.deleteRecept).toHaveBeenCalledWith('10');
    });
});