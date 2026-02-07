/******************** DEBUG ********************/
const DEBUG = true;

/******************** AKTUÁLIS HÓNAP ********************/
let currentYear, currentMonth;

/******************** ÁLLAPOT ********************/
/*
foglalasok:
{
  "YYYY-MM-DD": {
      egyedi:  ["HH:MM"],
      tomeges: ["HH:MM"]
  }
}
*/
let foglalasok = {};

let aktualisMod = null;       // "nap" | "hetnap"
let aktualisNap = null;       // { ev, honap, nap }
let aktualisHetNapIndex = null;

const napnevek = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
const honapNevek = [
    "Január", "Február", "Március", "Április", "Május", "Június",
    "Július", "Augusztus", "Szeptember", "Október", "November", "December"
];

/******************** INIT ********************/
document.addEventListener("DOMContentLoaded", () => {
    const now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth() + 1;
    renderCalendar();
});

/******************** FÓKUSZ ********************/
function clearSelection() {
    document.querySelectorAll(".selected-day")
        .forEach(el => el.classList.remove("selected-day"));
    document.querySelectorAll(".selected-hetnap")
        .forEach(el => el.classList.remove("selected-hetnap"));
}

/******************** RENDER ********************/
function renderCalendar() {
    const naptar = document.getElementById("naptar");
    naptar.innerHTML = "";
    naptar.append(calendarHeader(), naptarGeneral(currentYear, currentMonth));
}

/******************** HÓNAP FEJLÉC ********************/
function calendarHeader() {
    const header = document.createElement("div");
    header.className = "calendar-header";

    const prev = document.createElement("button");
    prev.textContent = "◀";
    prev.onclick = () => changeMonth(-1);

    const title = document.createElement("div");
    title.className = "calendar-title";
    title.textContent = `${currentYear} ${honapNevek[currentMonth - 1]}`;

    const next = document.createElement("button");
    next.textContent = "▶";
    next.onclick = () => changeMonth(1);

    header.append(prev, title, next);
    return header;
}

function changeMonth(dir) {
    currentMonth += dir;
    if (currentMonth === 13) { currentMonth = 1; currentYear++; }
    if (currentMonth === 0) { currentMonth = 12; currentYear--; }

    aktualisMod = null;
    aktualisNap = null;
    aktualisHetNapIndex = null;
    document.getElementById("idopontok").innerHTML = "";

    renderCalendar();
}

/******************** NAPTÁR ********************/
function naptarGeneral(ev, honap) {
    const today = new Date();
    const wrapper = document.createElement("div");

    const firstDay = (new Date(ev, honap - 1, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(ev, honap, 0).getDate();
    let day = 1;

    /* HÉTNAP FEJLÉC */
    const head = document.createElement("div");
    head.className = "week";

    napnevek.forEach((nev, i) => {
        const h = document.createElement("div");
        h.className = "hetnap";
        h.textContent = nev;

        h.onclick = () => {
            clearSelection();
            h.classList.add("selected-hetnap");

            aktualisMod = "hetnap";
            aktualisHetNapIndex = i;
            aktualisNap = { ev, honap };
            idopontPanel();
        };

        head.appendChild(h);
    });
    wrapper.appendChild(head);

    /* NAPOK */
    while (day <= daysInMonth) {
        const row = document.createElement("div");
        row.className = "week";

        for (let i = 0; i < 7; i++) {
            const cell = document.createElement("div");
            cell.className = "day";

            if ((day === 1 && i < firstDay) || day > daysInMonth) {
                cell.classList.add("noDay");
            } else {
                const aktNap = day;
                cell.textContent = aktNap;

                if (
                    ev === today.getFullYear() &&
                    honap === today.getMonth() + 1 &&
                    aktNap === today.getDate()
                ) {
                    cell.classList.add("today");
                }

                cell.onclick = () => {
                    clearSelection();
                    cell.classList.add("selected-day");

                    aktualisMod = "nap";
                    aktualisNap = { ev, honap, nap: aktNap };
                    idopontPanel();
                };

                day++;
            }
            row.appendChild(cell);
        }
        wrapper.appendChild(row);
    }
    return wrapper;
}

/******************** IDŐPONT PANEL ********************/
function idopontPanel() {
    const box = document.getElementById("idopontok");
    box.innerHTML = "";
    if (!aktualisMod) return;

    /* CÍM */
    const cim = document.createElement("h3");
    cim.style.marginBottom = "10px";

    if (aktualisMod === "nap") {
        cim.textContent =
            `${aktualisNap.ev}. ${aktualisNap.honap}. ${aktualisNap.nap}. – egyedi nap`;
    } else {
        cim.textContent =
            `${napnevek[aktualisHetNapIndex]} – tömeges beállítás`;
        cim.style.color = "#28a745";
    }
    box.appendChild(cim);

    /* IDŐPONTOK */
    for (let h = 0; h < 24; h++) {
        for (let m of ["00", "30"]) {
            const ido = `${String(h).padStart(2, "0")}:${m}`;
            const btn = document.createElement("button");
            btn.className = "idopontBtn";
            btn.textContent = ido;

            if (aktualisMod === "nap") {
                const key = datumKulcs(
                    aktualisNap.ev,
                    aktualisNap.honap,
                    aktualisNap.nap
                );

                const state = napIdoAllapot(key, ido);
                if (state) btn.classList.add(state);

            } else {
                const allapot = hetnapIdoAllapot(ido);
                if (allapot) btn.classList.add(allapot);
            }

            btn.onclick = () => {
                aktualisMod === "nap"
                    ? egyNapFoglal(ido)
                    : hetNapFoglal(ido);
                idopontPanel();
            };

            box.appendChild(btn);
        }
    }
}

/******************** NAPI IDŐPONT ÁLLAPOT ********************/
function napIdoAllapot(key, ido) {
    const entry = foglalasok[key];
    if (!entry) return null;

    const isEgyedi = entry.egyedi?.includes(ido);
    const isTomeges = entry.tomeges?.includes(ido);

    if (isEgyedi && isTomeges) return "mindketto";
    if (isEgyedi) return "egyedi";
    if (isTomeges) return "tomeges";
    return null;
}

/******************** FOGLALÁS – EGYEDI NAP ********************/
function egyNapFoglal(ido) {
    const key = datumKulcs(
        aktualisNap.ev,
        aktualisNap.honap,
        aktualisNap.nap
    );

    if (!foglalasok[key]) {
        foglalasok[key] = { egyedi: [], tomeges: [] };
    }

    foglalasok[key].egyedi = foglalasok[key].egyedi || [];

    if (foglalasok[key].egyedi.includes(ido)) {
        foglalasok[key].egyedi = foglalasok[key].egyedi.filter(i => i !== ido);
    } else {
        foglalasok[key].egyedi.push(ido);
    }

    cleanupDay(key);
    debugLog();
}

/******************** FOGLALÁS – TÖMEGES (HÉTNAP) ********************/
function hetNapFoglal(ido) {
    const napok = osszesHetNap(
        aktualisNap.ev,
        aktualisNap.honap,
        aktualisHetNapIndex
    );

    napok.forEach(key => {
        if (!foglalasok[key]) {
            foglalasok[key] = { egyedi: [], tomeges: [] };
        }

        foglalasok[key].tomeges = foglalasok[key].tomeges || [];

        // csak a TÖMEGES listát toggle-öljük
        if (foglalasok[key].tomeges.includes(ido)) {
            foglalasok[key].tomeges = foglalasok[key].tomeges.filter(i => i !== ido);
        } else {
            foglalasok[key].tomeges.push(ido);
        }

        cleanupDay(key);
    });

    debugLog();
}

/******************** NAP TAKARÍTÁS ********************/
function cleanupDay(key) {
    const entry = foglalasok[key];
    if (!entry) return;

    entry.egyedi = entry.egyedi || [];
    entry.tomeges = entry.tomeges || [];

    if (entry.egyedi.length === 0 && entry.tomeges.length === 0) {
        delete foglalasok[key];
    }
}

/******************** SZÍNLOGIKA – HÉTNAP MÓD ********************/
/*
CSS classok:
- teljes-egyedi  (🟡)  minden nap EGYEDI (tomeges=0)
- foglalt        (🔴)  minden nap TÖMEGES (egyedi=0)
- vegyes         (🟣)  legalább 1 tömeges, de nem mind tiszta tömeges
*/
function hetnapIdoAllapot(ido) {
    const napok = osszesHetNap(
        aktualisNap.ev,
        aktualisNap.honap,
        aktualisHetNapIndex
    );

    const osszesNap = napok.length;

    let egyediCount = 0;
    let tomegesCount = 0;

    napok.forEach(key => {
        const entry = foglalasok[key];
        if (entry) {
            if (entry.egyedi?.includes(ido)) egyediCount++;
            if (entry.tomeges?.includes(ido)) tomegesCount++;
        }
    });
    let choice = null;
    if (egyediCount === 0 && tomegesCount === 0) {
        choice == null
    }
    else {
        // 🟡 teljesen egyedi (minden nap egyedi, tömeges nincs)
        if (egyediCount === osszesNap && tomegesCount === 0) {
            choice = "teljes-egyedi";
        }
        else {

            // 🔴 teljesen tömeges (minden nap tömeges, egyedi nincs)
            if (tomegesCount === osszesNap && egyediCount === 0) {
                choice = "foglalt";
            }
            else {

                // 🟣 vegyes: ha legalább 1 tömeges van, de nem 100% tiszta tömeges
                if (tomegesCount > 0) {
                    choice = "vegyes";
                }
            }
        }
    }

    // ha nincs tömeges, de van egyedi részlegesen -> maradjon sárga?
    // te logikád szerint a sárga csak akkor, ha MINDEN egyedi,
    // tehát részleges egyedi esetén ne legyen szín
    return choice;
}

/******************** DEBUG ********************/
function debugLog() {
    if (DEBUG) {
        console.clear();
        console.log("📅 Foglalások:", foglalasok);
    }
}

/******************** SEGÉDEK ********************/
function osszesHetNap(ev, honap, idx) {
    const result = [];
    const max = new Date(ev, honap, 0).getDate();

    for (let d = 1; d <= max; d++) {
        const date = new Date(ev, honap - 1, d);
        if ((date.getDay() + 6) % 7 === idx) {
            result.push(datumKulcs(ev, honap, d));
        }
    }
    return result;
}

function datumKulcs(ev, honap, nap) {
    return `${ev}-${String(honap).padStart(2, "0")}-${String(nap).padStart(2, "0")}`;
}
