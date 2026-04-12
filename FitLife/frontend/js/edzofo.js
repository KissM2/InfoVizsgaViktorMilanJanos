import { postKeres } from "./kozosFetch.js";

const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

let currentDate = new Date();

let calendarData = {
    heti: [],
    kulonleges: [],
    foglalas: []
};

/* =========================
   API BETÖLTÉS
========================= */
async function loadCalendar() {
    const formData = new FormData();

    const res = await postKeres("/getCalendar", formData);

    if (res && res.result) {
        calendarData = res.result;
    }

    generalWeek();
}

document.addEventListener("DOMContentLoaded", function () {
    loadCalendar();
});

/* =========================
   SEGÉDFÜGGVÉNYEK
========================= */

// "HH:MM" -> perc
function toMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

// idő benne van-e egy tartományban
function isInRange(time, start, end) {
    const t = toMinutes(time);
    return t >= toMinutes(start) && t <= toMinutes(end);
}

// Date -> YYYY-MM-DD
function formatDateISO(d) {
    return d.toISOString().split("T")[0];
}

// Date -> szép formátum
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

/* =========================
   CELLA ÁLLAPOT
========================= */

function getCellStatus(dateObj, ido, weekdayIndex) {
    const datum = formatDateISO(dateObj);

    // 1. foglalás (legerősebb)
    const foglalt = calendarData.foglalas.find(f =>
        f.datum === datum && isInRange(ido, f.start, f.end)
    );
    if (foglalt) return "foglalt";

    // 2. különleges alkalom
    const kulonleges = calendarData.kulonleges.find(k =>
        k.datum === datum && isInRange(ido, k.start, k.end)
    );
    if (kulonleges) return "kulonleges";

    // 3. heti beosztás
    const heti = calendarData.heti.find(h =>
        h.weekday === weekdayIndex && isInRange(ido, h.start, h.end)
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

        for (let i = 0; i < 7; i++) {

            let ora = Math.floor(perc / 60);
            let p = perc % 60;

            let ido = `${String(ora).padStart(2, "0")}:${String(p).padStart(2, "0")}`;

            let d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);

            let status = getCellStatus(d, ido, i);

            let cell = document.createElement("div");
            cell.classList.add("cell");

            if (status === "foglalt") cell.classList.add("foglalt");
            else if (status === "kulonleges") cell.classList.add("kulonleges");
            else if (status === "elerheto") cell.classList.add("elerheto");
            else cell.classList.add("nincs");

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