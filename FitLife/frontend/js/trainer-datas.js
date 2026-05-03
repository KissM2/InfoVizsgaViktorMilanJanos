import {getKeres, postKeres } from "./kozosFetch.js";
import { navbarGeneralas } from './navbar.js';
const menuLinkek = [
    { nev: "Edző főoldal", url: "/edzofo" },
    { nev: "Naptár szerkesztése", url: "/esznt" },
    { nev: "Névjegy szerkesztése", url: "/trainersedit"}
];
document.addEventListener("DOMContentLoaded", function () {
    navbarGeneralas(menuLinkek);
    adatokBetolteseInputba();
    document.getElementById("mentes").addEventListener("click",submit);
    document.getElementById('fiok_torlese_btn').addEventListener('click', async function() {
        const megerosites = confirm("Biztosan törölni szeretnéd a fiókodat? Ezzel azonnal kijelentkezel, és elveszíted a hozzáférésedet a rendszerhez.");
        
        if (megerosites) {
            try {
                const response = await deleteKeres('/api/deleteUser');
                
                if (response) {
                    alert("A fiókodat sikeresen felfüggesztettük.\n\nAmennyiben szeretnéd visszaállítani a fiókodat, kérjük, írj nekünk a fitlife123123@gmail.com e-mail címre!");
                    window.location.href = "/";
                } else {
                    const hiba = await response.json();
                    alert(hiba.message || "Hiba történt a törlés során.");
                }
            } catch (error) {
                console.error("Hiba a törlésnél:", error);
                alert("Szerver hiba történt.");
            }
        }
    });
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