const request = require('supertest');
const express = require('express');
const session = require('express-session');
const database = require('../sql/database.js');

const receptekRouter = require('../api/receptekApi.js');
const edzestervRouter = require('../api/edzestervApi.js');

jest.mock('../sql/database.js');

const app = express();
app.use(express.json());

// Beállítjuk a valódi express-session middleware-t
app.use(session({
    secret: 'teszt',
    resave: false,
    saveUninitialized: true
}));

// Létrehozunk egy KAMU bejelentkező végpontot csak a teszt kedvéért,
// hogy az agent megkapja a valós sessiont.
app.get('/test-login', (req, res) => {
    req.session.user = { id: 1, role: 'felhasznalo' };
    res.send('ok');
});

app.use('/api', receptekRouter);
app.use('/api', edzestervRouter);

// Az agent fogja megőrizni a sessiont a tesztek között
const agent = request.agent(app);

describe('Generáló Algoritmusok Tesztelése', () => {

    // A legelső teszt előtt "bejelentkezünk" a kamu végponton
    beforeAll(async () => {
        await agent.get('/test-login');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('1. GET /api/szamitott-kaloria - BMR és kalória cél számítása', async () => {
        database.getUserPhysicalData.mockResolvedValue({
            szul_datum: '1996-01-01',
            testsuly: 80,
            magassag: 180,
            nem: 'Férfi',
            EKM_id: 2,
            cel_testsuly: 75,
            cel_alak_nev: 'Fogyás'
        });
        database.updateCalorieGoal.mockResolvedValue();

        const response = await agent.get('/api/szamitott-kaloria'); // ITT AGENT-ET HASZNÁLUNK!

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Kalória cél kiszámolva és elmentve.");
        expect(response.body.szamitottKaloria).toBe(1636);
    });

    it('2. POST /api/generateHetiEtrend - Étrend generálás (Allergén szűréssel)', async () => {
        database.getUserPhysicalData.mockResolvedValue({
            szul_datum: '1996-01-01', testsuly: 80, magassag: 180, nem: 'Férfi', EKM_id: 2, cel_testsuly: 75, cel_alak_nev: 'Fogyás'
        });
        database.updateCalorieGoal.mockResolvedValue();

        database.selectAllReceptek.mockResolvedValue([
            { recept_id: 1, nev: 'Sajtos tészta', etkezes_tipus: 'ebed', zsir: 20, protein: 30, szenhidrat: 50 },
            { recept_id: 2, nev: 'Csirkés rizs', etkezes_tipus: 'ebed', zsir: 5, protein: 40, szenhidrat: 60 }
        ]);
        database.selectReceptAllergenekById.mockImplementation((id) => id === 1 ? [{ allergen_id: 1 }] : []);
        database.selectAorPById.mockImplementation((id, tipus) => tipus === 'a' ? [{ allergen_id: 1 }] : []);

        const response = await agent.post('/api/generateHetiEtrend');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Heti étrend sikeresen legenerálva.");

        const hetfoEbed = response.body.hetiEtrend[0].etkezesek.find(e => e.etkezes_tipus === 'ebed');
        expect(hetfoEbed.recept.recept_id).toBe(2);
    });

    it('3. POST /api/saveHetiEtrend - Generált étrend adatbázisba mentése', async () => {
        database.saveHetiEtrend.mockResolvedValue(10);

        const response = await agent
            .post('/api/saveHetiEtrend')
            .send({
                hetiEtrend: [{ nap_index: 0, etkezesek: [] }],
                csoport_id: null
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Heti étrend sikeresen elmentve.");
        expect(response.body.csoport_id).toBe(10);
    });

    it('4. GET /api/generalt-gyakorlatok - Edzésterv generálás célok szerint', async () => {
        database.getUserCel.mockResolvedValue({ edzesre_forditott_ido: 60, cel_nev: 'Izomépítés' });
        database.getUserEdzesNapok.mockResolvedValue([1, 3, 5]);
        database.selectAllGyakorlatok.mockResolvedValue([
            { gyakorlat_id: 1, gyakorlat_nev: 'Fekvenyomás', tipus: 'sulyzós', izomcsoport_nev: 'Mell' },
            { gyakorlat_id: 2, gyakorlat_nev: 'Futópad', tipus: 'kardió', izomcsoport_nev: 'Láb' }
        ]);

        const response = await agent.post('/api/generalt-gyakorlatok');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('1');
        expect(response.body).toHaveProperty('3');
        expect(response.body).toHaveProperty('5');
    });

    it('5. POST /api/mentes-edzesterv - Generált edzésterv mentése', async () => {
        database.saveEdzestervSor.mockResolvedValue();

        const response = await agent
            .post('/api/mentes-edzesterv')
            .send({
                adatok: [
                    { nap: 1, gyakorlat_id: 1, sorrend: 1 },
                    { nap: 1, gyakorlat_id: 2, sorrend: 2 }
                ]
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Edzésterv sikeresen mentve!");
        expect(database.saveEdzestervSor).toHaveBeenCalledTimes(2);
    });
});