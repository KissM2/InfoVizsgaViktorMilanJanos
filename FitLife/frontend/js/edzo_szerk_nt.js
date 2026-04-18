import { getKeres, postApi } from "./kozosFetch.js";

let aktualisEv = new Date().getFullYear();
let aktualisHonap = new Date().getMonth() + 1;

let mentettbeo = [[], [], [], [], [], [], []];

let kaLista = [];
let kapottbeo = [];
let selectedDate = formatDate(new Date());
const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

const honapok = [
    "Január", "Február", "Március", "Április", "Május", "Június",
    "Július", "Augusztus", "Szeptember", "Október", "November", "December"
];

document.addEventListener("DOMContentLoaded", async function () {
    genBeo();
    await loadAll();
    general();

    document.getElementById("beoS").addEventListener("click", async function () {
        await postApi("/api/insertHB", mentettbeo);
        location.reload();
    });
});

// =======================
// ADAT BETÖLTÉS
// =======================
async function loadAll() {
    kaLista = await getKeres("/api/getKA");
    kapottbeo = await getKeres("/api/getHB");
}

// =======================
// HETI BEOSZTÁS
// =======================
function genBeo() {

    mentettbeo = [[], [], [], [], [], [], []];

    const host = document.getElementById('beo');
    host.innerHTML = "";

    const fejlecSor = document.createElement('div');
    fejlecSor.classList.add('dt-head');

    const tartalom = document.createElement('div');
    tartalom.classList.add('dt-body');

    host.appendChild(fejlecSor);
    host.appendChild(tartalom);

    for (let i = 0; i < napok.length; i++) {

        let fej = document.createElement('div');
        fej.innerText = napok[i];
        fej.classList.add("nap", "fejlec");
        fejlecSor.appendChild(fej);

        let oszlop = document.createElement('div');
        oszlop.classList.add("dtc");

        for (let perc = 0; perc < 1440; perc += 30) {

            let ido = percToTime(perc);

            let cell = document.createElement('div');
            cell.innerText = ido;
            cell.classList.add('nap');

            cell.dataset.bek = 0;
            cell.dataset.di = i;

            cell.addEventListener("click", function () {

                const napIndex = Number(cell.dataset.di);

                if (cell.dataset.bek == 0) {
                    cell.classList.add("bb");
                    cell.dataset.bek = 1;

                    if (!mentettbeo[napIndex].includes(ido)) {
                        mentettbeo[napIndex].push(ido);
                    }

                } else {
                    cell.classList.remove("bb");
                    cell.dataset.bek = 0;

                    mentettbeo[napIndex] =
                        mentettbeo[napIndex].filter(e => e !== ido);
                }
            });

            oszlop.appendChild(cell);
        }

        tartalom.appendChild(oszlop);
    }
}

// =======================
// NAPTÁR
// =======================
function naptarGeneral(ev, honap) {

    let hoEleje = new Date(ev, honap - 1, 1);
    let hetnapja = hoEleje.getDay();
    if (hetnapja == 0) hetnapja = 7;

    let napszam = new Date(ev, honap, 0).getDate();
    let hetek = Math.ceil((hetnapja - 1 + napszam) / 7);

    let naptarinap = 1;
    let naptar = document.createElement("div");

    let napSor = document.createElement("div");
    napSor.classList.add("het");

    for (let n of napok) {
        let d = document.createElement("div");
        d.classList.add("nap", "fejlec");
        d.innerText = n;
        napSor.appendChild(d);
    }

    naptar.appendChild(napSor);

    for (let i = 0; i < hetek; i++) {

        let het = document.createElement("div");
        het.classList.add("het");

        for (let j = 0; j < 7; j++) {

            let nap = document.createElement("div");
            nap.classList.add("nap");

            if (i * 7 + j + 1 >= hetnapja && naptarinap <= napszam) {

                let currentDate = new Date(ev, honap - 1, naptarinap);
                let datum = formatDate(currentDate);

                nap.innerText = naptarinap;

                const weekday = getWeekday(datum);

                // beosztás jelölés
                if (kapottbeo.some(e => {
                    const beoStart = new Date(e.mettol_ervenyes.split("T")[0]);
                    return e.weekday === weekday && new Date(datum) >= beoStart;
                })) {
                    nap.classList.add("bb");
                }

                // KA jelölés (csak aktiv)
                if (kaLista.some(e =>
                    e.statusz === "aktiv" &&
                    sameDate(e.datum, datum)
                )) {
                    nap.classList.add("rr");
                }

                nap.addEventListener("click", function () {
                    openDay(datum);
                });

                naptarinap++;
            }
            else {
                nap.classList.add("noDay");
            }

            het.appendChild(nap);
        }

        naptar.appendChild(het);
    }

    return naptar;
}

// =======================
// NAP
// =======================
function openDay(datum) {
    selectedDate = datum;
    const host = document.getElementById("naptargombok");
    host.innerHTML = "";

    // dátum kiírás
    const d = new Date(datum);
    document.getElementById("napgombokfejlec").innerText =
        d.getFullYear() + ". " +
        (d.getMonth() + 1) + ". " +
        d.getDate() + ".";

    const weekday = getWeekday(datum);

    for (let perc = 0; perc < 1440; perc += 30) {

        const ido = percToTime(perc);
        const btn = document.createElement("button");
        btn.innerText = ido;

        // ===== BEOSZTÁS =====
        const benneVan = kapottbeo.some(e => {

            const beoStart = new Date(e.mettol_ervenyes.split("T")[0]);

            return (
                e.weekday === weekday &&
                new Date(datum) >= beoStart &&
                toMinutes(ido) >= toMinutes(e.start) &&
                toMinutes(ido) <= toMinutes(e.end)
            );
        });

        btn.disabled = !benneVan;

        // ===== KA (csak aktiv) =====
        const ka = kaLista.find(e =>
            e.statusz === "aktiv" &&
            sameDate(e.datum, datum) &&
            toMinutes(ido) >= toMinutes(e.start) &&
            toMinutes(ido) <= toMinutes(e.end)
        );

        if (ka) {
            btn.classList.add("rr");
        }

        btn.addEventListener("click", async () => {

            if (btn.disabled) return;

            const res = await postApi("/api/toggleKA", {
                datum,
                start: ido,
                end: ido
            });

            if (res?.message) alert(res.message);

            await loadAll();
            general();
        });

        host.appendChild(btn);
    }
}

// =======================
// NAVIGÁCIÓ
// =======================
function general() {

    let kontener = document.getElementById("naptar");
    kontener.innerHTML = "";

    let fejlec = document.createElement("div");
    fejlec.classList.add("naptarFejlec");

    let bal = document.createElement("button");
    bal.innerText = "<";

    let cim = document.createElement("span");
    cim.innerText = aktualisEv + " " + honapok[aktualisHonap - 1];

    let jobb = document.createElement("button");
    jobb.innerText = ">";

    fejlec.appendChild(bal);
    fejlec.appendChild(cim);
    fejlec.appendChild(jobb);

    kontener.appendChild(fejlec);
    kontener.appendChild(naptarGeneral(aktualisEv, aktualisHonap));

    openDay(selectedDate);

    bal.addEventListener("click", function () {
        aktualisHonap--;
        if (aktualisHonap < 1) {
            aktualisHonap = 12;
            aktualisEv--;
        }
        general();
    });

    jobb.addEventListener("click", function () {
        aktualisHonap++;
        if (aktualisHonap > 12) {
            aktualisHonap = 1;
            aktualisEv++;
        }
        general();
    });
}

// =======================
// SEGÉDEK
// =======================
function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function percToTime(p) {
    const h = String(Math.floor(p / 60)).padStart(2, "0");
    const m = String(p % 60).padStart(2, "0");
    return `${h}:${m}`;
}

function toMinutes(t) {
    const [h, m] = t.split(":");
    return Number(h) * 60 + Number(m);
}

function sameDate(dbDate, datum) {
    return dbDate.startsWith(datum);
}

function getWeekday(datum) {
    const d = new Date(datum).getDay();
    return d === 0 ? 6 : d - 1;
}