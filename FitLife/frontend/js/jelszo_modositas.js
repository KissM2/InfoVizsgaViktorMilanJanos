import { navbarGeneralas } from './navbar.js';
import { postApi } from './kozosFetch.js';
const menuLinkek = [
    { nev: "Személyi edzők", url: "../html/osszesEdzo.html" },
    { nev: "Receptek", url: "../html/etrendek.html" },
    { nev: "Edzéstervek", url: "../html/edzesterv.html" },
];
document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (!token) {
        navbarGeneralas(menuLinkek);
    } 
    else {
        console.log("Token alapú visszaállítás mód");
    }

    document.getElementById('mentes_jelszo').addEventListener('click', async () => {
        const j1 = document.getElementById('jelszo1').value;
        const j2 = document.getElementById('jelszo2').value;
        const hiba = document.getElementById('hiba_uzenet');
        hiba.textContent = "";
        if (!j1 || !j2) {
            hiba.textContent = "Minden mezőt tölts ki!";
            return;
        }
        if (j1 !== j2) {
            hiba.textContent = "A két jelszó nem egyezik!";
            return;
        }
        try {
            let res;
            if (token) {
                res = await postApi('/api/reset-password', { token: token, jelszo: j1 });
                alert("Sikeres jelszóvisszaállítás! Most már bejelentkezhetsz.");
                window.location.href = "../html/bejelentkez.html";
            } 
            else {
                res = await postApi('/api/updateJelszo', { jelszo: j1 });
                alert("Sikeres jelszómódosítás!");
                document.getElementById('jelszo1').value = "";
                document.getElementById('jelszo2').value = "";
            }
        } catch (error) {
            hiba.textContent = "Hiba a szerverrel való kommunikációban.";
        }
    });
});
