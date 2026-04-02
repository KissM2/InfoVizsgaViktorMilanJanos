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
          e.set("key","AIzaSyBxABoWzljDSRuXT-J8FUTdfzl1vN8FfA4");
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