import { letrehozEdzoProfil } from '../js/edzoProfil.js';
import { navbarGeneralas } from './navbar.js';
import { footerGeneralas } from './footer.js';
import { getKeres, postApi } from '../js/kozosFetch.js';
const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

let currentDate = new Date();

let foglalasok = [];
let toggledSlots = [];
let myUserId = null;
const menuLinkek = [
    { nev: "Személyi edzők", url: "../html/osszesEdzo.html" },
    { nev: "Receptek", url: "../html/etrendek.html" },
    { nev: "Edzéstervek", url: "../html/edzesterv.html" }
];
document.addEventListener("DOMContentLoaded", async () => {
    const listaKontener = document.getElementById("komment-lista");
    const tobbBtn = document.getElementById("tobb-komment-btn");
    const urlapNyitoBtn = document.getElementById("uj-komment-nyito-btn");
    const urlapKontener = document.getElementById("komment-urlap-tarolo");
    const kuldesBtn = document.getElementById("komment-kuldes-btn");
    const hibaDiv = document.getElementById("komment-hiba-uzenet");
    navbarGeneralas(menuLinkek);
    footerGeneralas();
    const urlParams = new URLSearchParams(window.location.search);
    const edzoId = urlParams.get('id');
    if (edzoId) {
        const valasz = await getKeres("/api/edzoProfil?id=" + edzoId);
        if (valasz && valasz.results) {
            const adat = valasz.results;
            const atlag = adat.ertekeles_atlag ? parseFloat(adat.ertekeles_atlag).toFixed(1) + " / 5⭐" : " Nincs még értékelés";
            const formataltAdat = {
                nev: adat.felh_nev,
                kep: "../images/" + adat.kep,
                idezet: adat.idezet,
                leiras: adat.leiras,
                eredmenyek: [
                    "Szakértő tréner",
                    "Email:" + adat.email,
                    "Telefon:" + adat.telszam,
                    "Átlagos értékelés:" + atlag
                ]
            };
            letrehozEdzoProfil("edzo", formataltAdat);
            await generalWeek();
            initModalEvents();
        }
        else {
            document.body.innerHTML = "<h1 class='text-center mt-5'>Edző nem található!</h1>";
        }
    }
    else {
        console.log("Hiányzik az edző ID az URL-ből.");
    }
    let aktualisKommentek = [];
    async function fetchKommentek() {
        const adatok = await getKeres(`/api/kommentek?edzo_id=${edzoId}`);
        if (adatok && adatok.results) {
            aktualisKommentek = adatok.results;
            renderKommentek();
        }
    }
    //komment resz letrehozasa
    function renderKommentek() {
        listaKontener.innerHTML = "";
        const lathatoKommentek = [];
        for (let i = 0; i < aktualisKommentek.length; i++) {
            const komment = aktualisKommentek[i];
            if (komment.szoveg && komment.szoveg.trim() !== "") {
                lathatoKommentek.push(komment);
            }
        }
        if (lathatoKommentek.length === 0) {
            listaKontener.innerText = "Még nincsenek értékelések. Legyél te az első!";
            tobbBtn.classList.add("rejtett");
        }
        else {
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
            }
            else {
                tobbBtn.classList.add("rejtett");
            }
        }

    }
    //osszes gomb funkcio
    tobbBtn.addEventListener("click", () => {
        listaKontener.classList.toggle("kibontva");//kapcsolo kattintasra megnézi hogy van e rajta kibontva osztaly ha nincs rárakja ha van leveszi
        tobbBtn.textContent = listaKontener.classList.contains("kibontva") ? "Kevesebb mutatása" : "Összes megtekintése";
    });
    //ertekeles irasa gomb
    urlapNyitoBtn.addEventListener("click", () => {
        urlapKontener.classList.toggle("rejtett");
    });
    //uj komment irasa:
    kuldesBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const szovegInput = document.getElementById("uj-komment-szoveg").value.trim();
        const ertekelesInput = parseInt(document.getElementById("uj-komment-ertekeles").value);
        try {
            const eredmeny = await postApi('/api/kommentek', {
                szoveg: szovegInput,
                ertekeles: ertekelesInput,
                edzo_id: edzoId
            });
            document.getElementById("uj-komment-szoveg").value = "";
            urlapKontener.classList.add("rejtett");
            hibaDiv.textContent = "";
            fetchKommentek();

        } catch (hiba) {
            hibaDiv.textContent = "Szerver hiba a küldéskor.";
        }
    });
    fetchKommentek();
});
/* =========================
   MODAL EVENTEK
========================= */

function initModalEvents() {
    if (await ensureUser()) {
        document.getElementById("foglalasBtn").onclick = async () => {

            toggledSlots = [];

            document.getElementById("modal").classList.remove("hidden");
            generateModal();
        };

        document.getElementById("closeBtn").onclick = () => {
            document.getElementById("modal").classList.add("hidden");
        };

        document.getElementById("saveBtn").onclick = saveBooking;
    }
}

/* =========================
   USER
========================= */

async function loadUser() {
    try {
        const profil = await getKeres("/api/getLoginStatus");
        myUserId = profil.id;
    } catch { }
}

async function ensureUser() {
    let vanE = true;
    if (!myUserId) {
        try {
            const profil = await getKeres("/api/getLoginStatus");
            myUserId = profil.id;
        } catch {
            vanE = false;
            alert("Nem vagy bejelentkezve");
        }
    }
    return vanE;
}

/* =========================
   API
========================= */

async function loadBookings() {
    foglalasok = await getKeres("/api/myBookings");
}

/* =========================
   SEGÉD
========================= */

function formatDateISO(d) {
    return d.toISOString().split("T")[0];
}

function getWeekStart(date) {
    let d = new Date(date);
    let day = d.getDay();
    let diff = d.getDate() - (day === 0 ? 6 : day - 1);
    return new Date(d.setDate(diff));
}

function formatDate(d) {
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

/* =========================
   FOGLALÁS CHECK
========================= */

function isBooked(dateObj, ido) {
    const datum = formatDateISO(dateObj);

    return foglalasok.some(f =>
        f.datum === datum &&
        f.ido === ido &&
        f.statusz === "aktiv"
    );
}

/* =========================
   FŐ NAPTÁR
========================= */

async function generalWeek() {

    await loadBookings();

    const container = document.getElementById("naptar");
    container.innerHTML = "";

    let weekStart = getWeekStart(currentDate);

    let header = document.createElement("div");
    header.classList.add("naptarFejlec");

    let prev = document.createElement("button");
    prev.innerText = "<";

    let next = document.createElement("button");
    next.innerText = ">";

    let title = document.createElement("span");

    let weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    title.innerText = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;

    header.append(prev, title, next);
    container.appendChild(header);

    const grid = document.createElement("div");
    grid.classList.add("week-grid");

    for (let i = 0; i < 7; i++) {
        let d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);

        let cell = document.createElement("div");
        cell.classList.add("cell", "head");
        cell.innerText = napok[i] + "\n" + (d.getMonth() + 1) + "." + d.getDate();

        grid.appendChild(cell);
    }

    for (let perc = 0; perc < 1440; perc += 30) {

        let ido = `${String(Math.floor(perc / 60)).padStart(2, "0")}:${String(perc % 60).padStart(2, "0")}`;

        for (let i = 0; i < 7; i++) {

            let d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);

            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.innerText = ido;

            if (isBooked(d, ido)) {
                cell.classList.add("foglaltSajat");
            }

            grid.appendChild(cell);
        }
    }

    const scroll = document.createElement("div");
    scroll.classList.add("week-scroll");
    scroll.appendChild(grid);

    container.appendChild(scroll);

    prev.onclick = () => {
        currentDate.setDate(currentDate.getDate() - 7);
        generalWeek();
    };

    next.onclick = () => {
        currentDate.setDate(currentDate.getDate() + 7);
        generalWeek();
    };
}

/* =========================
   MODAL NAPTÁR
========================= */

function generateModal() {

    const container = document.getElementById("modal-naptar");
    container.innerHTML = "";

    let weekStart = getWeekStart(new Date());

    const grid = document.createElement("div");
    grid.classList.add("week-grid");

    for (let i = 0; i < 7; i++) {
        let d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);

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
            let key = datum + "|" + ido;

            let cell = document.createElement("div");
            cell.classList.add("cell", "elerheto");
            cell.innerText = ido;

            if (isBooked(d, ido)) {
                cell.classList.add("foglaltSajat");
            }

            cell.addEventListener("click", () => {
                toggleSlot(cell, key);
            });

            grid.appendChild(cell);
        }
    }

    container.appendChild(grid);
}

/* =========================
   TOGGLE
========================= */

function toggleSlot(cell, key) {

    if (cell.classList.contains("foglaltSajat")) {
        cell.classList.remove("foglaltSajat");
    } else {
        cell.classList.add("foglaltSajat");
    }

    if (toggledSlots.includes(key)) {
        toggledSlots = toggledSlots.filter(e => e !== key);
    } else {
        toggledSlots.push(key);
    }
}

/* =========================
   SAVE
========================= */

async function saveBooking() {

    if (toggledSlots.length === 0) {
        alert("Nincs változás");
        
    }
    else{
    const payload = {};

    toggledSlots.forEach(e => {
        const [datum, ido] = e.split("|");

        if (!payload[datum]) payload[datum] = [];
        payload[datum].push(ido);
    });

    try {
        const res = await postApi("/api/book", payload);
        if (res?.message) alert(res.message);
    } catch {
        alert("Hiba mentéskor");
    }

    toggledSlots = [];

    document.getElementById("modal").classList.add("hidden");

    await generalWeek();
    }
}