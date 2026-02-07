const napnevek = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];
const honapNevek = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];

let state = {
    ev: new Date().getFullYear(),
    honap: new Date().getMonth() + 1,
    foglalasok: {},
    aktualisMod: null, 
    aktualisAdat: null
};

export function naptarInit(calendarId, idopontId) {
    render(calendarId, idopontId);
}

function render(cId, iId) {
    const cContainer = document.getElementById(cId);
    cContainer.replaceChildren();
    const header = document.createElement("div");
    header.className = "calendar-header";
    
    const btnPrev = document.createElement("button");
    btnPrev.textContent = "◀";
    btnPrev.onclick = () => { valtHonap(-1); render(cId, iId); };
    
    const title = document.createElement("div");
    title.className = "calendar-title";
    title.textContent = `${state.ev}. ${honapNevek[state.honap-1]}`;
    
    const btnNext = document.createElement("button");
    btnNext.textContent = "▶";
    btnNext.onclick = () => { valtHonap(1); render(cId, iId); };
    
    header.append(btnPrev, title, btnNext);
    

    const grid = document.createElement("div");
    grid.className = "naptar-grid";
    
    napnevek.forEach((nev, idx) => {
        const h = document.createElement("div");
        h.className = "hetnap";
        h.textContent = nev;
        h.onclick = () => {
            selectHeader(idx);
            renderIdopontok(iId);
        };
        grid.appendChild(h);
    });
    
    const firstDay = (new Date(state.ev, state.honap - 1, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(state.ev, state.honap, 0).getDate();
    
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "day noDay";
        grid.appendChild(empty);
    }
    
    const ma = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
        const dDiv = document.createElement("div");
        dDiv.className = "day";
        dDiv.textContent = d;
        
        if (state.ev === ma.getFullYear() && state.honap === ma.getMonth()+1 && d === ma.getDate()) {
            dDiv.classList.add("today");
        }
        
        dDiv.onclick = () => {
            document.querySelectorAll(".day, .hetnap").forEach(el => el.classList.remove("selected-day", "selected-hetnap"));
            dDiv.classList.add("selected-day");
            state.aktualisMod = "nap";
            state.aktualisAdat = d;
            renderIdopontok(iId);
        };
        grid.appendChild(dDiv);
    }
    
    cContainer.append(header, grid);
    renderIdopontok(iId);
}

function renderIdopontok(iId) {
    const container = document.getElementById(iId);
    container.replaceChildren();
    
    if (!state.aktualisMod) {
        const msg = document.createElement("div");
        msg.className = "empty-msg";
        msg.textContent = "Válassz ki egy napot vagy oszlopot!";
        container.appendChild(msg);
        return;
    }

    const cim = document.createElement("h3");
    cim.textContent = state.aktualisMod === "nap" 
        ? `${state.ev}. ${state.honap}. ${state.aktualisAdat}. – egyedi nap` 
        : `${napnevek[state.aktualisAdat]} napok tömeges szerkesztése`;
    container.appendChild(cim);

    const grid = document.createElement("div");
    grid.className = "time-grid";

    for (let h = 8; h < 20; h++) {
        ["00", "30"].forEach(m => {
            const ido = `${String(h).padStart(2, "0")}:${m}`;
            const btn = document.createElement("button");
            btn.className = "idopontBtn";
            btn.textContent = ido;
            
            if (state.aktualisMod === "nap") {
                const key = datumKulcs(state.ev, state.honap, state.aktualisAdat);
                const status = napIdoAllapot(key, ido);
                if (status) btn.classList.add(status);
            } else {
                const status = hetnapIdoAllapot(ido);
                if (status) btn.classList.add(status);
            }

            btn.onclick = () => {
                if (state.aktualisMod === "nap") egyNapFoglal(ido);
                else hetNapFoglal(ido);
                renderIdopontok(iId);
            };
            
            grid.appendChild(btn);
        });
    }
    container.appendChild(grid);
}

function napIdoAllapot(key, ido) {
    const entry = state.foglalasok[key];
    if (!entry) return null;
    if (entry.egyedi?.includes(ido) && entry.tomeges?.includes(ido)) return "mindketto"; 
    if (entry.egyedi?.includes(ido)) return "teljes-egyedi";
    if (entry.tomeges?.includes(ido)) return "foglalt";
    return null;
}

function hetnapIdoAllapot(ido) {
    const napok = osszesHetNap(state.ev, state.honap, state.aktualisAdat);
    let egyediCount = 0;
    let tomegesCount = 0;

    napok.forEach(key => {
        const entry = state.foglalasok[key];
        if (entry) {
            if (entry.egyedi?.includes(ido)) egyediCount++;
            if (entry.tomeges?.includes(ido)) tomegesCount++;
        }
    });

    if (egyediCount === 0 && tomegesCount === 0) return null;
    if (egyediCount === napok.length && tomegesCount === 0) return "teljes-egyedi"; 
    if (tomegesCount === napok.length && egyediCount === 0) return "foglalt"; 
    if (tomegesCount > 0) return "vegyes"; 
    return null;
}

function egyNapFoglal(ido) {
    const key = datumKulcs(state.ev, state.honap, state.aktualisAdat);
    if (!state.foglalasok[key]) state.foglalasok[key] = { egyedi: [], tomeges: [] };
    
    const list = state.foglalasok[key].egyedi;
    const idx = list.indexOf(ido);
    if (idx > -1) list.splice(idx, 1);
    else list.push(ido);
    
    cleanupDay(key);
}

function hetNapFoglal(ido) {
    const napok = osszesHetNap(state.ev, state.honap, state.aktualisAdat);
    napok.forEach(key => {
        if (!state.foglalasok[key]) state.foglalasok[key] = { egyedi: [], tomeges: [] };
        const list = state.foglalasok[key].tomeges;
        const idx = list.indexOf(ido);
        if (idx > -1) list.splice(idx, 1);
        else list.push(ido);
        cleanupDay(key);
    });
}


function cleanupDay(key) {
    const e = state.foglalasok[key];
    if (e && e.egyedi.length === 0 && e.tomeges.length === 0) delete state.foglalasok[key];
}

function osszesHetNap(ev, honap, idx) {
    const res = [];
    const max = new Date(ev, honap, 0).getDate();
    for (let d = 1; d <= max; d++) {
        if ((new Date(ev, honap - 1, d).getDay() + 6) % 7 === idx) res.push(datumKulcs(ev, honap, d));
    }
    return res;
}

function datumKulcs(ev, honap, nap) {
    return `${ev}-${String(honap).padStart(2, "0")}-${String(nap).padStart(2, "0")}`;
}

function valtHonap(irany) {
    state.honap += irany;
    if (state.honap > 12) { state.honap = 1; state.ev++; }
    if (state.honap < 1) { state.honap = 12; state.ev--; }
    state.aktualisMod = null;
}

function selectHeader(idx) {
    document.querySelectorAll(".day, .hetnap").forEach(el => el.classList.remove("selected-day", "selected-hetnap"));
    document.querySelectorAll(".hetnap")[idx].classList.add("selected-hetnap");
    state.aktualisMod = "hetnap";
    state.aktualisAdat = idx;
}