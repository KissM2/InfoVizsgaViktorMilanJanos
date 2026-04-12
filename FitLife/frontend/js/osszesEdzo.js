import { getKeres } from '../js/kozosFetch.js';
import { navbarGeneralas } from './navbar.js';
import { footerGeneralas } from './footer.js';

const menuLinkek = [
    { nev: "Edzéstervek", url: "../html/edzesterv.html" },
    { nev: "Receptek", url: "../html/etrendek.html" }
];

let eredetiEdzoLista = [];
let novekvo = true;
let Terkepblok = false;

document.addEventListener("DOMContentLoaded", async () => {
    const gridContainer = document.getElementById("edzo-grid");
    const terkepContainer = document.getElementById("terkep-container");
    const rendezesBtn = document.getElementById("rendezes-abc-btn");
    const nezetValtoBtn = document.getElementById("nezet-valto-btn");

    const adatok = await getKeres('/api/osszesEdzo');
    if (adatok && adatok.results) {        
        eredetiEdzoLista = adatok.results;
        renderGrid(gridContainer, eredetiEdzoLista);
    }
    footerGeneralas();
    navbarGeneralas(menuLinkek);
    rendezesBtn.addEventListener("click", () => {
        if (novekvo) {
            novekvo = false
        }
        else {
            novekvo = true
        }
        const ikon = document.getElementById("rendezes-ikon");
        const rendezett = eredetiEdzoLista.slice();
        if (novekvo) {
            rendezett.sort((a, b) => a.nev.localeCompare(b.nev, 'hu'));
            ikon.className = "fa-solid fa-arrow-down-a-z";
        }
        else {
            rendezett.sort((a, b) => b.nev.localeCompare(a.nev, 'hu'));
            ikon.className = "fa-solid fa-arrow-down-z-a";
        }
        renderGrid(gridContainer, rendezett);
    });
    nezetValtoBtn.addEventListener("click", () => {
        if (Terkepblok) {
            Terkepblok = false
        }
        else {
            Terkepblok = true
        }
        nezetValtoBtn.replaceChildren();
        const ujIkon = document.createElement("i");
        const szovegNode = document.createTextNode("");
        if (Terkepblok) {
            gridContainer.style.display = "none";
            terkepContainer.style.display = "flex";
            ujIkon.className = "fa-solid fa-list";
            szovegNode.textContent = " Lista nézet";
        }
        else {
            gridContainer.style.display = "grid";
            terkepContainer.style.display = "none";
            ujIkon.className = "fa-solid fa-map";
            szovegNode.textContent = " Térkép nézet";
        }
        nezetValtoBtn.appendChild(ujIkon);
        nezetValtoBtn.appendChild(szovegNode);
    });
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