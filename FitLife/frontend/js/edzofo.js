document.addEventListener("DOMContentLoaded", function () {
    generalWeek();
});

const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

let currentDate = new Date();

function getWeekStart(date) {
    let d = new Date(date);
    let day = d.getDay();
    let diff = d.getDate() - (day === 0 ? 6 : day - 1);
    return new Date(d.setDate(diff));
}

function formatDate(d) {
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

function generalWeek() {
    const container = document.getElementById("naptar");
    container.innerHTML = "";

    let weekStart = getWeekStart(currentDate);

    let header = document.createElement("div");
    header.classList.add("naptarFejlec");

    let prev = document.createElement("button");
    prev.innerText = "<";

    let next = document.createElement("button");
    next.innerText = ">";

    let title = document.createElement("span");

    let weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    title.innerText = `${weekStart.getFullYear()} | ${formatDate(weekStart)} - ${formatDate(weekEnd)}`;

    header.appendChild(prev);
    header.appendChild(title);
    header.appendChild(next);

    container.appendChild(header);

    /* ===== GRID ===== */
    const grid = document.createElement("div");
    grid.classList.add("week-grid");

    /* ===== FEJLÉC ===== */
    for (let i = 0; i < 7; i++) {
        let d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);

        let cell = document.createElement("div");
        cell.classList.add("cell", "head");
        cell.innerText = napok[i] + "\n" + (d.getMonth() + 1) + "." + d.getDate();

        grid.appendChild(cell);
    }

    /* ===== IDŐK ===== */
    for (let perc = 0; perc < 24 * 60; perc += 30) {

        for (let i = 0; i < 7; i++) {
            let ora = Math.floor(perc / 60);
            let p = perc % 60;

            let ido = `${String(ora).padStart(2, "0")}:${String(p).padStart(2, "0")}`;

            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.innerText = ido;

            grid.appendChild(cell);
        }
    }

    const scroll = document.createElement("div");
    scroll.classList.add("week-scroll");
    scroll.appendChild(grid);

    container.appendChild(scroll);

    prev.onclick = () => {
        currentDate.setDate(currentDate.getDate() - 7);
        generalWeek();
    };

    next.onclick = () => {
        currentDate.setDate(currentDate.getDate() + 7);
        generalWeek();
    };
}