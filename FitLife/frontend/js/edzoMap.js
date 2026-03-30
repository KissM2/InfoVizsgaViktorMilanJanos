import { getKeres } from "./kozosFetch.js";

window.addEventListener('load', async function(){
    await waitForGoogleMaps();
    initMap();
});

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const myLocation = { lat: 47.4979, lng: 19.0402 };

    const map = new Map(document.getElementById("map"), {
        center: myLocation,
        zoom: 12,
        mapId: "726b6548570dfcd93188934a"
    });

    const marker = new AdvancedMarkerElement({
        map: map,
        position: myLocation,
        title: "Budapest"
    });

    const geocoder = new google.maps.Geocoder();

    const parameter = new URLSearchParams(window.location.search);

    const id = parameter.get("id");

    const address = await getKeres('/api/getEdzoTerem?edzoid='+id);

    geocoder.geocode({ address:address.edzoTerem }, (results, status) => {
        if (status === "OK") {
            const location = results[0].geometry.location;

            map.setCenter(location);

            marker.position = location;
            marker.title = address.edzoTerem;

        } else {
            console.error("Geocode failed: " + status);
        }
    });

    let div = document.createElement('div');
    let h3 = document.createElement('h3');
    h3.style.color = "black";
    h3.innerText = address.edzoTerem;
    let p = document.createElement('p');
    p.style.color = "black";
    p.innerText = "nyitvatartás: 8:00-17:00";
    div.appendChild(h3);
    div.appendChild(p);

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

async function waitForGoogleMaps() {
  while (!window.google || !google.maps || !google.maps.importLibrary) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}
