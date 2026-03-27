import { naptarInit } from './Naptar.js';
import { letrehozEdzoProfil } from './edzoProfil.js';
import { navbarGeneralas } from './navbar.js';

const menuLinkek = [
    { nev: "Főoldal", url: "../html/index.html" },
    { nev: "Személyi edzők", url: "../html/osszesEdzo.html" },
    { nev: "Receptek", url: "../html/etrendek.html" },
    { nev: "Edzéstervek", url: "../html/edzesterv.html" }
];
const edzoAdat = {
    nev: "Pitypang Bálint",
    kep: "../images/Pitypang.jpg",
    idezet: "Eskü 180 cm vagyok",
    leiras: "Az edzés nem csupán fizikai tevékenység...",
    eredmenyek: ["Év Személyi Edzője 2023", "CrossFit Bajnok"]
};

document.addEventListener("DOMContentLoaded", () => {
    letrehozEdzoProfil("edzo", edzoAdat);
    naptarInit("naptar", "idopontok");
    navbarGeneralas(menuLinkek);
});