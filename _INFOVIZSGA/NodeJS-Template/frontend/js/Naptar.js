const napnevek = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];
const honapNevek = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];
let state = {
    ev: new Date().getFullYear(),
    honap: new Date().getMonth() + 1,
    foglalasok: {},
    egyediNapok: new Set(),
    aktualisMod: null, 
    aktualisAdat: null
};
export function naptarInit(calendarId, idopontId) {
    render(calendarId, idopontId);
}
function render(cId, iId) {
    const cContainer = document.getElementById(cId);
    const iContainer = document.getElementById(iId);
    cContainer.replaceChildren();
    const header = document.createElement("div");
    header.className = "calendar-header";
    const btnPrev = document.createElement("button");
    btnPrev.textContent = "◀";
    btnPrev.onclick = () => { valtHonap(-1); render(cId, iId); };
    const title = document.createElement("div");
    title.className = "calendar-title";
    title.textContent = `${state.ev}. ${honapNevek[state.honap - 1]}`;
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
        if (state.ev === ma.getFullYear() && state.honap === ma.getMonth() + 1 && d === ma.getDate()) {
            dDiv.classList.add("today");
        }
        dDiv.onclick = (e) => {
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
        msg.textContent = "Válassz ki egy napot vagy egy oszlopot a szerkesztéshez!";
        container.appendChild(msg);
        return;
    }

    const cim = document.createElement("h3");
    cim.textContent = state.aktualisMod === "nap"
        ? `${state.ev}. ${state.honap}. ${state.aktualisAdat}.`
        : `${napnevek[state.aktualisAdat]} napok beállítása`;
    container.appendChild(cim);

    const grid = document.createElement("div");
    grid.className = "time-grid";

    for (let h = 8; h < 20; h++) {
        ["00", "30"].forEach(m => {
            const ido = `${h}:${m}`;
            const btn = document.createElement("button");
            btn.className = "idopontBtn";
            btn.textContent = ido;
            btn.onclick = () => {
                btn.classList.toggle("foglalt");
            };

            grid.appendChild(btn);
        });
    }
    container.appendChild(grid);
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