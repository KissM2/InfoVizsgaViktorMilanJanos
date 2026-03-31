import { getKeres } from "./kozosFetch.js";

document.addEventListener("DOMContentLoaded", async () => {
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
          e.set("key","AIzaSyAzbHiyUyOtNFD4pzt2g8nx96tRxVaRDb4");
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
        title: "Budapest"
    });

    // Marker áthelyezése a térképen az edzőterem koordinátáinak helyére
    markerAthelyezes(map, marker);

    // Info ablak tartalom létrehozása
    infoAblakLetrehozas(map, marker);
}

async function markerAthelyezes(map, marker) {
    const parameter = new URLSearchParams(window.location.search);
    const id = parameter.get("id");
    const address = (await getKeres('/api/getEdzoTerem?edzoid=' + id)).edzoTerem;

    // Koordináták létrehozása
    // parseFloat → stringből számot csinál, mert a Google Maps API-nek szám típusú koordináták kellenek
    const location = {
        lat: parseFloat(address.y),
        lng: parseFloat(address.x)
    };

    // Térkép középpontjának és nagyításának beállítása a koordináták alapján
    map.setCenter(location);

    // Marker áthelyezése title beállítása a térképen a koordináták alapján
    marker.map = null;
    marker.position = location;
    marker.title = "Edzőterem címének helye";
    marker.map = map;
}

function infoAblakLetrehozas(map, marker) {
    let div = document.createElement('div');

    let h3 = document.createElement('h3');
    h3.style.color = "black";
    h3.innerText = "edzőterem címének helye";

    let p = document.createElement('p');
    p.style.color = "black";
    p.innerText = "edzőterem további információk helye";

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