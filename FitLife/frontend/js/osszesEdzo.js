import { getKeres } from '../js/kozosFetch.js';
import { navbarGeneralas } from './navbar.js';

const menuLinkek = [
    { nev: "Főoldal", url: "../html/index.html" },
    { nev: "Edzéstervek", url: "../html/edzesterv.html" },
    { nev: "Receptek", url: "../html/etrendek.html" }
];
document.addEventListener("DOMContentLoaded", async () => {
    const gridContainer = document.getElementById("edzo-grid");
    if (gridContainer) {
        const edzokLista = await getKeres('/api/osszesEdzo');
        if (edzokLista && edzokLista.results) {
        renderGrid(gridContainer, edzokLista.results);
        }
    }
    navbarGeneralas(menuLinkek);
});
function renderGrid(container, lista) {
    container.replaceChildren(); 

    for (const edzo of lista) {
        const link = document.createElement("a");
        link.href = "../html/edzo.html?id="+edzo.id;
        link.target="_blank";
        link.className = "edzo-card-wrapper";
        link.title = edzo.nev;
        const kartyaDiv = document.createElement("div");
        kartyaDiv.className = "edzo-belso";
        const imgDiv = document.createElement("div");
        imgDiv.className = "edzo-kep-tarolo";
        const img = document.createElement("img");
        img.src = "../images/"+edzo.kep;
        img.alt = edzo.nev;
        imgDiv.appendChild(img);

        const infoDiv = document.createElement("div");
        infoDiv.className = "edzo-info";
        const nevDiv = document.createElement("div");
        nevDiv.className = "edzo-nev";
        nevDiv.textContent = edzo.nev;

        const idezetDiv = document.createElement("div");
        idezetDiv.className = "edzo-idezet";
        idezetDiv.textContent = edzo.idezet;

        const kompDiv = document.createElement("div");
        kompDiv.className = "edzo-komp";
        const kompetenciakTomb = edzo.kompetenciak ? edzo.kompetenciak.split(',') : [];
        kompDiv.textContent = kompetenciakTomb.slice(0, 3).join(", ");

        const cimDiv = document.createElement("div");
        cimDiv.className = "edzo-helyszin";
        cimDiv.textContent = edzo.edzoterm_cim;

        infoDiv.appendChild(nevDiv);
        infoDiv.appendChild(kompDiv);
        infoDiv.appendChild(idezetDiv);
        infoDiv.appendChild(cimDiv);
        kartyaDiv.appendChild(imgDiv);
        kartyaDiv.appendChild(infoDiv);
        link.appendChild(kartyaDiv);
        container.appendChild(link);
    }
}