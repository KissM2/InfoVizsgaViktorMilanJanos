function initMap() {
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

    let div = document.createElement('div');
    let h3 = document.createElement('h3');
    h3.style.color = "black";
    h3.innerText = "Budapest";
    let p = document.createElement('p');
    p.style.color = "black";
    p.innerText = "Capital of Hungary";
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
