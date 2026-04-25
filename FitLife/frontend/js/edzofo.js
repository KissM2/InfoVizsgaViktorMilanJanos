import { getKeres } from "./kozosFetch.js";
import { navbarGeneralas } from './navbar.js';
import { footerGeneralas } from './footer.js';
const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

let currentDate = new Date();

let calendarData = {
    heti: [],
    kulonleges: [],
    foglalas: []
};
const menuLinkek = [
    { nev: "Naptár szerkesztése", url: "/esznt" },
    { nev: "Névjegy szerkesztése", url: "/trainersedit" },
    { nev: "Adatok szerkesztésee", url: "/traineradat" },
];
document.addEventListener("DOMContentLoaded", async function () {
    navbarGeneralas(menuLinkek);
    footerGeneralas();
    loadCalendar();

    const listaKontener = document.getElementById("komment-lista");
    const tobbBtn = document.getElementById("tobb-komment-btn");
    let aktualisKommentek = [];

    const profilAdat = await getKeres("/api/getLoginStatus"); 
    const edzoId = profilAdat.id; 
    if (edzoId) {
        fetchSajatKommentek(edzoId);
    }

    async function fetchSajatKommentek(id) {
        const adatok = await getKeres(`/api/kommentek?edzo_id=${id}`);
        if (adatok && adatok.results) {
            aktualisKommentek = adatok.results;
            renderSajatKommentek();
        }
    }

    function renderSajatKommentek() {
        listaKontener.innerHTML = "";
        const lathatoKommentek = [];
        
        for (let i = 0; i < aktualisKommentek.length; i++) {
            const komment = aktualisKommentek[i];
            if (komment.szoveg && komment.szoveg.trim() !== "") {
                lathatoKommentek.push(komment);
            }
        }
        if (lathatoKommentek.length === 0) {
            listaKontener.innerText = "Még nem érkezett értékelés az edzéseidre.";
            tobbBtn.classList.add("rejtett");
        } else {
            lathatoKommentek.forEach(komment => {
                const kartya = document.createElement("div");
                kartya.className = "komment-kartya";

                const fejlec = document.createElement("div");
                fejlec.className = "komment-kartya-fejlec";

                const nevSpan = document.createElement("span");
                nevSpan.className = "komment-neve";
                nevSpan.textContent = "👤 " + komment.felhasznalo_nev;

                const csillagokSpan = document.createElement("span");
                csillagokSpan.className = "komment-csillagok";
                csillagokSpan.textContent = `⭐ ${komment.ertekeles} / 5`;

                const tartalomDiv = document.createElement("div");
                tartalomDiv.className = "komment-szoveg-tartalom";
                tartalomDiv.textContent = komment.szoveg;

                fejlec.appendChild(nevSpan);
                fejlec.appendChild(csillagokSpan);
                kartya.appendChild(fejlec);
                kartya.appendChild(tartalomDiv);

                listaKontener.appendChild(kartya);
            });

            if (aktualisKommentek.length > 4) {
                tobbBtn.classList.remove("rejtett");
            } else {
                tobbBtn.classList.add("rejtett");
            }
        }
    }

    tobbBtn.addEventListener("click", () => {
        listaKontener.classList.toggle("kibontva");
        tobbBtn.textContent = listaKontener.classList.contains("kibontva") ? "Kevesebb mutatása" : "Összes megtekintése";
    });
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
    return t >= toMinutes(start) && t <= toMinutes(end);
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



//mettol_ervenyes check
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
    let aktStatusz = "nincs";
    // 1. foglalás
    const foglalt = calendarData.foglalas.find(f =>
        f.statusz === "aktiv" &&
        f.datum === datum &&
        isInRange(ido, f.start, f.end)
    );


    // 2. különleges
    const kulonleges = calendarData.kulonleges.find(k =>
        k.statusz === "aktiv" && // 🔥 EZ HIÁNYZOTT
        k.datum === datum &&
        isInRange(ido, k.start, k.end)
    );


    // 3. heti
    const heti = calendarData.heti.find(h =>
        h.weekday === weekdayIndex &&
        isInRange(ido, h.start, h.end) &&
        isValidFrom(dateObj, h.mettol_ervenyes)
    );
    if (foglalt) {
        aktStatusz = "foglalt";
    } else if (kulonleges) {
        aktStatusz = "kulonleges";
    } else if (heti) {
        aktStatusz = "elerheto";
    }

    return aktStatusz;
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