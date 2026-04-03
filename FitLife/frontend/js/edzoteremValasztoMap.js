let map;
export let marker;
import {loadGoogleMaps, felhHelyAdatokElkerese, helyAdatokLekerese, autocompleteElhelyezes} from "./maps.js";

document.addEventListener('DOMContentLoaded', async function(){
    // Ez megakadályozza, hogy a form elküldése újratöltse az oldalt
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
    });
    await loadGoogleMaps();
    await initMap();
});

async function initMap() {
    // Betöltjük a szükséges "könyvtárakat"
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    let location;

    try{
        location = await felhHelyAdatokElkerese();

    }catch(error){
        console.error("Hiba a helyadatok lekérésekor:", error);
        location = { lat: 47.4979, lng: 19.0402 }; //Pest
    }

    // Térkép létrehozása
    map = new Map(document.getElementById("map"), {
        center: location,
        zoom: 13,
        mapId: "726b6548570dfcd93188934a" // egyedi stílus (Google Cloud-ban)
    });
    
    // Marker létrehozása a térképen
    marker = new AdvancedMarkerElement({
        map: map,
        position: location
    });

    // Térképre kattintva a marker a kattintás helyére kerül
    map.addListener("click", async (e) => {
        marker.position = e.latLng;
        try {
            //megnézzük hogy van e bármi google mapsen jelölt hely a kattintás környezetében. Ha van, akkor megkérdezzük az edzőt, hogy arra a helyre gondolt e, és ha igen, akkor a marker arra a helyre kerül
            let helyadatok = await helyAdatokLekerese(e.latLng.lat(), e.latLng.lng(), 50, ["displayName", "location"]);
            if (helyadatok) {
                popupWindowGeneralas(helyadatok, marker);
            }
        } catch (error) {
            console.error("Hiba a hely lekérésekor:", error);
        }
    });

   await autocompleteElhelyezes(map, "autocomplete", marker);
};

function popupWindowGeneralas(helyadatok, marker) {
    
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";

    const box = document.createElement("div");
    box.style.background = "black";
    box.style.padding = "20px";
    box.style.borderRadius = "10px";
    box.style.width = "300px";
    box.style.textAlign = "center";
    box.style.fontFamily = "Arial";

    const title = document.createElement("h3");
    title.innerText = helyadatok.displayName || "Ismeretlen hely";

    const question = document.createElement("p");
    question.innerText = "Erre a helyre gondoltál?";

    const yesBtn = document.createElement("button");
    yesBtn.innerText = "Igen";
    yesBtn.style.margin = "5px";
    yesBtn.onclick = () => {
        marker.position = helyadatok.location;
        document.body.removeChild(overlay);
    };

    const noBtn = document.createElement("button");
    noBtn.innerText = "Nem";
    noBtn.style.margin = "5px";
    noBtn.onclick = () => {
        document.body.removeChild(overlay);
    };

    box.appendChild(title);
    box.appendChild(question);
    box.appendChild(yesBtn);
    box.appendChild(noBtn);

    overlay.appendChild(box);
    document.body.appendChild(overlay);
}