import { navbarGeneralas } from './navbar.js';
import { footerGeneralas } from './footer.js';
import { getKeres, postApi } from '../js/kozosFetch.js';

const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

let currentDate = new Date();
let myUserId = null;
let toActivate = [];   // új foglalások
let toDeactivate = []; // lemondások

let calendarData = {
    heti: [],
    kulonleges: [],
    foglalas: [],
    edzo_id: null
};
let myBookings = [];
/* ========================= INIT ========================= */
document.addEventListener("DOMContentLoaded", async () => {
    navbarGeneralas([]);
    footerGeneralas();

    await ensureUser();
    await loadCalendar();
    await loadMyBookings();
    generalWeek();
    initModalEvents();
});

/* ========================= API ========================= */
async function loadCalendar() {
    const res = await getKeres("/api/getCalendar");
    calendarData = res?.result || res;

    console.log("📦 calendar:", calendarData);
}
async function loadMyBookings() {
    myBookings = await getKeres("/api/myBookings");
}
/* ========================= USER ========================= */
async function ensureUser() {
    if (!myUserId) {
        const profil = await getKeres("/api/getLoginStatus");
        myUserId = profil.id;
    }
}

/* ========================= SEGÉD ========================= */
function norm(t) {
    return t?.slice(0, 5);
}

function formatDateISO(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(d) {
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

function getWeekStart(date) {
    let d = new Date(date);
    let day = d.getDay();
    let diff = d.getDate() - (day === 0 ? 6 : day - 1);
    return new Date(d.setDate(diff));
}

function toMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

function isInRange(ido, start, end) {
    return toMinutes(ido) >= toMinutes(start) && toMinutes(end) >= toMinutes(ido);
}

function getTomorrow() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getMondayInFourWeeks() {
    const d = new Date();

    const day = d.getDay();
    const mondayOffset = (day === 0 ? -6 : 1 - day);

    d.setDate(d.getDate() + mondayOffset + 28);
    d.setHours(0, 0, 0, 0);

    return d;
}

function isWithinBookingRange(dateObj) {
    const tomorrow = getTomorrow();
    const limit = getMondayInFourWeeks();

    const d = new Date(dateObj);
    d.setHours(0, 0, 0, 0);

    return d >= tomorrow && d < limit;
}
/* ========================= AKTUÁLIS HB ========================= */
function getActiveHetiForDate(datum) {
    const valid = calendarData.heti.filter(h =>
        h.mettol_ervenyes <= datum
    );

    if (!valid.length) return [];

    const max = valid.reduce((m, h) =>
        h.mettol_ervenyes > m ? h.mettol_ervenyes : m,
        valid[0].mettol_ervenyes
    );

    return valid.filter(h => h.mettol_ervenyes === max);
}

/* ========================= HEADER ========================= */
function createWeekHeader(container, weekStart, redraw) {

    let header = document.createElement("div");
    header.classList.add("naptarFejlec");

    let prev = document.createElement("button");
    prev.innerText = "<";

    let next = document.createElement("button");
    next.innerText = ">";

    let title = document.createElement("span");

    let weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    title.innerText = `${weekStart.getFullYear()} | ${formatDate(weekStart)} - ${formatDate(weekEnd)}`;

    prev.onclick = () => {
        currentDate.setDate(currentDate.getDate() - 7);
        redraw();
    };

    next.onclick = () => {
        currentDate.setDate(currentDate.getDate() + 7);
        redraw();
    };

    header.append(prev, title, next);
    container.appendChild(header);
}
/* ========================= TOOLTIPS ========================= */
function showTooltip(text, x, y) {
    let tip = document.getElementById("slot-tooltip");

    if (!tip) {
        tip = document.createElement("div");
        tip.id = "slot-tooltip";
        document.body.appendChild(tip);
    }

    tip.textContent = text;
    tip.classList.add("visible");
    tip.style.left = `${x + 10}px`;
    tip.style.top = `${y + 10}px`;
}
function hideTooltip() {
    const tip = document.getElementById("slot-tooltip");
    if (tip) {
        tip.classList.remove("visible");
        tip.style.left = "-9999px";
        tip.style.top = "-9999px";
    }
}
/* ========================= FŐ NAPTÁR ========================= */
function generalWeek() {

    const container = document.getElementById("naptar");
    container.innerHTML = "";

    let weekStart = getWeekStart(currentDate);

    createWeekHeader(container, weekStart, generalWeek);

    const grid = document.createElement("div");
    grid.classList.add("week-grid");

    /* ===== FEJLÉC ===== */
    for (let i = 0; i < 7; i++) {
        let d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);

        let cell = document.createElement("div");
        cell.classList.add("cell", "head");
        cell.innerText =
            napok[i] + "\n" +
            (d.getMonth() + 1) + "." +
            d.getDate();

        grid.appendChild(cell);
    }

    /* ===== SLOTOK ===== */
    for (let perc = 0; perc < 1440; perc += 30) {

        const ido = `${String(Math.floor(perc / 60)).padStart(2, "0")}:${String(perc % 60).padStart(2, "0")}`;

        for (let i = 0; i < 7; i++) {

            let d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);

            const datum = formatDateISO(d);

            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.innerText = ido;

            /* ===== SAJÁT FOGLALÁS ===== */
            const sajat = myBookings.find(f =>
                f.statusz === "aktiv" &&
                f.datum.startsWith(datum) &&
                norm(f.ido) === ido
            );

            if (sajat) {
                cell.classList.add("foglaltSajat");

                /* ===== TOOLTIP ===== */
                cell.addEventListener("mouseenter", (e) => {
                    showTooltip(sajat.edzo_nev || "Ismeretlen edző", e.pageX, e.pageY);
                });

                cell.addEventListener("mousemove", (e) => {
                    showTooltip(sajat.edzo_nev || "Ismeretlen edző", e.pageX, e.pageY);
                });

                cell.addEventListener("mouseleave", hideTooltip);
            }

            grid.appendChild(cell);

            /* ===== DEBUG ===== */
            // console.log({
            //     datum,
            //     ido,
            //     sajat
            // });
        }
    }

    const scroll = document.createElement("div");
    scroll.classList.add("week-scroll");
    scroll.appendChild(grid);

    container.appendChild(scroll);
}

/* ========================= MODAL ========================= */
function initModalEvents() {

    document.getElementById("foglalasBtn").onclick = async () => {
        await ensureUser();
        await loadCalendar();

        let toActivate = [];
        let toDeactivate = [];

        document.getElementById("modal").classList.remove("hidden");
        generateModal();
    };

    document.getElementById("closeBtn").onclick = () => {
        document.getElementById("modal").classList.add("hidden");
    };

    document.getElementById("saveBtn").onclick = saveBooking;
}

/* ========================= MODAL GRID ========================= */
function generateModal() {

    const container = document.getElementById("modal-naptar");
    container.innerHTML = "";

    let weekStart = getWeekStart(currentDate);

    createWeekHeader(container, weekStart, generateModal);

    const grid = document.createElement("div");
    grid.classList.add("week-grid");

    for (let i = 0; i < 7; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell", "head");
        cell.innerText = napok[i];
        grid.appendChild(cell);
    }

    for (let perc = 0; perc < 1440; perc += 30) {

        let ido = `${String(Math.floor(perc / 60)).padStart(2, "0")}:${String(perc % 60).padStart(2, "0")}`;

        for (let i = 0; i < 7; i++) {

            let d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            let datum = formatDateISO(d);
            const inRange = isWithinBookingRange(d);

            let key = datum + "|" + ido;

            const activeHeti = getActiveHetiForDate(datum);

            const heti = activeHeti.find(h =>
                h.weekday === i &&
                isInRange(ido, h.start, h.end)
            );

            const ka = calendarData.kulonleges.find(k =>
                k.statusz === "aktiv" &&
                k.datum.startsWith(datum) &&
                norm(k.ido) === ido
            );

            const sajat = calendarData.foglalas.find(f =>
                f.statusz === "aktiv" &&
                f.datum.startsWith(datum) &&
                norm(f.ido) === ido &&
                f.felhasznalo_id === myUserId
            );

            const foglaltMas = calendarData.foglalas.find(f =>
                f.statusz === "aktiv" &&
                f.datum.startsWith(datum) &&
                norm(f.ido) === ido &&
                f.felhasznalo_id !== myUserId
            );

            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.innerText = ido;

            // PRIORITÁS
            if (!inRange) {
                cell.classList.add("elerhetetlen");
            }
            else if (!heti || ka) {
                cell.classList.add("elerhetetlen");
            }
            else if (foglaltMas) {
                cell.classList.add("elerhetetlen");
            }
            else if (sajat) {
                cell.classList.add("foglaltSajat");
                cell.onclick = () => toggleSlot(cell, key, true);  // ha saját
            }
            else {
                cell.classList.add("elerheto");
                cell.onclick = () => toggleSlot(cell, key, false); // ha új
            }

            grid.appendChild(cell);
        }
    }

    container.appendChild(grid);
}

/* ========================= TOGGLE ========================= */
function toggleSlot(cell, key, isAlreadyBooked) {

    const removeAll = () => {
        cell.classList.remove("elerheto", "foglaltSajat");
    };

    if (isAlreadyBooked) {
        // ---- SAJÁT FOGLALÁS → LEMONDÁS ----

        if (toDeactivate.includes(key)) {
            // visszavonás
            toDeactivate = toDeactivate.filter(e => e !== key);
            removeAll();
            cell.classList.add("foglaltSajat");
        } else {
            toDeactivate.push(key);
            removeAll();
            cell.classList.add("elerheto"); // vissza kékbe
        }

    } else {
        // ---- ÚJ FOGLALÁS ----

        if (toActivate.includes(key)) {
            toActivate = toActivate.filter(e => e !== key);
            removeAll();
            cell.classList.add("elerheto");
        } else {
            toActivate.push(key);
            removeAll();
            cell.classList.add("foglaltSajat");
        }
    }

    console.log("ACTIVATE:", toActivate);
    console.log("DEACTIVATE:", toDeactivate);
}

/* ========================= SAVE ========================= */
async function saveBooking() {

    if (!toActivate.length && !toDeactivate.length) {
        alert("Nincs változás");
        return;
    }

    const payload = {
        activate: {},
        deactivate: {},
        edzoID:edzo_id
    };

    toActivate.forEach(e => {
        const [datum, ido] = e.split("|");
        if (!payload.activate[datum]) payload.activate[datum] = [];
        payload.activate[datum].push(ido);
    });

    toDeactivate.forEach(e => {
        const [datum, ido] = e.split("|");
        if (!payload.deactivate[datum]) payload.deactivate[datum] = [];
        payload.deactivate[datum].push(ido);
    });

    console.log("PAYLOAD:", payload);

    await postApi("/api/book", payload);

    document.getElementById("modal").classList.add("hidden");

    await loadCalendar();
    await loadMyBookings();
    generalWeek();
}