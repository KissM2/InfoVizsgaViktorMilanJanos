const edzestervek = [
    { weekday: "Hétfő", nev: "Fekvőtámasz", leiras: "Széles fogású karhajlítás.", kor: 3, ismetles: 15, megmozgatott_izmok: "Mell, Tricepsz", kellekek: "Nincs" },
    { weekday: "Hétfő", nev: "Tolódzkodás", leiras: "Pad szélén végzett tricepsz gyakorlat.", kor: 3, ismetles: 12, megmozgatott_izmok: "Tricepsz, Váll", kellekek: "Szék vagy pad" },
    { weekday: "Hétfő", nev: "Kézisúlyzós nyomás", leiras: "Fekvenyomás kézisúlyzóval.", kor: 4, ismetles: 10, megmozgatott_izmok: "Mell, Váll", kellekek: "Kézisúlyzó" },
    { weekday: "Hétfő", nev: "Tárogatás", leiras: "Mellizom nyújtása súlyzóval.", kor: 3, ismetles: 12, megmozgatott_izmok: "Mellizom", kellekek: "Kézisúlyzó, pad" },
    { weekday: "Hétfő", nev: "Plank", leiras: "Alkartámaszos kitartás.", kor: 3, ismetles: 60, megmozgatott_izmok: "Törzs, Has", kellekek: "Matrac" },

    { weekday: "Szerda", nev: "Húzódzkodás", leiras: "Széles fogású függeszkedés.", kor: 3, ismetles: 8, megmozgatott_izmok: "Hát, Bicepsz", kellekek: "Húzódzkodó rúd" },
    { weekday: "Szerda", nev: "Guggolás", leiras: "Saját testsúlyos guggolás.", kor: 4, ismetles: 20, megmozgatott_izmok: "Comb, Farizom", kellekek: "Nincs" },
    { weekday: "Szerda", nev: "Kitörés", leiras: "Váltott lábas előrelépés.", kor: 3, ismetles: 12, megmozgatott_izmok: "Comb, Egyensúly", kellekek: "Nincs" },
    { weekday: "Szerda", nev: "Evezés", leiras: "Döntött törzsű evezés súlyzóval.", kor: 4, ismetles: 10, megmozgatott_izmok: "Széles hátizom", kellekek: "Kézisúlyzó" },

    { weekday: "Péntek", nev: "Burpee", leiras: "Négyütemű fekvőtámasz ugrással.", kor: 3, ismetles: 10, megmozgatott_izmok: "Teljes test", kellekek: "Nincs" },
    { weekday: "Péntek", nev: "Hegymászó", leiras: "Fekvőtámaszban térdhúzás mellkashoz.", kor: 3, ismetles: 30, megmozgatott_izmok: "Has, Váll", kellekek: "Nincs" },
    { weekday: "Péntek", nev: "Vállból nyomás", leiras: "Súlyzók kitolása fej fölé.", kor: 3, ismetles: 12, megmozgatott_izmok: "Váll, Tricepsz", kellekek: "Kézisúlyzó" }
];

document.addEventListener("DOMContentLoaded", function() {
    const gomb = document.getElementById("gomb");
    gomb.addEventListener("click", edzesGeneracio);
});

function edzesGeneracio() {
    const egesz = document.getElementById("egesz");
    egesz.replaceChildren();
    const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
    const table = document.createElement("table");
    table.classList.add("Tabla");
    table.style.margin="auto";
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    for (let i = 0; i < napok.length; i++) {
        const th = document.createElement("th");
        th.classList.add("napok");
        th.textContent = napok[i];
        trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    table.appendChild(thead);
    
    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");
    for (let i = 0; i < napok.length; i++) {
        const td = document.createElement("td");
        td.classList.add("tdek");
        const napiGyakorlatok = [];
        for (let j = 0; j < edzestervek.length; j++) {
            if (edzestervek[j].weekday === napok[i]) {
                napiGyakorlatok.push(edzestervek[j]);
            }
        }
        if (napiGyakorlatok.length== 0) {
            const pihenes = document.createElement("div");
            pihenes.classList.add("etelNev"); 
            pihenes.textContent = "Pihenés";
            td.appendChild(pihenes);
        } else {
            for (let j = 0; j < napiGyakorlatok.length; j++) {
                const gy = napiGyakorlatok[j]; 
                const doboz = document.createElement("div");
                const nev = document.createElement("div");
                nev.classList.add("etelNev");
                nev.textContent = gy.nev;
                const leiras = document.createElement("div");
                leiras.classList.add("leiras");
                leiras.textContent = gy.leiras;
                const izmok = document.createElement("div");
                izmok.classList.add("leiras");
                izmok.textContent = "Izmok: " + gy.megmozgatott_izmok + " | Kellék: " + gy.kellekek;
                const info = document.createElement("div");
                info.classList.add("adatok");
                info.textContent = "Kör: " + gy.kor + " | Ismétlés: " + gy.ismetles;
                doboz.append(nev, leiras, izmok, info);
                td.appendChild(doboz);
            }
        }
        tr.appendChild(td);
    }
    
    tbody.appendChild(tr);
    table.appendChild(tbody);
    egesz.appendChild(table);
}