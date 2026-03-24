import { getKeres } from '../js/kozosFetch.js';
let receptek=[]
document.addEventListener("DOMContentLoaded", async function () {
    const adatok = await getKeres('/api/receptek');
    if (adatok) {
        receptek = adatok;
    vezerloSavKeszites();
    //1szer alapbolmegvan hivva az alapTablaGeneralas
    alapTablaGeneralas();
    }
    else{
        console.error("Nem sikerült betölteni a recepteket.");
    }
});
// 1. Kalória számoló (P*4 + Sz*4 + Zs*9)
function szamolKcal(protein, szenhidrat, zsir) {
    return (protein * 4) + (szenhidrat * 4) + (zsir * 9);
}
function vezerloSavKeszites() {
    const teljes = document.getElementById("teljes");

    const sav = document.createElement("div");
    sav.classList.add("vezerlo-sav");

    const ujHetBtn = document.createElement("button");
    ujHetBtn.textContent = "Új hét (Üres tábla)";
    ujHetBtn.addEventListener("click",alapTablaGeneralas)


    sav.appendChild(ujHetBtn);
    teljes.appendChild(sav);
}
function alapTablaGeneralas() {
    const teljes = document.getElementById("teljes");
    const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
    const tipusok = [];
    for (let i = 0; i < receptek.length; i++) {
        //ha benne van
        if (tipusok.indexOf(receptek[i].etkezes_tipus) === -1) {
            tipusok.push(receptek[i].etkezes_tipus);
        }
    }
    const hetiResz = document.createElement("div");
    hetiResz.classList.add("heti-resz");
    const hetFejlec = document.createElement("div");
    hetFejlec.classList.add("het-fejlec");
    const h3 = document.createElement("h3");
    h3.textContent = "Heti étrend";
    const vezerloGombok = document.createElement("div");
    vezerloGombok.classList.add("het-vezerlok");

    const genBtn = document.createElement("button");
    genBtn.textContent = "Hét generálása";
    genBtn.classList.add("btn-gen-het");

    const torolBtn = document.createElement("button");
    torolBtn.textContent = "Hét eltávolítása";
    torolBtn.classList.add("btn-torol-het");

    vezerloGombok.append(genBtn, torolBtn);
    hetFejlec.append(h3, vezerloGombok);
    hetiResz.appendChild(hetFejlec);


    const container = document.createElement("div");
    container.classList.add("tabla-container");
    const table = document.createElement("table");
    table.classList.add("tabla");
    torolBtn.addEventListener("click",function(){hetiResz.remove();});
    genBtn.addEventListener("click",function() {etrendFeltoltes(table);})
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

        const torolBtn = document.createElement("button");
        torolBtn.textContent = "Törlés";
        torolBtn.addEventListener("click",function() { napTorlese(i,table); });
        const ujBtn = document.createElement("button");
        ujBtn.textContent = "Új felvétel";
        ujBtn.addEventListener("click", function() { napiUjFelvetel(i,table); });
        gombSav.appendChild(torolBtn);
        gombSav.appendChild(ujBtn);
        th.appendChild(gombSav);
        trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (let i = 0; i < tipusok.length; i++) {
        const tr = document.createElement("tr");
        const tdTipus = document.createElement("td");
        tdTipus.textContent = tipusok[i];
        tr.appendChild(tdTipus);
        for (let j = 0; j < 7; j++) {
            const td = document.createElement("td");
            td.classList.add("kaja-cella");
            td.dataset.nap = j;//Megkapja a data-nap=0(hetfo)(1=kedd...)ertéket
            td.dataset.tipus = tipusok[i];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    container.appendChild(table);
    hetiResz.appendChild(container)
    teljes.appendChild(hetiResz);
}
function napTorlese(napIndex,szuloTabla) {
    const cellak = szuloTabla.querySelectorAll('.kaja-cella[data-nap="' + napIndex + '"]');//szuloTabla.querySelectorAll hogy CSAK a szuloTablaba keresse,data-nap=89sorban kapja az erteket
    for (let i = 0; i < cellak.length; i++) {
        while (cellak[i].firstChild) {
            cellak[i].removeChild(cellak[i].firstChild);
        }
    }
}
function napiUjFelvetel(napIndex,szuloTabla) {
    const cellak = szuloTabla.querySelectorAll('.kaja-cella[data-nap="' + napIndex + '"]');//szuloTabla.querySelectorAll hogy CSAK a szuloTablaba keresse
    for (let i = 0; i < cellak.length; i++) {
        const td = cellak[i];
        if (!td.querySelector(".recept-valaszto")) {
            const select = document.createElement("select");
            select.classList.add("recept-valaszto");

            const defaultOpt = document.createElement("option");
            defaultOpt.textContent = "-- Válassz ételt --";
            select.appendChild(defaultOpt);
            const tipus = td.dataset.tipus;
            for (let j = 0; j < receptek.length; j++) {
                if (receptek[j].etkezes_tipus === tipus) {
                    const opt = document.createElement("option");
                    opt.value = receptek[j].nev;
                    opt.textContent = receptek[j].nev;
                    select.appendChild(opt);
                }
            }
            select.onchange = function () {
                let valasztott = null;
                for (let k = 0; k < receptek.length; k++) {
                    if (receptek[k].nev === select.value) {
                        valasztott = receptek[k];
                    }
                }

                if (valasztott) {
                    td.appendChild(kajaKartyaKeszites(valasztott));
                    select.remove();
                }
            };
            td.insertBefore(select, td.firstChild);
        }
    }
}
function etrendFeltoltes(Szulo) {
    const cellak = Szulo.querySelectorAll(".kaja-cella");
    for (let i = 0; i < cellak.length; i++) {
        const td = cellak[i];
        
        while (td.firstChild) {
            td.removeChild(td.firstChild);
        }
        const tipus = td.dataset.tipus;
        const validReceptek = [];
        
        for (let j = 0; j < receptek.length; j++) {
            if (receptek[j].etkezes_tipus === tipus) {
                validReceptek.push(receptek[j]);
            }
        }
        
        if (validReceptek.length > 0) {
            const rndIndex = Math.floor(Math.random() * validReceptek.length);
            const kaja = validReceptek[rndIndex];
            td.appendChild(kajaKartyaKeszites(kaja));
        }
    }
}
function kajaKartyaKeszites(kaja) {
    const doboz = document.createElement("div");
    doboz.classList.add("kaja-kartya");

    const xBtn = document.createElement("button");
    xBtn.textContent = "X";
    xBtn.classList.add("torles-x");
    xBtn.addEventListener("click",function() {
        doboz.remove();
    });

    const nev = document.createElement("div");
    nev.classList.add("etelNev");
    nev.textContent = kaja.nev;

    const kcalValue = szamolKcal(kaja.protein, kaja.szenhidrat, kaja.zsir);
    
    const badge = document.createElement("div");
    badge.classList.add("kcal-badge");
    badge.textContent = kcalValue + " kcal";

    const info = document.createElement("div");
    info.classList.add("adatok");
    const makroSzoveg = document.createTextNode("P: " + kaja.protein + "g | Sz: " + kaja.szenhidrat + "g | Zs: " + kaja.zsir + "g");
    info.appendChild(makroSzoveg);

    doboz.appendChild(xBtn);
    doboz.appendChild(nev);
    doboz.appendChild(badge);
    doboz.appendChild(info);
    
    return doboz;
}
