let map;
export let marker;
import {loadGoogleMaps} from "./maps.js";

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
            let hely = await helyLekerese(e.latLng.lat(), e.latLng.lng())
            let helyadatok = await helyadatokLekerese(hely);
            if (helyadatok) {
                popupWindowGeneralas(helyadatok, marker);
            }else{
                console.log("Nincs helyadat a kiválasztott helyhez.");
            }
        } catch (error) {
            console.error("Hiba a hely lekérésekor:", error);
        }
    });

    autocompleteElhelyezes(map, marker);
};

async function autocompleteElhelyezes(map, marker) {
    // Betöltjük a places könyvtárat az autocomplete használatához
    const { PlaceAutocompleteElement } = await google.maps.importLibrary("places");

    // létrehozunk egyautocomplete elementet
    const autocompleteElement = new PlaceAutocompleteElement();
    autocompleteElement.placeholder = "Keress edzőtermet...";
    document.getElementById("autocomplete").appendChild(autocompleteElement);

    // Esemény: amikor kiválasztanak egy helyet
    autocompleteElement.addEventListener("gmp-select", async (event) => {

    const placePrediction = event.placePrediction;

    // ha nincs helyválasztás, vagy nem jön vissza helyadat
    if (!placePrediction) {
        console.error("Nem sikerült a cím kiegészítése:", event);
        return;
    }

    const place = placePrediction.toPlace();

    // Betöltjük a hely adatait, hogy megkapjuk a koordinátákat
    await place.fetchFields({
        fields: ["location", "viewport"]
    });
    
    // ha nincs helyadat, akkor nem tudjuk megjeleníteni a helyet a térképen
    if (!place.location) {
        console.error("Nem sikerült a helyadat lekérése:", place);
        return;
    }

    // place.viewport → ha a helynek van viewportja, akkor a térkép azt fogja megjeleníteni, ha nincs, akkor a hely koordinátáira fog zoomolni
    if (place.viewport) {
        map.fitBounds(place.viewport);
    } else {
        map.setCenter(place.location);
        map.setZoom(17);
    }

    marker.map = null;
    marker.position = place.location;
    marker.title = place.displayName || place.formattedAddress || "Kiválasztott hely";
    marker.map = map;

});
}

async function felhHelyAdatokElkerese() {
    return new Promise((resolve, reject) => {

        // Ellenőrizzük, hogy a böngésző támogatja-e a geolocationt
        if (!navigator.geolocation) {
            reject(new Error("A böngésző nem támogatja a helymeghatározást."));
            return;
        }

        // Hely lekérése
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                resolve(location); // siker → visszaadjuk a koordinátákat
            },
            (error) => {
                // Hibakezelés
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        reject(new Error("A felhasználó nem engedélyezte a helymeghatározást."));
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reject(new Error("A helyadat nem elérhető."));
                        break;
                    case error.TIMEOUT:
                        reject(new Error("A helylekérés időtúllépés miatt megszakadt."));
                        break;
                    default:
                        reject(new Error("Ismeretlen hiba történt."));
                }
            },
            {
                enableHighAccuracy: true, // pontosabb, de lassabb lehet
                timeout: 60000,           // max 10 mp várakozás
                maximumAge: 0             // ne használjon cache-t
            }
        );
    });
}

async function helyLekerese(lat, lng) {
    const { Place } = await google.maps.importLibrary("places");

    const request = {
        locationRestriction: {
          center: { lat, lng },
          radius: 50,
        },
        fields: [ "displayName", "location"],
    };

    const { places } = await Place.searchNearby(request);

    return places[0];
}

async function helyadatokLekerese(place){
    await place.fetchFields({
        fields: [
            "displayName",
            "location",
        ],
    });

    return place;
}

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