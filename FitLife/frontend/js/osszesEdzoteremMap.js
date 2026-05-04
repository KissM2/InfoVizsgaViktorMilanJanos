import { getKeres } from "./kozosFetch.js";
import {loadGoogleMaps, felhHelyAdatokElkerese, autocompleteElhelyezes, helyAdatokLekerese, edzoteremDivGeneralas} from "./maps.js";
let infoWindow;

document.addEventListener('DOMContentLoaded', async function(){
    await loadGoogleMaps();
    await initMap();
});

async function initMap() {
    // Betöltjük a szükséges "könyvtárakat"
    const { Map } = await google.maps.importLibrary("maps");    

    let location;

    try{
        location = await felhHelyAdatokElkerese();

    }catch(error){
        console.error("Hiba a helyadatok lekérésekor:", error);
        location = { lat: 47.4979, lng: 19.0402 }; //Pest
    }

    // Térkép létrehozása
    let map = new Map(document.getElementById("map"), {
        center: location,
        zoom: 13,
        mapId: "726b6548570dfcd93188934a" // egyedi stílus (Google Cloud-ban)
    });

    autocompleteElhelyezes(map, "autocomplete");

    edzoteremMarkerekElhelyezese(map);
};

async function edzoteremMarkerekElhelyezese(map) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const edzoteremAdatok = (await getKeres("/api/getAllEdzoterem")).edzoteremAdatok;

    edzoteremAdatok.forEach(edzoterem => {
        console.log(edzoterem);
        let location = {
            lat: parseFloat(edzoterem.edzoterem_cim.y),
            lng: parseFloat(edzoterem.edzoterem_cim.x)
        };
        const marker = new AdvancedMarkerElement({
            map: map,
            position: location,
        });
        infoAblakLetrehozas(map, marker, location);
    });
}

async function infoAblakLetrehozas(map, marker, location) {
    
    marker.addListener("gmp-click", async () => {
        const helyadatok = await helyAdatokLekerese(location.lat, location.lng, 25, ["displayName","regularOpeningHours","photos","rating",]);

        let infowindowDiv = document.createElement('div');
        infowindowDiv.style.backgroundColor = "gray";
        infowindowDiv.style.width = "300px";

        let btnDiv = document.createElement('div');
        btnDiv.classList.add("mb-3");
        infowindowDiv.appendChild(btnDiv);        

        let btnEdzoterem = document.createElement('button');
        btnEdzoterem.textContent = "Edzőterem";
        btnEdzoterem.classList.add("btn", "infoWindowValtoBtn");
        btnEdzoterem.addEventListener("click", function(){
            btnEdzoterem.classList.add("infoWindowValtoBtnActive");
            btnEdzo.classList.remove("infoWindowValtoBtnActive");
            edzoteremDiv.style.display = "block";
            edzoDiv.style.display = "none";
        });
        btnDiv.appendChild(btnEdzoterem);
        
        let btnEdzo = document.createElement('button');
        btnEdzo.textContent = "Edzők";
        btnEdzo.classList.add("btn", "infoWindowValtoBtn", "infoWindowValtoBtnActive");
        btnEdzo.addEventListener("click", function(){
            btnEdzoterem.classList.remove("infoWindowValtoBtnActive");
            btnEdzo.classList.add("infoWindowValtoBtnActive");
            edzoteremDiv.style.display = "none";
            edzoDiv.style.display = "flex";
        });
        btnDiv.appendChild(btnEdzo);

        let edzoteremDiv = edzoteremDivGeneralas(helyadatok, null);
        if(!edzoteremDiv){
            btnEdzoterem.disabled = true;
            btnEdzoterem.title = "Nincs elérhető edzőterem adat ehhez az edzőteremhez";
        }else{
            edzoteremDiv.style.display = "none";
            infowindowDiv.appendChild(edzoteremDiv);
        }        

        let edzoDiv = await edzoDivGeneralas(location);
        edzoDiv.classList.add("row");
        infowindowDiv.appendChild(edzoDiv);

        if(infoWindow){
            infoWindow.close();
        }
        infoWindow = null;
        infoWindow = new google.maps.InfoWindow({
            content: infowindowDiv
        });
    
        infoWindow.open({
            anchor: marker,
            map: map,
        });

    });
}

async function edzoDivGeneralas(location) {
    const adatok = await getKeres('/api/osszesEdzoKorzetben?lng=' + location.lng + '&lat=' + location.lat);    
    let EdzoLista = adatok.results;
    let edzoDiv = renderGrid(EdzoLista);
    return edzoDiv;
}

function renderGrid(lista) {
    let container = document.createElement("div");
    container.className = "edzoGrid";

    for (const edzo of lista) {
        const link = document.createElement("a");
        link.href = "../html/edzo.html?id=" + edzo.id;
        link.target = "_blank";
        link.className = "edzo-card-wrapper";
        link.title = edzo.nev;
        link.classList.add("col-9");
        link.style.margin = "auto";
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

        const kompDiv = document.createElement("div");
        kompDiv.className = "edzo-komp";
        const kompetenciakTomb = edzo.kompetenciak ? edzo.kompetenciak.split(',') : [];
        kompDiv.textContent = kompetenciakTomb.slice(0, 3).join(", ");

        infoDiv.appendChild(nevDiv);
        infoDiv.appendChild(kompDiv);
        kartyaDiv.appendChild(imgDiv);
        kartyaDiv.appendChild(infoDiv);
        link.appendChild(kartyaDiv);
        container.appendChild(link);
    }
    return container;
}
