const request = require('supertest');
const express = require('express');
const session = require('express-session');
const database = require('../sql/database.js');

const foglalasRouter = require('../api/naptarakApi.js');

jest.mock('../sql/database.js');

const app = express();
app.use(express.json());

app.use(session({
    secret: 'teszt',
    resave: false,
    saveUninitialized: true
}));

app.get('/test-login-user', (req, res) => {
    req.session.user = { id: 1, role: 'felhasznalo' };
    res.send('ok');
});

app.get('/test-login-edzo', (req, res) => {
    req.session.user = { id: 2, role: 'edzo' };
    res.send('ok');
});

app.use('/api', foglalasRouter);

const agent = request.agent(app);

describe('Naptár és Foglalási Rendszer Tesztelése', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        database.selectJelentkezoEById.mockResolvedValue([{ statusz: 'elfogadva' }]);
        database.selectTrainerById.mockResolvedValue([{ edzo_id: 2 }]);
    });

    it('1. POST /api/insertHB - Új heti beosztás mentése (Edzőként)', async () => {
        await agent.get('/test-login-edzo');

        database.checkHetiBeosztasExists.mockResolvedValue(true);
        database.softDeleteHetiBeosztas.mockResolvedValue();
        database.insertHetiBeosztasSingle.mockResolvedValue();
        database.markInvalidKAAsDeleted.mockResolvedValue();

        // 30 perces egybefüggő blokkokkal tesztelünk az új logika miatt
        const response = await agent.post('/api/insertHB').send([
            ["08:00", "08:30"], // Hétfő (1 blokk)
            [], // Kedd
            ["14:00", "14:30"]  // Szerda (1 blokk)
        ]);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("HB mentve");
        expect(database.softDeleteHetiBeosztas).toHaveBeenCalled();
        expect(database.insertHetiBeosztasSingle).toHaveBeenCalledTimes(2);
    });

    it('2. POST /api/book - Időpont sikeres foglalása (Felhasználóként)', async () => {
        await agent.get('/test-login-user');

        const holnap = new Date();
        holnap.setDate(holnap.getDate() + 2);
        const datumStr = holnap.toISOString().slice(0, 10);

        database.getMyBookings.mockResolvedValue([]);
        database.isInHB.mockResolvedValue(true);
        database.isBlockedByKA.mockResolvedValue(false);
        database.isSlotTakenByOther.mockResolvedValue(false);
        database.getOwnBooking.mockResolvedValue(null);
        database.deleteInactiveElsewhereAtSameTime.mockResolvedValue();
        database.insertBooking.mockResolvedValue();

        const response = await agent.post('/api/book').send({
            edzo_id: 2,
            activate: {
                [datumStr]: ["10:00"]
            },
            deactivate: {}
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("OK");
        expect(database.insertBooking).toHaveBeenCalledWith(datumStr, "10:00", 1, 2);
    });

    it('3. POST /api/book - Foglalás megtagadása, ha már más lefoglalta', async () => {
        await agent.get('/test-login-user');

        const holnap = new Date();
        holnap.setDate(holnap.getDate() + 2);
        const datumStr = holnap.toISOString().slice(0, 10);

        database.getMyBookings.mockResolvedValue([]);
        database.isInHB.mockResolvedValue(true);
        database.isBlockedByKA.mockResolvedValue(false);
        database.isSlotTakenByOther.mockResolvedValue(true);

        const response = await agent.post('/api/book').send({
            edzo_id: 2,
            activate: {
                [datumStr]: ["10:00"]
            },
            deactivate: {}
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("OK");
        expect(database.insertBooking).not.toHaveBeenCalled();
    });

    it('4. POST /api/toggleKA - Kivett nap beállítása elutasítva (túl korai)', async () => {
        await agent.get('/test-login-edzo');

        const holnap = new Date();
        holnap.setDate(holnap.getDate() + 1);
        const datumStr = holnap.toISOString().slice(0, 10);

        const response = await agent.post('/api/toggleKA').send({
            datum: datumStr,
            ido: "12:00"
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("KA csak 4 hét múlva");
    });
});