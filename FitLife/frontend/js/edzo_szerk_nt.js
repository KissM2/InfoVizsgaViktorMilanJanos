import { getKeres, postApi } from "./kozosFetch.js";
import { navbarGeneralas } from './navbar.js';

/* ======================= */
let aktualisEv = new Date().getFullYear();
let aktualisHonap = new Date().getMonth() + 1;

let mentettbeo = [[], [], [], [], [], [], []];
let kaLista = [];
let kapottbeo = [];

let selectedDate = formatDate(new Date());

const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
const honapok = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];

const menuLinkek = [
    { nev: "Edző főoldal", url: "/edzofo" },
    { nev: "Névjegy szerkesztés", url: "/trainersedit" }
];

/* ======================= */
document.addEventListener("DOMContentLoaded", async () => {
    navbarGeneralas(menuLinkek);

    genBeo();
    await loadAll();
    general();

    document.getElementById("beoS").onclick = async () => {
        await postApi("/api/insertHB", mentettbeo);
        genBeo();
        await loadAll();
        general();
    };
});

/* ======================= */
async function loadAll() {
    kaLista = await getKeres("/api/getKA");
    kapottbeo = await getKeres("/api/getHB");
    console.log(kaLista)
}

/* ======================= */
function getActiveHetiForDate(datum) {

    const valid = kapottbeo.filter(e =>
        e.mettol_ervenyes.split("T")[0] <= datum
    );

    if (valid.length) {
        const max = valid.reduce((m, h) =>
            h.mettol_ervenyes > m ? h.mettol_ervenyes : m,
            valid[0].mettol_ervenyes
        );

        return valid.filter(h => h.mettol_ervenyes === max);
    } else {
        return [];
    }
}

/* ======================= */
function getMondayInFourWeeks() {
    const d = new Date();
    const day = d.getDay();
    const offset = (day === 0 ? -6 : 1 - day);
    d.setDate(d.getDate() + offset + 28);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isDateAllowed(datum) {
    return parseDate(datum) >= getMondayInFourWeeks();
}

/* ======================= */
function genBeo() {
    mentettbeo = [[], [], [], [], [], [], []];

    const host = document.getElementById('beo');
    host.innerHTML = "";

    const head = document.createElement('div');
    head.classList.add('dt-head');

    const body = document.createElement('div');
    body.classList.add('dt-body');

    host.append(head, body);

    for (let i = 0; i < 7; i++) {

        let h = document.createElement('div');
        h.innerText = napok[i];
        h.classList.add("nap", "fejlec");
        head.appendChild(h);

        let col = document.createElement('div');
        col.classList.add("dtc");

        for (let p = 0; p < 1440; p += 30) {

            let ido = percToTime(p);

            let c = document.createElement('div');
            c.innerText = ido;
            c.classList.add('nap');

            c.onclick = () => {
                if (c.classList.toggle("bb")) {
                    mentettbeo[i].push(ido);
                } else {
                    mentettbeo[i] = mentettbeo[i].filter(e => e !== ido);
                }
            };

            col.appendChild(c);
        }

        body.appendChild(col);
    }
}

/* ======================= */
function naptarGeneral(ev, honap) {

    let first = new Date(ev, honap - 1, 1);
    let start = first.getDay(); if (start === 0) start = 7;

    let days = new Date(ev, honap, 0).getDate();
    let weeks = Math.ceil((start - 1 + days) / 7);

    let n = 1;
    let root = document.createElement("div");

    let head = document.createElement("div");
    head.classList.add("het");

    napok.forEach(nap => {
        let d = document.createElement("div");
        d.classList.add("nap", "fejlec");
        d.innerText = nap;
        head.appendChild(d);
    });

    root.appendChild(head);

    for (let i = 0; i < weeks; i++) {

        let row = document.createElement("div");
        row.classList.add("het");

        for (let j = 0; j < 7; j++) {

            let cell = document.createElement("div");
            cell.classList.add("nap");

            if (i * 7 + j + 1 >= start && n <= days) {

                let dateObj = new Date(ev, honap - 1, n);
                let datum = formatDate(dateObj);

                cell.innerText = n;

                const weekday = getWeekday(datum);
                const hb = getActiveHetiForDate(datum);

                // 🔵 HB
                if (hb.some(e => e.weekday === weekday)) {
                    cell.classList.add("bb");
                }

                // 🔴 KA
                if (kaLista.some(e =>
                    e.statusz === "aktiv" && sameDate(e.datum, datum)
                )) {
                    cell.classList.remove("bb");
                    cell.classList.add("rr");
                }

                cell.onclick = () => openDay(datum);

                n++;
            } else {
                cell.classList.add("noDay");
            }

            row.appendChild(cell);
        }

        root.appendChild(row);
    }

    return root;
}

/* ======================= */
function openDay(datum) {

    selectedDate = datum;

    const host = document.getElementById("naptargombok");
    host.innerHTML = "";

    document.getElementById("napgombokfejlec").innerText = datum;

    const weekday = getWeekday(datum);
    const hb = getActiveHetiForDate(datum);
    const allowed = isDateAllowed(datum);

    for (let p = 0; p < 1440; p += 30) {

        const ido = percToTime(p);
        const btn = document.createElement("button");
        btn.innerText = ido;

        const inHB = hb.some(e =>
            e.weekday === weekday &&
            toMinutes(ido) >= toMinutes(e.start) &&
            toMinutes(ido) <= toMinutes(e.end)
        );

        // reset
        btn.classList.remove("bb", "rr");

        // 🔴 KA elsőbbség
        if (kaLista.some(e =>
            e.statusz === "aktiv" &&
            sameDate(e.datum, datum) &&
            e.ido === ido
        )) {
            btn.classList.add("rr");
        }
        else if (inHB) {
            btn.classList.add("bb");
        }

        btn.disabled = !inHB || !allowed;

        btn.onclick = async () => {

            if (!btn.disabled) {

                await postApi("/api/toggleKA", { datum, ido });

                await loadAll();

                general(); // 🔥 teljes újrarender
            }
        };

        host.appendChild(btn);
    }
}

/* ======================= */
function general() {

    const cont = document.getElementById("naptar");
    cont.innerHTML = "";

    let head = document.createElement("div");
    head.classList.add("naptarFejlec");

    let l = document.createElement("button");
    l.innerText = "<";

    let t = document.createElement("span");
    t.innerText = aktualisEv + " " + honapok[aktualisHonap - 1];

    let r = document.createElement("button");
    r.innerText = ">";

    head.append(l, t, r);

    cont.append(head);
    cont.append(naptarGeneral(aktualisEv, aktualisHonap));

    openDay(selectedDate);

    l.onclick = () => {
        aktualisHonap--;
        if (aktualisHonap < 1) { aktualisHonap = 12; aktualisEv--; }
        general();
    };

    r.onclick = () => {
        aktualisHonap++;
        if (aktualisHonap > 12) { aktualisHonap = 1; aktualisEv++; }
        general();
    };
}

/* ======================= */
function formatDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDate(d) {
    const [y, m, day] = d.split("-");
    return new Date(y, m - 1, day);
}

function percToTime(p) {
    return `${String(Math.floor(p / 60)).padStart(2, "0")}:${String(p % 60).padStart(2, "0")}`;
}

function toMinutes(t) {
    const [h, m] = t.split(":");
    return Number(h) * 60 + Number(m);
}

function sameDate(dbDate, datum) {
    return dbDate.startsWith(datum);
}

function getWeekday(d) {
    const day = parseDate(d).getDay();
    return day === 0 ? 6 : day - 1;
}