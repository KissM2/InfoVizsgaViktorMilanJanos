import { postKeres } from '../js/kozosFetch.js';
import { navbarGeneralas } from './navbar.js';

const menuLinkek = [
    { nev: "Főoldal", url: "../html/index.html" },
    { nev: "Személyi edzők", url: "../html/osszesEdzo.html" },
    { nev: "Receptek", url: "../html/etrendek.html" },
    { nev: "Edzéstervek", url: "../html/edzesterv.html" }
];
document.addEventListener("DOMContentLoaded", () => {
    navbarGeneralas(menuLinkek);
});
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    let result = await postKeres('/api/login', formData);
    if(result.message = "Sikeres bejelentkezés."){
        window.location.href = ".."
    };
    
});