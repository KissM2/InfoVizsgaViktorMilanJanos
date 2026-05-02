import {getKeres, postKeres } from "./kozosFetch.js";
import { navbarGeneralas } from './navbar.js';
import { footerGeneralas } from './footer.js';
const menuLinkek = [
    { nev: "Edző főoldal", url: "/edzofo" },
    { nev: "Naptár szerkesztése", url: "/esznt" },
    { nev: "Névjegy szerkesztése", url: "/trainersedit"}
];
document.addEventListener("DOMContentLoaded", function () {
    navbarGeneralas(menuLinkek);
    footerGeneralas();
    adatokBetolteseInputba();
    document.getElementById("mentes").addEventListener("click",submit);
});

async function adatokBetolteseInputba() {
    const authAdatok = (await getKeres('/api/getAuthData')).result[0];

    document.getElementById('email').value = authAdatok.email;
    document.getElementById('felh_nev').value = authAdatok.felh_nev;
    document.getElementById('szul_datum').value = authAdatok.szul_datum.split("T")[0];
    document.getElementById('telszam').value = authAdatok.telszam;
    document.getElementById('nem').value = authAdatok.nem;
}
// PROFIL MENTÉS
async function submit() {
    const formData = new FormData(document.getElementById('edzodatas'));
    await postKeres("/api/updateAuthData",formData)
}