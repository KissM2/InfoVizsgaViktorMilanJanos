import { navbarGeneralas } from './navbar.js';
const menuLinkek = [
    { nev: "Személyi edzők", url: "../html/osszesEdzo.html" },
    { nev: "Receptek", url: "../html/etrendek.html" },
    { nev: "Edzéstervek", url: "../html/edzesterv.html" },
];

document.addEventListener('DOMContentLoaded', function(){
    navbarGeneralas(menuLinkek);
})
