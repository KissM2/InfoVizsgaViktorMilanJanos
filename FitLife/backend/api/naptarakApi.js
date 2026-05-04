const express = require('express');
const router = express.Router();
const db = require('../sql/database.js');
const check = require('../middleware/requireLogin.js');

/* =========================
   SEGÉD
========================= */

function normalizeTime(t) {
    return t.slice(0, 5); // "01:00:00" → "01:00"
}

function getMondayInFourWeeks() {
    const d = new Date();
    const day = d.getDay();
    const mondayOffset = (day === 0 ? -6 : 1 - day);
    d.setDate(d.getDate() + mondayOffset + 28);
    return d.toISOString().slice(0, 10);
}

function isKAAllowed(datum) {
    const d = new Date(datum);
    const limit = new Date(getMondayInFourWeeks());
    d.setHours(0, 0, 0, 0);
    limit.setHours(0, 0, 0, 0);
    return d >= limit;
}

function isWithinAllowedRange(datum) {
    const d = new Date(datum);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const limit = new Date(getMondayInFourWeeks());

    return d >= tomorrow && d < limit;
}

function getWeekday(d) {
    const day = new Date(d).getDay();
    return day === 0 ? 6 : day - 1;
}

/* =========================
   GET HB
========================= */

router.get("/getHB", check.loginCheck, async (req, res) => {
    try {
        const data = await db.getHetiBeosztas(req.session.user.id);
        res.json(data);
    } catch {
        res.status(500).json({ message: "Hiba" });
    }
});

/* =========================
   GET KA
========================= */

router.get("/getKA", check.loginCheck, async (req, res) => {
    try {
        const data = await db.getKulonlegesAlkalmak(req.session.user.id);
        res.json(data);
    } catch {
        res.status(500).json({ message: "Hiba" });
    }
});

/* =========================
   GET CALENDAR
========================= */

router.get("/getCalendar", check.loginCheck, async (req, res) => {
    try {
        const user = req.session.user;

        const edzoId = user.role === "edzo"
            ? user.id
            : req.query.id;

        const heti = await db.getHetiBeosztas(edzoId);
        const kulonleges = await db.getKulonlegesAlkalmak(edzoId);

        const foglalas = user.role === "edzo"
            ? await db.getFoglalas(edzoId)
            : await db.getFoglalasNoNames(edzoId);

        res.json({ result: { heti, kulonleges, foglalas } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Hiba" });
    }
});

/* =========================
   MY BOOKINGS
========================= */

router.get("/myBookings", check.loginCheck, async (req, res) => {
    try {
        const data = await db.getMyBookings(req.session.user.id);
        res.json(data);
    } catch {
        res.status(500).json({ message: "Hiba" });
    }
});

/* =========================
   HB INSERT
========================= */

router.post("/insertHB", check.loginCheck,check.edzoCheck, async (req, res) => {

    const edzoId = req.session.user.id;
    const data = req.body;
    const mettol = getMondayInFourWeeks();

    if (await db.checkHetiBeosztasExists(edzoId, mettol)) {
        await db.softDeleteHetiBeosztas(edzoId, mettol);
    }

    for (let i = 0; i < data.length; i++) {

        const slots = data[i];
        if (!slots.length) continue;

        let start = normalizeTime(slots[0]);
        let prev = normalizeTime(slots[0]);

        for (let j = 1; j < slots.length; j++) {

            const curr = normalizeTime(slots[j]);

            if (curr !== prev) {
                await db.insertHetiBeosztasSingle(i, start, prev, mettol, edzoId);
                start = curr;
            }

            prev = curr;
        }

        await db.insertHetiBeosztasSingle(i, start, prev, mettol, edzoId);
    }

    await db.markInvalidKAAsDeleted(edzoId, mettol);

    res.json({ message: "HB mentve" });
});

/* =========================
   KA TOGGLE
========================= */

router.post("/toggleKA", check.loginCheck,check.edzoCheck, async (req, res) => {

    try {

        const edzoId = req.session.user.id;
        let { datum, ido } = req.body;

        ido = normalizeTime(ido);

        if (!isKAAllowed(datum)) {
            return res.status(400).json({ message: "KA csak 4 hét múlva" });
        }

        const weekday = getWeekday(datum);

        const inHB = await db.isInHB(edzoId, datum, weekday, ido);
        if (!inHB) {
            return res.status(400).json({ message: "Nincs HB-ben" });
        }

        const existing = await db.getKAByExact(edzoId, datum, ido);

        if (!existing) {
            await db.insertKulonlegesAlkalom(datum, ido, "aktiv", edzoId);
            return res.json({ status: "aktiv" });
        }

        if (existing.statusz === "torolt") {
            return res.status(400).json({ message: "Törölt" });
        }

        const newStatus = existing.statusz === "aktiv" ? "inaktiv" : "aktiv";

        await db.updateKAStatus(existing.ka_id, newStatus);

        res.json({ status: newStatus });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "KA hiba" });
    }
});

/* =========================
   BOOKING
========================= */

router.post("/book", check.loginCheck,check.userCheck, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const edzoId = req.body.edzo_id; // 🔥 frontendből jön

        const { activate = {}, deactivate = {} } = req.body;

        // 🔥 saját foglalások egyszer lekérve (performance)
        const myBookings = await db.getMyBookings(userId);

        /* =========================
           ➕ AKTIVÁLÁS
        ========================= */
        for (const datum in activate) {

            if (isWithinAllowedRange(datum)) {

                const weekday = getWeekday(datum);

                for (const idoRaw of activate[datum]) {

                    const ido = normalizeTime(idoRaw);
                    // 1️⃣ HB check
                    const inHB = await db.isInHB(edzoId, datum, weekday, ido);
                    if (inHB) {

                        // 2️⃣ KA check
                        if (await db.isBlockedByKA(edzoId, datum, ido)) {

                            // 3️⃣ 🔴 saját foglalás más edzőnél UGYANEBBEN AZ IDŐBEN
                            const conflict = myBookings.some(f =>
                                f.statusz === "aktiv" &&
                                f.datum === datum &&
                                f.ido === ido &&
                                f.edzo_id !== edzoId
                            );

                            if (!conflict) {

                                // 4️⃣ más user foglalta
                                if (await db.isSlotTakenByOther(datum, ido, userId, edzoId)) continue;

                                // 5️⃣ 🔥 csak ugyanazt a slotot takarítjuk
                                await db.deleteInactiveElsewhereAtSameTime(userId, edzoId, datum, ido);

                                // 6️⃣ insert / update
                                const existing = await db.getOwnBooking(datum, ido, userId, edzoId);

                                if (!existing) {
                                    await db.insertBooking(datum, ido, userId, edzoId);
                                } else {
                                    await db.updateBookingStatus(existing.foglalas_id, "aktiv");
                                }
                            }
                        }
                    }
                }
            }
        }

        /* =========================
           ➖ DEAKTIVÁLÁS
        ========================= */
        for (const datum in deactivate) {

            if (isWithinAllowedRange(datum)) {

                for (const idoRaw of deactivate[datum]) {

                    const ido = normalizeTime(idoRaw);

                    const existing = await db.getOwnBooking(datum, ido, userId, edzoId);

                    if (existing && existing.statusz === "aktiv") {
                        await db.updateBookingStatus(existing.foglalas_id, "inaktiv");
                    }
                }
            }
        }

        res.json({ message: "OK" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Foglalás hiba" });
    }
});

module.exports = router;