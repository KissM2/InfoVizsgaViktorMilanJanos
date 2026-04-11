import { naptarInit } from './Naptar.js';
import { letrehozEdzoProfil } from '../js/edzoProfil.js';
import { navbarGeneralas } from './navbar.js';
import { footerGeneralas } from './footer.js';
import { getKeres, postApi } from '../js/kozosFetch.js';

const menuLinkek = [
    { nev: "Főoldal", url: "../html/index.html" },
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
            const formataltAdat = {
                nev: adat.felh_nev,
                kep: "../images/" + adat.kep,
                idezet: adat.idezet,
                leiras: adat.leiras,
                eredmenyek: [
                    "Szakértő tréner",
                    "Email:" + adat.email,
                    "Telefon:" + adat.telszam
                ]
            };
            letrehozEdzoProfil("edzo", formataltAdat);
            naptarInit("naptar", "idopontok");
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
        if (aktualisKommentek.length === 0) {
            listaKontener.innerText = "Még nincsenek értékelések. Legyél te az első!";
            tobbBtn.classList.add("rejtett");
        }
        else {
            aktualisKommentek.forEach(komment => {
                const kartya = document.createElement("div");
                kartya.className = "komment-kartya";

                const fejlec = document.createElement("div");
                fejlec.className = "komment-kartya-fejlec";

                const nevSpan = document.createElement("span");
                nevSpan.className = "komment-neve";
                nevSpan.textContent = "👤 " +komment.felhasznalo_nev;

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
        if (!szovegInput) {
            hibaDiv.textContent = "Írj szöveget!";
        }
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