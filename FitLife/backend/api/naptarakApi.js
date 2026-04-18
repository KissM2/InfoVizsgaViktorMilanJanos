const express = require('express');
const router = express.Router();
const loginCheck = require('../middleware/requireLogin.js');
const database = require('../sql/database.js');

/* =========================
   DÁTUM SEGÉD
========================= */

function getMondayInFourWeeks() {
    const d = new Date();

    const day = d.getDay();
    const mondayOffset = (day === 0 ? -6 : 1 - day);

    d.setDate(d.getDate() + mondayOffset + 28);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const dayNum = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${dayNum}`;
}

/* =========================
   SEGÉD IDŐ
========================= */

const toMinutes = (t) => {
    const [h = 0, m = 0] = t.split(":").map(Number);
    return h * 60 + m;
};

const toTime = (mins) => {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    return `${h}:${m}`;
};

/* =========================
   HETI BEOSZTÁS
========================= */

// GET
router.get("/getHB", loginCheck.loginCheck, async (req, res) => {
    try {
        const edzoId = req.session.user.id;
        const data = await database.getHetiBeosztas(edzoId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Hiba történt" });
    }
});

// INSERT (slot összevonás JAVÍTVA)
router.post('/insertHB', loginCheck.loginCheck, async (req, res) => {
    try {
        const edzoId = req.session.user.id;
        const schedule = req.body;

        const mettolFormatted = getMondayInFourWeeks();

        const exists = await database.checkHetiBeosztasExists(edzoId, mettolFormatted);

        if (exists) {
            await database.deleteHetiBeosztas(edzoId, mettolFormatted);
        }

        let insertedCount = 0;

        for (let i = 0; i < schedule.length; i++) {
            const day = schedule[i];
            if (!day || !day.length) continue;

            const sorted = [...day].sort((a, b) => toMinutes(a) - toMinutes(b));

            let start = toMinutes(sorted[0]);
            let prev = start;

            for (let j = 1; j < sorted.length; j++) {
                const current = toMinutes(sorted[j]);

                // 🔥 JAVÍTÁS: folytonosság check
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

            // utolsó blokk
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
   KÜLÖNLEGES ALKALOM
========================= */

// GET
router.get("/getKA", loginCheck.loginCheck, async (req, res) => {
    try {
        const edzoId = req.session.user.id;
        const data = await database.getKulonlegesAlkalmak(edzoId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Hiba történt" });
    }
});

// TOGGLE
router.post("/toggleKA", loginCheck.loginCheck, async (req, res) => {
    try {
        const edzoId = req.session.user.id;
        const { datum, start, end } = req.body;

        const weekdayJs = new Date(datum).getDay();
        const weekday = weekdayJs === 0 ? 6 : weekdayJs - 1;

        // VALIDÁCIÓ (csak beosztásban lehet)
        const benneVan = await database.isInHetiBeosztas(
            edzoId,
            weekday,
            start
        );
        if (!benneVan) {
            return res.status(400).json({
                message: "Ez az időpont nincs a beosztásban"
            });
        }

        const existing = await database.getKAByExact(
            edzoId,
            datum,
            start,
            end
        );

        if (existing) {
            const newStatus =
                existing.statusz === "aktiv" ? "inaktiv" : "aktiv";

            await database.updateKAStatus(existing.ka_id, newStatus);

            return res.json({ statusz: newStatus });
        }

        await database.insertKulonlegesAlkalom(
            datum,
            start,
            end,
            "aktiv",
            edzoId
        );

        res.json({ statusz: "aktiv" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba történt" });
    }
});

/* =========================
   NAPTÁR
========================= */

router.get('/getCalendar', loginCheck.loginCheck, async (req, res) => {
    try {
        const edzoId = req.session.user.id;

        const heti = await database.getHetiBeosztas(edzoId);
        const kulonleges = await database.getKulonlegesAlkalmak(edzoId);
        const foglalas = await database.getFoglalas(edzoId);

        res.status(200).json({
            message: "Adatok lekérve",
            result: {
                heti,
                kulonleges,
                foglalas
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Lekérés sikertelen"
        });
    }
});

module.exports = router;