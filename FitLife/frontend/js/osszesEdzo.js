import { edzokLista } from './edzokAdatok.js';

document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.getElementById("edzo-grid");
    if (gridContainer) {
        renderGrid(gridContainer, edzokLista);
    }
});
function renderGrid(container, lista) {
    container.replaceChildren(); 

    for (const edzo of lista) {
        const link = document.createElement("a");
        link.href = "../html/edzo.html";
        link.target="_blank";
        link.className = "edzo-card-wrapper";
        link.title = edzo.nev;
        const kartyaDiv = document.createElement("div");
        kartyaDiv.className = "edzo-belso";
        const imgDiv = document.createElement("div");
        imgDiv.className = "edzo-kep-tarolo";
        const img = document.createElement("img");
        img.src = edzo.kep;
        img.alt = edzo.nev;
        imgDiv.appendChild(img);

        const infoDiv = document.createElement("div");
        infoDiv.className = "edzo-info";
        const nevDiv = document.createElement("div");
        nevDiv.className = "edzo-nev";
        nevDiv.textContent = edzo.nev;
        const kompDiv = document.createElement("div");
        kompDiv.className = "edzo-komp";
        kompDiv.textContent = edzo.kompetenciak.slice(0, 3).join(", ");

        infoDiv.appendChild(nevDiv);
        infoDiv.appendChild(kompDiv);
        kartyaDiv.appendChild(imgDiv);
        kartyaDiv.appendChild(infoDiv);
        link.appendChild(kartyaDiv);
        container.appendChild(link);
    }
}