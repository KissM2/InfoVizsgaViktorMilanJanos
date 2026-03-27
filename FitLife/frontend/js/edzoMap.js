import { getKeres } from "./kozosFetch.js";

document.addEventListener('DOMContentLoaded', function(){
    initMap();
});

async function initMap() {
    const myLocation = { lat: 47.4979, lng: 19.0402 };

    const map = new google.maps.Map(document.getElementById("map"), {
        center: myLocation,
        zoom: 12,
        mapId: "726b6548570dfcd93188934a"
    });

    const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: myLocation,
        title: "Budapest"
    });

    const geocoder = new google.maps.Geocoder();

    //edző id-t le kell majd cserélni
    const address = await getKeres('/api/getEdzoTerem?edzoid=5');

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
    h3.innerText = "Power fitness edzőterem";
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
