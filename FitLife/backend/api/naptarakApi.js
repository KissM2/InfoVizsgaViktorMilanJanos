const express = require('express');
const router = express.Router();
const loginCheck = require('../middleware/requireLogin.js');
const database = require('../sql/database.js');

/* =========================
   DÁTUM SEGÉD
========================= */

function getMondayInTwoWeeks() {
    const d = new Date();

    // aktuális hét hétfője
    const day = d.getDay();
    const mondayOffset = (day === 0 ? -6 : 1 - day);

    d.setDate(d.getDate() + mondayOffset + 28);

    // csak dátum kell!
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const dayNum = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${dayNum}`; // 🔥 STRING!
}

/* =========================
   HETI BEOSZTÁS INSERT
========================= */

router.post('/insertHB', loginCheck.loginCheck, async (req, res) => {
    try {
        const edzoId = req.session.user.id;
        const schedule = req.body;

        const mettolFormatted = getMondayInTwoWeeks(); // 🔥 már string!

        // duplikáció ellenőrzés
        const exists = await database.checkHetiBeosztasExists(edzoId, mettolFormatted);

        if (exists) {
            await database.deleteHetiBeosztas(edzoId, mettolFormatted);
        }

        const toMinutes = (t) => {
            const [h = 0, m = 0] = t.split(":").map(Number);
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

                if (current !== prev) {
                    await database.insertHetiBeosztasSingle(
                        i,
                        toTime(start),
                        toTime(prev), // 🔥 FIX: blokk vége
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
                toTime(prev), // 🔥 FIX
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
            const [h = 0, m = 0] = t.split(":").map(Number);
            return h * 60 + m;
        };

        const toTime = (mins) => {
            const h = String(Math.floor(mins / 60)).padStart(2, "0");
            const m = String(mins % 60).padStart(2, "0");
            return `${h}:${m}`;
        };

        // 🔥 dátum normalizálás (ha frontend nem tiszta)
        const normalizeDate = (d) => d.replaceAll(".", "-");

        // csoportosítás dátum szerint
        const grouped = {};

        data.forEach(item => {
            const datum = normalizeDate(item.datum);

            if (!grouped[datum]) grouped[datum] = [];
            grouped[datum].push(item.ido);
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
                        toTime(prev + 30), // 🔥 FIX
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
                toTime(prev + 30), // 🔥 FIX
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

router.get('/getCalendar', loginCheck.loginCheck, async (req, res) => {
    try {
        const edzoId = req.session.user.id;
        console.log(edzoId)
        const data = await database.getCalendarData(edzoId);
        console.log(data)
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