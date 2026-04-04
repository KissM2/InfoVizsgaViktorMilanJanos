import { naptarInit } from './Naptar.js';
import { letrehozEdzoProfil } from '../js/edzoProfil.js';
import { navbarGeneralas } from './navbar.js';
import { footerGeneralas } from './footer.js';
import { getKeres } from '../js/kozosFetch.js'

const menuLinkek = [
    { nev: "Főoldal", url: "../html/index.html" },
    { nev: "Személyi edzők", url: "../html/osszesEdzo.html" },
    { nev: "Receptek", url: "../html/etrendek.html" },
    { nev: "Edzéstervek", url: "../html/edzesterv.html" }
];
document.addEventListener("DOMContentLoaded", async () => {
    navbarGeneralas(menuLinkek);
    footerGeneralas();
    const urlParams = new URLSearchParams(window.location.search);
    const edzoId = urlParams.get('id');
    if (edzoId) {
        const valasz = await getKeres("/api/edzoProfil?id="+edzoId);
        if (valasz && valasz.results) {
            const adat = valasz.results;
            const formataltAdat = {
                nev: adat.felh_nev,
                kep: "../images/" + adat.kep,
                idezet: adat.idezet,
                leiras: adat.leiras,
                eredmenyek: [
                    "Szakértő tréner",
                    "Email:"+ adat.email,
                    "Telefon:"+adat.telszam
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
});