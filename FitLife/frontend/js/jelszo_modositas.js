import { navbarGeneralas } from './navbar.js';
import { postApi } from './kozosFetch.js';
const menuLinkek = [
    { nev: "Személyi edzők", url: "../html/osszesEdzo.html" },
    { nev: "Receptek", url: "../html/etrendek.html" },
    { nev: "Edzéstervek", url: "../html/edzesterv.html" },
];
document.addEventListener('DOMContentLoaded', function () {
    navbarGeneralas(menuLinkek);
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
            await postApi('/api/updateJelszo', { jelszo: j1 });
            alert("Sikeres jelszómódosítás!");
            document.getElementById('jelszo1').value = "";
            document.getElementById('jelszo2').value = "";
        } catch (error) {
            hiba.textContent = "Hiba a szerverrel való kommunikációban.";
        }
    });
});
