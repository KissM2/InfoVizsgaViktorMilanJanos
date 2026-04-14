let ticking = false;
import { navbarGeneralas } from './navbar.js';
const menuLinkek = [
    { nev: "Személyi edzők", url: "../html/osszesEdzo.html" },
    { nev: "Receptek", url: "../html/etrendek.html" },
    { nev: "Edzéstervek", url: "../html/edzesterv.html" },
];

window.addEventListener("scroll", () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const topBtn = document.getElementById("top");
            if (topBtn) topBtn.style.display = window.scrollY > 300 ? "block" : "none";
            ticking = false;
        });
        ticking = true;
    }
});
document.addEventListener("DOMContentLoaded", () => {
    navbarGeneralas(menuLinkek);
    const topBtn = document.getElementById("top");
    if (topBtn) {
        topBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});