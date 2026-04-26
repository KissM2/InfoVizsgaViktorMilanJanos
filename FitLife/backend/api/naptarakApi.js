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

// INSERT
router.post('/insertHB', loginCheck.loginCheck, async (req, res) => {
    try {
        const edzoId = req.session.user.id;
        const schedule = req.body;

        const mettolFormatted = getMondayInFourWeeks();

        const exists = await database.checkHetiBeosztasExists(edzoId, mettolFormatted);

        // soft delete
        if (exists) {
            await database.softDeleteHetiBeosztas(edzoId, mettolFormatted);
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

        // KA automatikus törlés
        await database.markInvalidKAAsDeleted(edzoId, mettolFormatted);

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
        const { datum, ido } = req.body;

        const weekday = (new Date(datum).getDay() + 6) % 7;

        const benneVan = await database.isInHetiBeosztas(
            edzoId,
            weekday,
            ido
        );

        if (!benneVan) {
            return res.status(400).json({
                message: "Ez az időpont nincs a beosztásban"
            });
        }

        const existing = await database.getKAByExact(
            edzoId,
            datum,
            ido
        );

        if (existing) {

            if (existing.statusz === "torolt") {
                return res.status(400).json({
                    message: "Ez az időpont törölve lett"
                });
            }

            const newStatus =
                existing.statusz === "aktiv" ? "inaktiv" : "aktiv";

            await database.updateKAStatus(existing.ka_id, newStatus);

            return res.json({ statusz: newStatus });
        }

        await database.insertKulonlegesAlkalom(
            datum,
            ido,
            "aktiv",
            edzoId
        );

        res.json({ statusz: "aktiv" });

    } catch (err) {
        res.status(500).json({ message: "Hiba történt" });
    }
});
/* =========================
   FOGLALÁS
========================= */
router.post("/book", loginCheck.loginCheck, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const edzoId = req.query.edzo_id;
        const data = req.body;

        for (const datum in data) {
            for (const ido of data[datum]) {

                // 1. más aktív foglalás
                const occupied = await database.isSlotTakenByOther(
                    datum,
                    ido,
                    userId
                );

                if (occupied) continue;

                // 2. más inaktiv → torolt
                await database.deleteInactiveOthers(
                    datum,
                    ido,
                    userId
                );

                // 3. saját foglalás
                const existing = await database.getOwnBooking(
                    datum,
                    ido,
                    userId
                );

                if (!existing) {
                    await database.insertBooking(
                        datum,
                        ido,
                        userId,
                        edzoId
                    );
                } else {
                    const newStatus =
                        existing.statusz === "aktiv"
                            ? "inaktiv"
                            : "aktiv";

                    await database.updateBookingStatus(
                        existing.foglalas_id,
                        newStatus
                    );
                }
            }
        }

        res.json({ message: "Foglalás frissítve" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba történt" });
    }
});
/* =========================
   GET NAPTÁR
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
router.get("/myBookings", loginCheck.loginCheck, async (req, res) => {
    try {
        const userId = req.session.user.id;

        const data = await database.getMyBookings(userId);

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba történt" });
    }
});
module.exports = router;