import { getKeres, postApi } from '../js/kozosFetch.js';
import { navbarGeneralas } from './navbar.js';
import { footerGeneralas } from './footer.js';

const menuLinkek = [
    { nev: "Személyi edzők", url: "../html/osszesEdzo.html" },
    { nev: "Receptek", url: "../html/etrendek.html" }
];
let gyakorlatok = [];
let hetiTervAjanlas = {};
let bejelentkezettUserId = null;

document.addEventListener("DOMContentLoaded", async function () {
    const loginStatus = await getKeres('/api/getLoginStatus');
    if (loginStatus && loginStatus.id) {
        bejelentkezettUserId = loginStatus.id;
    }
    else {
        alert("Az edzéstervhez be kell jelentkezned!");
    }
    const adatok = await getKeres('/api/gyakorlatok');
    if (adatok) {
        gyakorlatok = adatok;
        vezerloSavKeszites();
        alapTablaGeneralas();
    }
    const generaltAdatok = await getKeres(`/api/generalt-gyakorlatok?id=${bejelentkezettUserId}`);
    if (generaltAdatok) {
        hetiTervAjanlas = generaltAdatok;
    }
    navbarGeneralas(menuLinkek);
    footerGeneralas();
});

function vezerloSavKeszites() {
    const teljes = document.getElementById("teljes");
    const sav = document.createElement("div");
    sav.classList.add("vezerlo-sav");
    const ujHetBtn = document.createElement("button");
    ujHetBtn.textContent = "Új hét (Üres tábla)";
    ujHetBtn.addEventListener("click", function () { alapTablaGeneralas(); });
    sav.appendChild(ujHetBtn);
    teljes.appendChild(sav);
}
function ujSorHozzaadasa(szuloTabla) {
    const tbody = szuloTabla.querySelector("tbody");
    const jelenlegiSorok = tbody.querySelectorAll("tr").length;
    const tr = document.createElement("tr");
    const tdSorszam = document.createElement("td");
    tdSorszam.textContent = (jelenlegiSorok + 1) + ".";
    tr.appendChild(tdSorszam);
    for (let j = 0; j < 7; j++) {
        const td = document.createElement("td");
        td.classList.add("kaja-cella");
        td.dataset.nap = j;
        td.dataset.sorszam = jelenlegiSorok;
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
}
function alapTablaGeneralas() {
    const teljes = document.getElementById("teljes");
    const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
    const hetiResz = document.createElement("div");
    hetiResz.classList.add("heti-resz");
    const hetFejlec = document.createElement("div");
    hetFejlec.classList.add("het-fejlec");
    const h3 = document.createElement("h3");
    h3.textContent = "Heti edzésterv";
    const vezerloGombok = document.createElement("div");
    vezerloGombok.classList.add("het-vezerlok");
    const genBtn = document.createElement("button");
    genBtn.textContent = "Hét generálása";

    const mentesBtn = document.createElement("button");
    mentesBtn.textContent = "Mentés";
    mentesBtn.classList.add("btn-mentes-het");

    const torolBtn = document.createElement("button");
    torolBtn.textContent = "Hét eltávolítása";
    torolBtn.classList.add("btn-torol-het");
    vezerloGombok.appendChild(genBtn);
    vezerloGombok.appendChild(mentesBtn);
    vezerloGombok.appendChild(torolBtn);
    hetFejlec.appendChild(h3);
    hetFejlec.appendChild(vezerloGombok);
    hetiResz.appendChild(hetFejlec);

    const container = document.createElement("div");
    container.classList.add("tabla-container");
    const table = document.createElement("table");
    table.classList.add("tabla");
    torolBtn.addEventListener("click", function () { hetiResz.remove(); });
    mentesBtn.addEventListener("click", function () { edzestervMentes(table); });

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    const thUres = document.createElement("th");
    trHead.appendChild(thUres);
    for (let i = 0; i < napok.length; i++) {
        const th = document.createElement("th");
        const napKozpont = document.createElement("div");
        const eroNap = document.createElement("strong");
        eroNap.textContent = napok[i];
        napKozpont.appendChild(eroNap);
        th.appendChild(napKozpont);

        const gombSav = document.createElement("div");
        gombSav.classList.add("napi-gombok");
        const tBtn = document.createElement("button");
        tBtn.textContent = "Törlés";
        tBtn.addEventListener("click", function () { napTorlese(i, table); });
        const uBtn = document.createElement("button");
        uBtn.textContent = "Új felvétel";
        uBtn.addEventListener("click", function () { napiUjFelvetel(i, table); });
        gombSav.appendChild(tBtn);
        gombSav.appendChild(uBtn);
        th.appendChild(gombSav);
        trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    ujSorHozzaadasa(table);
    genBtn.addEventListener("click", function () { edzestervFeltoltes(table); });
    container.appendChild(table);
    hetiResz.appendChild(container);
    teljes.appendChild(hetiResz);
}
async function edzestervMentes(szuloTabla) {
    const mentesAdatok = [];
    for (let nap = 0; nap < 7; nap++) {
        const napiCellak = szuloTabla.querySelectorAll(`.kaja-cella[data-nap='${nap}']`);
        let napiSorrend = 1;
        napiCellak.forEach(td => {
            const kartya = td.querySelector(".kaja-kartya");

            if (kartya && kartya.dataset.gyakorlatId && bejelentkezettUserId) {
                mentesAdatok.push({
                    nap: nap + 1,
                    gyakorlat_id: parseInt(kartya.dataset.gyakorlatId),
                    sorrend: napiSorrend,
                    userId: bejelentkezettUserId
                });
                napiSorrend++;
            }
        });
    }
    await postApi('/api/mentes-edzesterv', { adatok: mentesAdatok });
    alert("Edzésterv elmentve!");
}
function edzestervFeltoltes(szuloTabla) {
    const cellak = szuloTabla.querySelectorAll(".kaja-cella");
    for (let i = 0; i < cellak.length; i++) {
        cellak[i].innerHTML = "";
    }
    for (const dbNap in hetiTervAjanlas) {
        let napiGyakorlatok = hetiTervAjanlas[dbNap];
        let frontendNap = parseInt(dbNap) - 1;
        for (let sorszam = 0; sorszam < napiGyakorlatok.length; sorszam++) {
            let td = szuloTabla.querySelector(".kaja-cella[data-nap='" + frontendNap + "'][data-sorszam='" + sorszam + "']");
            if (!td) {
                ujSorHozzaadasa(szuloTabla);
                td = szuloTabla.querySelector(".kaja-cella[data-nap='" + frontendNap + "'][data-sorszam='" + sorszam + "']");
            }
            const aktGyakorlat = napiGyakorlatok[sorszam];
            td.appendChild(gyakorlatKartyaKeszites(aktGyakorlat));
        }
    }
}
function napiUjFelvetel(napIndex, szuloTabla) {
    const cellak = szuloTabla.querySelectorAll(".kaja-cella[data-nap='" + napIndex + "']");
    let uresCella = null;
    let i = 0;
    while (i < cellak.length && uresCella === null) {
        if (!cellak[i].firstChild) {
            uresCella = cellak[i];
        }
        i++;
    }
    if (!uresCella) {
        ujSorHozzaadasa(szuloTabla);
        const frissCellak = szuloTabla.querySelectorAll(".kaja-cella[data-nap='" + napIndex + "']");
        uresCella = frissCellak[frissCellak.length - 1];
    }
    if (!uresCella.querySelector(".recept-valaszto")) {
        const select = document.createElement("select");
        select.classList.add("recept-valaszto");

        const defaultOpt = document.createElement("option");
        defaultOpt.textContent = "-- Válassz --";
        select.appendChild(defaultOpt);

        for (let i = 0; i < gyakorlatok.length; i++) {
            const opt = document.createElement("option");
            opt.value = gyakorlatok[i].gyakorlat_id;
            opt.textContent = gyakorlatok[i].gyakorlat_nev;
            select.appendChild(opt);
        }
        select.addEventListener("change", function () {
            let talalt = null;
            for (let i = 0; i < gyakorlatok.length; i++) {
                if (gyakorlatok[i].gyakorlat_id == select.value) {
                    talalt = gyakorlatok[i];
                }
            }
            if (talalt) {
                uresCella.appendChild(gyakorlatKartyaKeszites(talalt));
                select.remove();
            }
        });
        uresCella.appendChild(select);
    }
}

function napTorlese(napIndex, szuloTabla) {
    const cellak = szuloTabla.querySelectorAll(".kaja-cella[data-nap='" + napIndex + "']");
    for (let i = 0; i < cellak.length; i++) {
        cellak[i].innerHTML = "";
    }
}

function gyakorlatKartyaKeszites(gyakorlat) {
    const doboz = document.createElement("div");
    doboz.classList.add("kaja-kartya");

    doboz.dataset.gyakorlatId = gyakorlat.gyakorlat_id;
    const xBtn = document.createElement("button");
    xBtn.textContent = "X";
    xBtn.classList.add("torles-x");
    xBtn.addEventListener("click", function () { doboz.remove(); });

    const nev = document.createElement("div");
    nev.classList.add("etelNev");
    nev.textContent = gyakorlat.nev;

    const leiras = document.createElement("div");
    leiras.classList.add("gyakorlat-leiras");
    leiras.textContent = gyakorlat.leiras;

    const badge = document.createElement("div");
    badge.classList.add("kcal-badge");
    badge.textContent = gyakorlat.kor + "x" + gyakorlat.ismetles;

    const info = document.createElement("div");
    info.classList.add("adatok");
    info.textContent = gyakorlat.izomcsoport_nev;

    doboz.appendChild(xBtn);
    doboz.appendChild(nev);
    doboz.appendChild(leiras);
    doboz.appendChild(badge);
    doboz.appendChild(info);

    return doboz;
}