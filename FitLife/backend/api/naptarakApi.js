const express = require('express');
const router = express.Router();
const loginCheck = require('../middleware/requireLogin.js');
const database = require('../sql/database.js');

/* =========================
   DÁTUM SEGÉD
========================= */

function getMondayInTwoWeeks() {
    const date = new Date();

    date.setDate(date.getDate() + 14);

    const day = date.getDay();
    const diff = (1 - day + 7) % 7;

    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);

    return date;
}

/* =========================
   HETI BEOSZTÁS INSERT
========================= */

router.post('/insertHB', loginCheck.loginCheck, async (req, res) => {
    try {
        const edzoId = req.session.user.id;
        const schedule = req.body;

        const mettol = getMondayInTwoWeeks();
        const mettolFormatted = mettol.toISOString().split("T")[0];

        // duplikáció ellenőrzés
        const exists = await database.checkHetiBeosztasExists(edzoId, mettolFormatted);

        if (exists) {
            return res.status(400).json({
                message: "Erre a hétre már létezik beosztás"
            });
        }

        const toMinutes = (t) => {
            const [h, m] = t.split(":").map(Number);
            return h * 60 + m;
        };

        const toTime = (mins) => {
            const h = String(Math.floor(mins / 60)).padStart(2, "0");
            const m = String(mins % 60).padStart(2, "0");
            return `${h}:${m}`;
        };

        let insertedCount = 0;

        for (let i = 0; i < schedule.length; i++) {
            const day = schedule[i];
            if (!day || !day.length) continue;

            const sorted = [...day].sort((a, b) => toMinutes(a) - toMinutes(b));

            let start = toMinutes(sorted[0]);
            let prev = start;

            for (let j = 1; j < sorted.length; j++) {
                const current = toMinutes(sorted[j]);

                if (current !== prev + 30) {
                    await database.insertHetiBeosztasSingle(
                        i,
                        toTime(start),
                        toTime(prev),
                        mettolFormatted,
                        edzoId
                    );
                    insertedCount++;
                    start = current;
                }

                prev = current;
            }

            await database.insertHetiBeosztasSingle(
                i,
                toTime(start),
                toTime(prev),
                mettolFormatted,
                edzoId
            );

            insertedCount++;
        }

        if (insertedCount === 0) {
            return res.status(400).json({
                message: "Nincs érvényes adat"
            });
        }

        res.status(200).json({
            message: "Heti beosztás mentve",
            inserted: insertedCount
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Hiba történt" });
    }
});

/* =========================
   KÜLÖNLEGES ALKALOM INSERT
========================= */

router.post('/insertKA', loginCheck.loginCheck, async (req, res) => {
    try {
        const edzoId = req.session.user.id;
        const data = req.body;

        const toMinutes = (t) => {
            const [h, m] = t.split(":").map(Number);
            return h * 60 + m;
        };

        const toTime = (mins) => {
            const h = String(Math.floor(mins / 60)).padStart(2, "0");
            const m = String(mins % 60).padStart(2, "0");
            return `${h}:${m}`;
        };

        // csoportosítás dátum szerint
        const grouped = {};

        data.forEach(item => {
            if (!grouped[item.datum]) grouped[item.datum] = [];
            grouped[item.datum].push(item.ido);
        });

        // duplikáció ellenőrzés
        for (const datum in grouped) {
            const exists = await database.checkKulonlegesAlkalomExists(edzoId, datum);

            if (exists) {
                return res.status(400).json({
                    message: `Erre a dátumra már létezik adat: ${datum}`
                });
            }
        }

        let insertedCount = 0;

        for (const datum in grouped) {
            const times = grouped[datum];
            if (!times.length) continue;

            const sorted = [...times].sort((a, b) => toMinutes(a) - toMinutes(b));

            let start = toMinutes(sorted[0]);
            let prev = start;

            for (let i = 1; i < sorted.length; i++) {
                const current = toMinutes(sorted[i]);

                if (current !== prev + 30) {
                    await database.insertKulonlegesAlkalom(
                        datum,
                        toTime(start),
                        toTime(prev),
                        "aktiv",
                        edzoId
                    );
                    insertedCount++;
                    start = current;
                }

                prev = current;
            }

            await database.insertKulonlegesAlkalom(
                datum,
                toTime(start),
                toTime(prev),
                "aktiv",
                edzoId
            );

            insertedCount++;
        }

        if (insertedCount === 0) {
            return res.status(400).json({
                message: "Nincs érvényes adat"
            });
        }

        res.status(200).json({
            message: "Különleges alkalmak mentve",
            inserted: insertedCount
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Hiba történt" });
    }
});

/* =========================
   NAPTÁR LEKÉRÉS
========================= */

router.post('/getCalendar', loginCheck.loginCheck, async (req, res) => {
    try {
        const edzoId = req.session.user.id;

        const data = await database.getCalendarData(edzoId);

        res.status(200).json({
            message: "Adatok lekérve",
            result: data
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Lekérés sikertelen"
        });
    }
});

module.exports = router;