import { getKeres } from "./kozosFetch.js";
import {loadGoogleMaps, helyAdatokLekerese, edzoteremDivGeneralas} from "./maps.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadGoogleMaps();
    await initMap();
});

async function initMap() {
    // Betöltjük a szükséges "könyvtárakat"
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const myLocation = { lat: 47.4979, lng: 19.0402 };

    // Térkép létrehozása
    const map = new Map(document.getElementById("map"), {
        center: myLocation,
        zoom: 12,
        mapId: "726b6548570dfcd93188934a" // egyedi stílus (Google Cloud-ban)
    });

    // Marker létrehozása a térképen
    const marker = new AdvancedMarkerElement({
        map: map,
        position: myLocation,
    });

    const location = await helykoordinatak();

    // Marker áthelyezése a térképen az edzőterem koordinátáinak helyére
    markerAthelyezes(map, marker, location);

    // Info ablak tartalom létrehozása
    infoAblakLetrehozas(map, marker, location);
}

async function helykoordinatak() {
    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("id");
    const address = (await getKeres('/api/getEdzoTerem?edzoid=' + id)).edzoTerem;

    // Koordináták létrehozása
    // parseFloat → stringből számot csinál, mert a Google Maps API-nek szám típusú koordináták kellenek
    const location = {
        lat: parseFloat(address.y),
        lng: parseFloat(address.x)
    };
    return location;
}

function markerAthelyezes(map, marker, location) {
    // Térkép középpontjának és nagyításának beállítása a koordináták alapján
    map.setCenter(location);

    // Marker áthelyezése a térképen a koordináták alapján
    marker.map = null;
    marker.position = location;
    marker.map = map;
}

async function infoAblakLetrehozas(map, marker, location) {
    const helyadatok = await helyAdatok(location);

    let div = edzoteremDivGeneralas(helyadatok, marker);

    const infoWindow = new google.maps.InfoWindow({
        content: div
    });
    
    marker.addListener("gmp-click", () => {
        infoWindow.open({
            anchor: marker,
            map: map,
        });
    });
}

async function helyAdatok(location) {
    try {
        const details = await helyAdatokLekerese(location.lat, location.lng, 25, ["displayName","regularOpeningHours","photos","rating",]);
        return details;
    } catch (err) {
        console.error("Error:", err);
    }
}
