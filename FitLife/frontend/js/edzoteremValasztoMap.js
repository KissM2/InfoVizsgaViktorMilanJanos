let map;
export let marker;

document.addEventListener('DOMContentLoaded', async function(){
    // Ez megakadályozza, hogy a form elküldése újratöltse az oldalt
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
    });
    await loadGoogleMaps();
    await initMap();
});

// Ez a függvény tölti be a Google Maps API-t dinamikusan
const loadGoogleMaps = () =>
  new Promise((resolve, reject) => {

    // Ha már egyszer betöltöttük a Google Maps-et, akkor nem kell újra betölteni
    if (window.google?.maps?.importLibrary) {
      return resolve();
    }

    const script = document.createElement("script");

    // A script tartalmába beírjuk a Google hivatalos betöltő kódját
    // Ez teszi lehetővé az új "importLibrary" használatát
    script.innerHTML = `
      (g=>{
        var h,a,k,p="The Google Maps JavaScript API",
        c="google",l="importLibrary",q="__ib__",
        m=document,b=window;
        b=b[c]||(b[c]={});
        var d=b.maps||(b.maps={}),
        r=new Set,e=new URLSearchParams,
        u=()=>h||(h=new Promise(async(f,n)=>{
          await (a=m.createElement("script"));
          e.set("key","Api_key");
          e.set("v","weekly");
          e.set("callback",c+".maps."+q);
          a.src="https://maps.googleapis.com/maps/api/js?"+e;
          d[q]=f;
          a.onerror=()=>h=n(Error(p+" could not load."));
          m.head.append(a)
        }));
        d[l]?console.warn(p+" only loads once."):
        d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))
      })({});
    `;
     // Hozzáadjuk a scriptet a HTML-hez → elkezd betöltődni a Google Maps API
    document.head.appendChild(script);

    // Ez folyamatosan ellenőrzi, hogy betöltődött-e már a Google Maps API
    const interval = setInterval(() => {
      if (window.google?.maps?.importLibrary) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });

async function initMap() {
    // Betöltjük a szükséges "könyvtárakat"
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    let location;

    try{
        location = await helyAdatokElkerese();

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
    map.addListener("click", (e) => {
        marker.position = e.latLng;
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
        console.error("No placePrediction in event:", event);
        return;
    }

    const place = placePrediction.toPlace();

    // Betöltjük a hely adatait, hogy megkapjuk a koordinátákat
    await place.fetchFields({
        fields: ["displayName", "formattedAddress", "location", "viewport"]
    });
    
    // ha nincs helyadat, akkor nem tudjuk megjeleníteni a helyet a térképen
    if (!place.location) {
        console.error("No location returned:", place);
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

async function helyAdatokElkerese() {
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
