let ticking = false;
import { getKeres } from './kozosFetch.js';
import { navbarGeneralas } from './navbar.js';
import { footerGeneralas } from './footer.js';
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
document.addEventListener("DOMContentLoaded", async() => {
    navbarGeneralas(menuLinkek);
    footerGeneralas();
    const topBtn = document.getElementById("top");
    if (topBtn) {
        topBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
    const top4edzok=await getKeres("/api/topNegyEdzo");
    renderGrid(document.getElementById('top4edzo'), top4edzok.results);
});
function renderGrid(container, lista) {
    container.replaceChildren();

    for (const edzo of lista) {
        const link = document.createElement("a");
        link.href = "../html/edzo.html?id=" + edzo.id;
        link.target = "_blank";
        link.className = "edzo-card-wrapper";
        link.title = edzo.nev;
        const kartyaDiv = document.createElement("div");
        kartyaDiv.className = "edzo-belso";
        const imgDiv = document.createElement("div");
        imgDiv.className = "edzo-kep-tarolo";
        const img = document.createElement("img");
        img.src = "../images/" + edzo.kep;
        img.alt = edzo.nev;
        imgDiv.appendChild(img);

        const infoDiv = document.createElement("div");
        infoDiv.className = "edzo-info";
        const nevDiv = document.createElement("div");
        nevDiv.className = "edzo-nev";
        nevDiv.textContent = edzo.nev;
        if (edzo.tavolsag !== undefined) {
            const tavDiv = document.createElement("div");
            tavDiv.style.color = "#ffc107";
            tavDiv.textContent = Math.round(edzo.tavolsag / 1000) + " km-re tőled";
            infoDiv.appendChild(tavDiv);
        }
        const idezetDiv = document.createElement("div");
        idezetDiv.className = "edzo-idezet";
        idezetDiv.textContent = edzo.idezet;

        const kompDiv = document.createElement("div");
        kompDiv.className = "edzo-komp";
        const kompetenciakTomb = edzo.kompetenciak ? edzo.kompetenciak.split(',') : [];
        kompDiv.textContent = kompetenciakTomb.slice(0, 3).join(", ");

        infoDiv.appendChild(nevDiv);
        infoDiv.appendChild(kompDiv);
        infoDiv.appendChild(idezetDiv);
        kartyaDiv.appendChild(imgDiv);
        kartyaDiv.appendChild(infoDiv);
        link.appendChild(kartyaDiv);
        container.appendChild(link);
    }
}