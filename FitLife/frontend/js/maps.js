// Ez a függvény tölti be a Google Maps API-t dinamikusan
export const loadGoogleMaps = () =>
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
          e.set("key","AIzaSyCNA1vQi0b5-v4UgCT9AMMDaavLNFuzz3A");
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

export async function felhHelyAdatokElkerese() {
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

export async function helyAdatokLekerese(lat, lng, radius, fields) {
    const { Place } = await google.maps.importLibrary("places");

    const request = {
        locationRestriction: {
          center: { lat, lng },
          radius: radius,
        },
        fields: fields,
    };


    const { places } = await Place.searchNearby(request);

    if (!places || places.length === 0) {
        return null; // nincs találat
    }

    const place = await places[0].fetchFields({
        fields: fields,
    });

    return place.place;
}

// marker paraméter opcionális, ha meg van adva, akkor a kiválasztott helyre helyezi át a marker-t, ha nincs megadva, akkor csak a térképet mozgatja a helyre
/**
 * @param {google.maps.Map} map - A térkép példány
 * @param {string} autocompleteDivId - Az input mező ID-ja
 */
export async function autocompleteElhelyezes(map, autocompleteDivId) {
    // Betöltjük a places könyvtárat az autocomplete használatához
    const { PlaceAutocompleteElement } = await google.maps.importLibrary("places");

    // létrehozunk egyautocomplete elementet
    const autocompleteElement = new PlaceAutocompleteElement();
    autocompleteElement.placeholder = "Keress edzőtermet...";
    document.getElementById(autocompleteDivId).appendChild(autocompleteElement);

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
            fields: ["location", "viewport", "displayName"]
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
    });
}

export function edzoteremDivGeneralas(helyadatok, marker) {

    if(!helyadatok || !helyadatok.displayName) {
        if(marker){
            marker.title = "Nincs elérhető helyadat";
        }
      return;
    }

    let edzoteremDiv = document.createElement('div');

    let h3 = document.createElement('h3');
    h3.style.color = "black";
    h3.innerText = helyadatok.displayName;
    h3.style.margin = "0";
    edzoteremDiv.appendChild(h3);

    if (helyadatok.rating) {
      let rating = document.createElement('p');
      rating.style.color = "black";
      rating.innerText = `Értékelés: ${helyadatok.rating}`;
      rating.style.marginBottom = "5px";
      edzoteremDiv.appendChild(rating);
    }

    if (helyadatok.photos && helyadatok.photos.length !== 0) {
      let img =document.createElement('img');
      img.src = helyadatok.photos[0].getURI({ maxWidth: 150 });
      img.style.width = "100%";
      img.style.height = "auto";
      edzoteremDiv.appendChild(img);
    }

    if (helyadatok.regularOpeningHours) {
      let nyitvatartas = document.createElement('edzoteremDiv');
      let nyitvatartasCim = document.createElement('h5');
      nyitvatartasCim.style.color = "black";
      nyitvatartasCim.style.margin = "10px 0 0 0";
      nyitvatartasCim.innerText = "Általános nyitvatartás:";
      nyitvatartas.appendChild(nyitvatartasCim);
      for (let i = 0; i < helyadatok.regularOpeningHours.ph.length; i++) {
        let p = document.createElement('p');
        p.style.color = "black";
        p.style.margin = "0";
        p.innerText = helyadatok.regularOpeningHours.ph[i];
        nyitvatartas.appendChild(p);
      }
      edzoteremDiv.appendChild(nyitvatartas);
    }

    return edzoteremDiv;
}
