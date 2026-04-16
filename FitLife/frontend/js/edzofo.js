import { getKeres } from "./kozosFetch.js";

const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

let currentDate = new Date();

let calendarData = {
    heti: [],
    kulonleges: [],
    foglalas: []
};

document.addEventListener("DOMContentLoaded", function () {
    loadCalendar();
});

/* =========================
   API BETÖLTÉS
========================= */
async function loadCalendar() {
    const res = await getKeres("/api/getCalendar");

    if (res?.result) {
        calendarData = res.result;
    } else if (res) {
        calendarData = res;
    }

    // 🔥 weekday string → number
    calendarData.heti = calendarData.heti.map(h => ({
        ...h,
        weekday: Number(h.weekday)
    }));

    console.log("Calendar data:", calendarData);

    generalWeek();
}

/* =========================
   SEGÉDFÜGGVÉNYEK
========================= */

// idő → perc (kezeli: HH:MM és HH:MM:SS)
function toMinutes(t) {
    const [h = 0, m = 0] = t.trim().split(":").map(Number);
    return h * 60 + m;
}

// idő tartomány
function isInRange(time, start, end) {
    const t = toMinutes(time);
    return t >= toMinutes(start) && t < toMinutes(end);
}

// helyi dátum → YYYY-MM-DD
function formatDateISO(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// szép dátum
function formatDate(d) {
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

// hét kezdete (hétfő)
function getWeekStart(date) {
    let d = new Date(date);
    let day = d.getDay();
    let diff = d.getDate() - (day === 0 ? 6 : day - 1);
    return new Date(d.setDate(diff));
}

// dátum egységesítés
function normalizeDate(d) {
    return d.replaceAll(".", "-");
}

// 🔥 mettol_ervenyes check
function isValidFrom(dateObj, mettol) {
    if (!mettol) return true;

    const from = new Date(mettol);
    return dateObj >= from;
}

/* =========================
   CELLA ÁLLAPOT
========================= */

function getCellStatus(dateObj, ido, weekdayIndex) {
    const datum = formatDateISO(dateObj);

    // 1. foglalás
    const foglalt = calendarData.foglalas.find(f =>
        normalizeDate(f.datum) === datum &&
        isInRange(ido, f.start, f.end)
    );
    if (foglalt) return "foglalt";

    // 2. különleges
    const kulonleges = calendarData.kulonleges.find(k =>
        normalizeDate(k.datum) === datum &&
        isInRange(ido, k.start, k.end)
    );
    if (kulonleges) return "kulonleges";

    // 3. heti
    const heti = calendarData.heti.find(h =>
        h.weekday === weekdayIndex &&
        isInRange(ido, h.start, h.end) &&
        isValidFrom(dateObj, h.mettol_ervenyes)
    );
    if (heti) return "elerheto";

    return "nincs";
}

/* =========================
   NAPTÁR GENERÁLÁS
========================= */

function generalWeek() {
    const container = document.getElementById("naptar");
    container.innerHTML = "";

    let weekStart = getWeekStart(currentDate);

    /* ===== FEJLÉC ===== */
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

    header.appendChild(prev);
    header.appendChild(title);
    header.appendChild(next);

    container.appendChild(header);

    /* ===== GRID ===== */
    const grid = document.createElement("div");
    grid.classList.add("week-grid");

    /* ===== NAP FEJLÉC ===== */
    for (let i = 0; i < 7; i++) {
        let d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);

        let cell = document.createElement("div");
        cell.classList.add("cell", "head");
        cell.innerText = napok[i] + "\n" + (d.getMonth() + 1) + "." + d.getDate();

        grid.appendChild(cell);
    }

    /* ===== IDŐK ===== */
    for (let perc = 0; perc < 24 * 60; perc += 30) {

        let ora = Math.floor(perc / 60);
        let p = perc % 60;
        let ido = `${String(ora).padStart(2, "0")}:${String(p).padStart(2, "0")}`;

        for (let i = 0; i < 7; i++) {

            let d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);

            let status = getCellStatus(d, ido, i);

            let cell = document.createElement("div");
            cell.classList.add("cell");

            if (status === "foglalt") cell.classList.add("foglalt");
            else if (status === "kulonleges") cell.classList.add("kulonleges");
            else if (status === "elerheto") cell.classList.add("elerheto");

            cell.innerText = ido;

            grid.appendChild(cell);
        }
    }

    const scroll = document.createElement("div");
    scroll.classList.add("week-scroll");
    scroll.appendChild(grid);

    container.appendChild(scroll);

    /* ===== NAVIGÁCIÓ ===== */
    prev.onclick = () => {
        currentDate.setDate(currentDate.getDate() - 7);
        generalWeek();
    };

    next.onclick = () => {
        currentDate.setDate(currentDate.getDate() + 7);
        generalWeek();
    };
}