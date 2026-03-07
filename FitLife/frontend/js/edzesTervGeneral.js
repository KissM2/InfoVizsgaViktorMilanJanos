const edzestervek = [
    { weekday: "Hétfő", nev: "Fekvőtámasz", leiras: "Széles fogású karhajlítás.", kor: 3, ismetles: 15, megmozgatott_izmok: "Mell, Tricepsz", kellekek: "Nincs" },
    { weekday: "Hétfő", nev: "Tolódzkodás", leiras: "Pad szélén végzett tricepsz gyakorlat.", kor: 3, ismetles: 12, megmozgatott_izmok: "Tricepsz, Váll", kellekek: "Szék vagy pad" },
    { weekday: "Hétfő", nev: "Kézisúlyzós nyomás", leiras: "Fekvenyomás kézisúlyzóval.", kor: 4, ismetles: 10, megmozgatott_izmok: "Mell, Váll", kellekek: "Kézisúlyzó" },
    { weekday: "Hétfő", nev: "Tárogatás", leiras: "Mellizom nyújtása súlyzóval.", kor: 3, ismetles: 12, megmozgatott_izmok: "Mellizom", kellekek: "Kézisúlyzó, pad" },
    { weekday: "Hétfő", nev: "Plank", leiras: "Alkartámaszos kitartás.", kor: 3, ismetles: 60, megmozgatott_izmok: "Törzs, Has", kellekek: "Matrac" },

    { weekday: "Szerda", nev: "Húzódzkodás", leiras: "Széles fogású függeszkedés.", kor: 3, ismetles: 8, megmozgatott_izmok: "Hát, Bicepsz", kellekek: "Húzódzkodó rúd" },
    { weekday: "Szerda", nev: "Guggolás", leiras: "Saját testsúlyos guggolás.", kor: 4, ismetles: 20, megmozgatott_izmok: "Comb, Farizom", kellekek: "Nincs" },
    { weekday: "Szerda", nev: "Kitörés", leiras: "Váltott lábas előrelépés.", kor: 3, ismetles: 12, megmozgatott_izmok: "Comb, Egyensúly", kellekek: "Nincs" },
    { weekday: "Szerda", nev: "Evezés", leiras: "Döntött törzsű evezés súlyzóval.", kor: 4, ismetles: 10, megmozgatott_izmok: "Széles hátizom", kellekek: "Kézisúlyzó" },

    { weekday: "Péntek", nev: "Burpee", leiras: "Négyütemű fekvőtámasz ugrással.", kor: 3, ismetles: 10, megmozgatott_izmok: "Teljes test", kellekek: "Nincs" },
    { weekday: "Péntek", nev: "Hegymászó", leiras: "Fekvőtámaszban térdhúzás mellkashoz.", kor: 3, ismetles: 30, megmozgatott_izmok: "Has, Váll", kellekek: "Nincs" },
    { weekday: "Péntek", nev: "Vállból nyomás", leiras: "Súlyzók kitolása fej fölé.", kor: 3, ismetles: 12, megmozgatott_izmok: "Váll, Tricepsz", kellekek: "Kézisúlyzó" }
];

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("teljes");
    vezerloSavKeszites();
    alapTablaGeneralas();
});

function vezerloSavKeszites() {
    const teljes = document.getElementById("teljes");
    const sav = document.createElement("div");
    sav.classList.add("vezerlo-sav");
    const ujHetBtn = document.createElement("button");
    ujHetBtn.textContent = "Új hét (Üres tábla)";
    ujHetBtn.addEventListener("click", function() {alapTablaGeneralas(); });
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
    const torolBtn = document.createElement("button");
    torolBtn.textContent = "Hét eltávolítása";
    torolBtn.classList.add("btn-torol-het");
    vezerloGombok.appendChild(genBtn);
    vezerloGombok.appendChild(torolBtn);
    hetFejlec.appendChild(h3);
    hetFejlec.appendChild(vezerloGombok);
    hetiResz.appendChild(hetFejlec);
    const container = document.createElement("div");
    container.classList.add("tabla-container");
    const table = document.createElement("table");
    table.classList.add("tabla");
    torolBtn.addEventListener("click", function() {hetiResz.remove();});
    
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
        tBtn.addEventListener("click", function() {napTorlese(i, table);});
        const uBtn = document.createElement("button");
        uBtn.textContent = "Új felvétel";
        uBtn.addEventListener("click", function() {napiUjFelvetel(i, table);});
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
    genBtn.addEventListener("click", function() {edzestervFeltoltes(table);});
    container.appendChild(table);
    hetiResz.appendChild(container);
    teljes.appendChild(hetiResz);
}
function edzestervFeltoltes(szuloTabla) {
    const cellak = szuloTabla.querySelectorAll(".kaja-cella");
    for (let i = 0; i < cellak.length; i++) {
        cellak[i].innerHTML = "";
    }
    const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
    for (let j = 0; j < 7; j++) {
        const aktualisNap = napok[j];
        let napiSzamlalo = 0;
        for (let k = 0; k < edzestervek.length; k++) {
            if (edzestervek[k].weekday === aktualisNap) {
                let td = szuloTabla.querySelector(".kaja-cella[data-nap='" + j + "'][data-sorszam='" + napiSzamlalo + "']");
                if (!td) {
                    ujSorHozzaadasa(szuloTabla);
                    td = szuloTabla.querySelector(".kaja-cella[data-nap='" + j + "'][data-sorszam='" + napiSzamlalo + "']");
                }
                td.appendChild(gyakorlatKartyaKeszites(edzestervek[k]));
                napiSzamlalo++;
            }
        }
    }
}
function napiUjFelvetel(napIndex, szuloTabla) {
    const cellak = szuloTabla.querySelectorAll(".kaja-cella[data-nap='" + napIndex + "']");
    let uresCella = null;
    for (let i = 0; i < cellak.length; i++) {
        if (!cellak[i].firstChild) {
            uresCella = cellak[i];
        }
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

        const egyediNevek = [];
        for (let i = 0; i < edzestervek.length; i++) {
            if (egyediNevek.indexOf(edzestervek[i].nev) === -1) {
                egyediNevek.push(edzestervek[i].nev);
            }
        }
        for (let i = 0; i < egyediNevek.length; i++) {
            const opt = document.createElement("option");
            opt.value = egyediNevek[i];
            opt.textContent = egyediNevek[i];
            select.appendChild(opt);
        }
        select.addEventListener("change", function () {
            let talalt = null;
            for (let i = 0; i < edzestervek.length; i++) {
                if (edzestervek[i].nev === select.value) {
                    talalt = edzestervek[i];
                    break;
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

    const xBtn = document.createElement("button");
    xBtn.textContent = "X";
    xBtn.classList.add("torles-x");
    xBtn.addEventListener("click", function() {doboz.remove();});

    const nev = document.createElement("div");
    nev.classList.add("etelNev");
    nev.textContent = gyakorlat.nev;

    const badge = document.createElement("div");
    badge.classList.add("kcal-badge");
    badge.textContent = gyakorlat.kor + "x" + gyakorlat.ismetles;

    const info = document.createElement("div");
    info.classList.add("adatok");
    info.textContent = gyakorlat.megmozgatott_izmok + " | " + gyakorlat.kellekek;

    doboz.appendChild(xBtn);
    doboz.appendChild(nev);
    doboz.appendChild(badge);
    doboz.appendChild(info);
    
    return doboz;
}