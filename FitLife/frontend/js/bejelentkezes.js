import { postKeres } from '../js/kozosFetch.js';
import { navbarGeneralas } from './navbar.js';
import { footerGeneralas } from './footer.js';

const menuLinkek = [
    { nev: "Személyi edzők", url: "../html/osszesEdzo.html" },
    { nev: "Receptek", url: "../html/etrendek.html" },
    { nev: "Edzéstervek", url: "../html/edzesterv.html" }
];
document.addEventListener("DOMContentLoaded", () => {
    navbarGeneralas(menuLinkek);
    footerGeneralas();
});
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    let result = await postKeres('/api/login', formData);
    if(result.message = "Sikeres bejelentkezés."){
        window.location.href = ".."
    };
    
});