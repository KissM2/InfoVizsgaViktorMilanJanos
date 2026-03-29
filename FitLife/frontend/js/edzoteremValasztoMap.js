let map;
export let marker;

window.addEventListener('load', function(){
    initMap();
});

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const defaultLocation = { lat: 47.4979, lng: 19.0402 }; //Pest

    map = new Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 13,
        mapId: "726b6548570dfcd93188934a"
    });
    
    marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: defaultLocation
    });

   const autocomplete = document.getElementById("autocomplete");

    autocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
        const place = placePrediction.toPlace();
        await place.fetchFields({
            fields: ['displayName', 'formattedAddress', 'location'],
        });
        if (place.viewport) {
            map.fitBounds(place.viewport);
        }
        else {
            map.setCenter(place.location);
            map.setZoom(17);
        }
        let content = document.createElement('div');
        let nameText = document.createElement('span');
        nameText.textContent = place.displayName;
        content.appendChild(nameText);
        content.appendChild(document.createElement('br'));
        let addressText = document.createElement('span');
        addressText.textContent = place.formattedAddress;
        content.appendChild(addressText);
        marker.position = place.location;
    });
    map.addListener("click", (e) => {
        marker.position = e.latLng;
    });
};
