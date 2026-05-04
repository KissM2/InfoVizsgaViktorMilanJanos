import { deleteKeres, getKeres, postApi } from '../js/kozosFetch.js';
import { navbarGeneralas } from './navbar.js';
import { footerGeneralas } from './footer.js';

const menuLinkek = [
    { nev: "Személyi edzők", url: "../html/osszesEdzo.html" },
    { nev: "Edzéstervek", url: "../html/edzesterv.html" }
];

let currentHetiResz = null;
let allReceptek = [];

document.addEventListener("DOMContentLoaded", async function () {
    footerGeneralas();
    navbarGeneralas(menuLinkek);
    vezerloSavKeszites();
    savedEtrendekGeneralas();
    alapTablaGeneralas();
    await loadAllReceptek();
    await loadSavedEtrendek();
});

function szamolKcal(protein, szenhidrat, zsir) {
    return (protein * 4) + (szenhidrat * 4) + (zsir * 9);
}

function vezerloSavKeszites() {
    const teljes = document.getElementById("teljes");

    const sav = document.createElement("div");
    sav.classList.add("vezerlo-sav");

    const ujHetBtn = document.createElement("button");
    ujHetBtn.textContent = "Új hét (Üres tábla)";
    ujHetBtn.addEventListener("click", alapTablaGeneralas);

    sav.appendChild(ujHetBtn);
    teljes.appendChild(sav);
}

function savedEtrendekGeneralas() {
    const teljes = document.getElementById("teljes");

    const savedSection = document.createElement("div");
    savedSection.id = "savedEtrendek";
    savedSection.classList.add("saved-ettrendek");

    const title = document.createElement("h3");
    title.textContent = "Étrendek";
    savedSection.appendChild(title);

    const list = document.createElement("div");
    list.id = "savedEtrendekLista";
    savedSection.appendChild(list);

    teljes.appendChild(savedSection);
}

function loadSavedEtrendIntoEditor(csoport) {
    if (!currentHetiResz || !document.body.contains(currentHetiResz)) {
        alapTablaGeneralas();
    }

    const table = currentHetiResz?.querySelector("table");
    if (!table) {
        return;
    }

    currentHetiResz.hetiEtrend = csoport.hetiEtrend;
    currentHetiResz.csoportId = csoport.csoport_id;

    tablaTorles(table);
    hetiEtrendKirajzolas(table, csoport.hetiEtrend);
}

async function loadSavedEtrendek() {
    const list = document.getElementById("savedEtrendekLista");
    list.innerHTML = "";

    try {
        const hetiEtrendek = await getKeres("/api/getHetiEtrendek");

        if (!Array.isArray(hetiEtrendek) || hetiEtrendek.length === 0) {
            return;
        }

        for (let i = 0; i < hetiEtrendek.length; i++) {
            const csoport = hetiEtrendek[i];
            list.appendChild(createSavedEtrendCard(csoport, i + 1));
        }
    } catch (error) {
        console.error(error);
        list.textContent = "Hiba történt a mentett étrendek betöltése közben.";
    }
}

function createHetiEtrendTable() {
    const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
    const tipusok = ["reggeli", "ebed", "vacsora", "csemege"];

    const container = document.createElement("div");
    container.classList.add("tabla-container");

    const table = document.createElement("table");
    table.classList.add("tabla");

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");

    const thUres = document.createElement("th");
    trHead.appendChild(thUres);

    for (let i = 0; i < napok.length; i++) {
        const th = document.createElement("th");
        const napKozpont = document.createElement("div");
        const eroNap = document.createElement("strong");
        eroNap.textContent = napok[i];
        napKozpont.appendChild(eroNap);
        th.appendChild(napKozpont);
        trHead.appendChild(th);
    }

    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    for (let i = 0; i < tipusok.length; i++) {
        const tr = document.createElement("tr");
        const tdTipus = document.createElement("td");
        tdTipus.textContent = tipusok[i];
        tr.appendChild(tdTipus);

        for (let j = 0; j < 7; j++) {
            const td = document.createElement("td");
            td.classList.add("kaja-cella");
            td.dataset.nap = j;
            td.dataset.tipus = tipusok[i];
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    container.appendChild(table);
    return container;
}

function createSavedEtrendCard(csoport, index) {
    const card = document.createElement("div");
    card.classList.add("saved-ettrend-card", "mb-4", "p-0", "rounded");
    card.csoportId = csoport.csoport_id;
    card.hetiEtrend = csoport.hetiEtrend;

    const header = document.createElement("div");
    header.classList.add("het-fejlec");

    const title = document.createElement("h3");
    title.textContent = `Mentett étrend #${index}`;

    const actions = document.createElement("div");
    actions.classList.add("het-vezerlok");

    const genBtn = document.createElement("button");
    genBtn.type = "button";
    genBtn.classList.add("btn-gen-het");
    genBtn.textContent = "Hét generálása";
    genBtn.addEventListener("click", function () {
        const table = card.querySelector("table");
        if (table) {
            hetiEtrendGeneralasBackendrolForCard(table, card);
        }
    });

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.classList.add("btn-mentes-het");
    saveBtn.textContent = "Heti étrend mentése";
    saveBtn.addEventListener("click", function () {
        hetiEtrendMenteseForCard(card);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add("btn-torol-het");
    deleteBtn.textContent = "Hét eltávolítása";
    deleteBtn.addEventListener("click", async function () {
        if (!confirm("Biztosan törlöd ezt az étrendet?")) {
            return;
        }
        await deleteSavedEtrend(card.csoportId, card);
    });

    actions.append(genBtn, saveBtn, deleteBtn);
    header.append(title, actions);
    card.appendChild(header);

    const tableWrapper = createHetiEtrendTable();
    const table = tableWrapper.querySelector("table");
    if (table) {
        hetiEtrendKirajzolas(table, card.hetiEtrend);
    }
    card.appendChild(tableWrapper);

    return card;
}

async function deleteSavedEtrend(csoportId, card) {
    try {
        deleteKeres(`/api/deleteHetiEtrend?csoport_id=${csoportId}`);

        card.remove();
        alert("A mentett étrend törölve lett.");
    } catch (error) {
        console.error(error);
        alert("Hiba történt a mentett étrend törlése közben.");
    }
}

async function hetiEtrendGeneralasBackendrolForCard(table, card) {
    try {
        const response = await fetch("/api/generateHetiEtrend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        if (!response.ok) {
            console.error(data.message);
            alert(data.message || "Nem sikerült legenerálni az étrendet.");
            return;
        }

        card.hetiEtrend = data.hetiEtrend;
        tablaTorles(table);
        hetiEtrendKirajzolas(table, data.hetiEtrend);
    } catch (error) {
        console.error(error);
        alert("Hiba történt az étrend generálása közben.");
    }
}

async function hetiEtrendMenteseForCard(card) {
    try {
        const hetiEtrend = card.hetiEtrend;

        if (!hetiEtrend) {
            alert("Előbb generálj egy heti étrendet.");
            return;
        }

        const data = await postApi("/api/saveHetiEtrend", { hetiEtrend: hetiEtrend, csoport_id: card.csoportId || null});

        card.csoportId = data.csoport_id;
        alert("Heti étrend sikeresen mentve.");
        await loadSavedEtrendek();
    } catch (error) {
        console.error(error);
        alert("Hiba történt a mentés közben.");
    }
}

function alapTablaGeneralas() {
    const teljes = document.getElementById("teljes");

    const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
    const tipusok = ["reggeli", "ebed", "vacsora", "csemege"];

    const hetiResz = document.createElement("div");
    hetiResz.classList.add("heti-resz");

    const existingHet = document.querySelector(".heti-resz");
    if (existingHet) {
        existingHet.remove();
    }

    const hetFejlec = document.createElement("div");
    hetFejlec.classList.add("het-fejlec");

    const h3 = document.createElement("h3");
    h3.textContent = "Heti étrend";

    const vezerloGombok = document.createElement("div");
    vezerloGombok.classList.add("het-vezerlok");

    const genBtn = document.createElement("button");
    genBtn.textContent = "Hét generálása";
    genBtn.classList.add("btn-gen-het");

    const mentesBtn = document.createElement("button");
    mentesBtn.textContent = "Heti étrend mentése";
    mentesBtn.classList.add("btn-mentes-het");

    const torolBtn = document.createElement("button");
    torolBtn.textContent = "Hét eltávolítása";
    torolBtn.classList.add("btn-torol-het");

    vezerloGombok.append(genBtn, mentesBtn, torolBtn);
    hetFejlec.append(h3, vezerloGombok);
    hetiResz.appendChild(hetFejlec);

    const container = document.createElement("div");
    container.classList.add("tabla-container");

    const table = document.createElement("table");
    table.classList.add("tabla");

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");

    const thUres = document.createElement("th");
    trHead.appendChild(thUres);

    for (let i = 0; i < napok.length; i++) {
        const th = document.createElement("th");

        const napKozpont = document.createElement("div");
        const eroNap = document.createElement("strong");

        eroNap.textContent = napok[i];

        napKozpont.appendChild(eroNap);
        th.appendChild(napKozpont);
        trHead.appendChild(th);
    }

    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    for (let i = 0; i < tipusok.length; i++) {
        const tr = document.createElement("tr");

        const tdTipus = document.createElement("td");
        tdTipus.textContent = tipusok[i];

        tr.appendChild(tdTipus);

        for (let j = 0; j < 7; j++) {
            const td = document.createElement("td");
            td.classList.add("kaja-cella");
            td.dataset.nap = j;
            td.dataset.tipus = tipusok[i];
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    container.appendChild(table);
    hetiResz.appendChild(container);
    teljes.appendChild(hetiResz);

    currentHetiResz = hetiResz;
    currentHetiResz.csoportId = null;
    currentHetiResz.hetiEtrend = null;

    genBtn.addEventListener("click", async function () {
        await hetiEtrendGeneralasBackendrol(table, hetiResz);
    });

    mentesBtn.addEventListener("click", async function () {
        await hetiEtrendMentese(hetiResz);
    });

    torolBtn.addEventListener("click", async function () {
        alapTablaGeneralas();
    });
}

async function hetiEtrendGeneralasBackendrol(table, hetiResz) {
    try {
        const response = await fetch("/api/generateHetiEtrend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data.message);
            alert(data.message || "Nem sikerült legenerálni az étrendet.");
            return;
        }

        hetiResz.hetiEtrend = data.hetiEtrend;

        tablaTorles(table);
        hetiEtrendKirajzolas(table, data.hetiEtrend);

    } catch (error) {
        console.error(error);
        alert("Hiba történt az étrend generálása közben.");
    }
}

async function hetiEtrendMentese(hetiResz) {
    try {
        const hetiEtrend = hetiResz.hetiEtrend;

        if (!hetiEtrend) {
            alert("Előbb generálj egy heti étrendet.");
            return;
        }

        const data = await postApi("/api/saveHetiEtrend", { hetiEtrend: hetiEtrend, csoport_id: hetiResz.csoportId || null});

        hetiResz.csoportId = data.csoport_id;
        alert("Heti étrend sikeresen mentve.");
        await loadSavedEtrendek();
        clearEditorTable(hetiResz);

    } catch (error) {
        console.error(error);
        alert("Hiba történt a mentés közben.");
    }
}

function clearEditorTable(hetiResz) {
    const table = hetiResz.querySelector("table");
    if (table) {
        tablaTorles(table);
    }
    hetiResz.hetiEtrend = null;
    hetiResz.csoportId = null;
}

async function hetiEtrendTorles(hetiResz) {
    try {
        const csoportId = hetiResz.csoportId || null;
        const url = csoportId ? `/api/deleteHetiEtrend?csoport_id=${csoportId}` : "/api/deleteHetiEtrend";

        deleteKeres(url);

        hetiResz.remove();
        currentHetiResz = null;
        await loadSavedEtrendek();
        alert("Heti étrend sikeresen törölve.");
    } catch (error) {
        console.error(error);
        alert("Hiba történt a törlés közben.");
    }
}

function tablaTorles(table) {
    const cellak = table.querySelectorAll(".kaja-cella");

    for (let i = 0; i < cellak.length; i++) {
        while (cellak[i].firstChild) {
            cellak[i].removeChild(cellak[i].firstChild);
        }
    }
}

function hetiEtrendKirajzolas(table, hetiEtrend) {
    for (let napIndex = 0; napIndex < hetiEtrend.length; napIndex++) {
        const napiEtrend = hetiEtrend[napIndex];

        for (let i = 0; i < napiEtrend.etkezesek.length; i++) {
            const etkezes = napiEtrend.etkezesek[i];

            const celCella = table.querySelector(
                `.kaja-cella[data-nap="${napIndex}"][data-tipus="${etkezes.etkezes_tipus}"]`
            );

            if (celCella && etkezes.recept) {
                celCella.appendChild(kajaKartyaKeszites(etkezes.recept, celCella));
            }
        }
    }
}

function kajaKartyaKeszites(kaja, cell) {
    const doboz = document.createElement("div");
    doboz.classList.add("kaja-kartya", "mt-2");
    doboz.dataset.receptId = kaja.recept_id;

    const header = document.createElement("div");
    header.classList.add("kaja-kartya-header");

    const nev = document.createElement("div");
    nev.classList.add("etelNev");
    nev.textContent = kaja.nev;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add("recept-delete-btn");
    deleteBtn.textContent = "×";
    deleteBtn.addEventListener("pointerdown", function (event) {
        event.stopPropagation();
    }, { capture: true });
    deleteBtn.addEventListener("mousedown", function (event) {
        event.stopPropagation();
    }, { capture: true });
    deleteBtn.addEventListener("click", async function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        await replaceRecipeWithSelect(cell);
    }, { capture: true });

    header.appendChild(nev);
    header.appendChild(deleteBtn);

    const body = document.createElement("div");
    body.classList.add("kaja-kartya-body");
    body.setAttribute("data-bs-toggle", "modal");
    body.setAttribute("data-bs-target", "#receptModal");
    body.addEventListener("click", function () {
        document.getElementById("receptModalLabel").textContent = kaja.nev + " elkészítése!";

        const modalContent = document.getElementById("receptModalContent");
        modalContent.innerHTML = "";

        if (kaja.leiras) {
            const leiras = kaja.leiras.split(".");

            for (let i = 0; i < leiras.length; i++) {
                if (leiras[i].trim() !== "") {
                    modalContent.textContent += leiras[i].trim() + ".\n";
                }
            }
        }
    });

    const kcalValue = szamolKcal(kaja.protein, kaja.szenhidrat, kaja.zsir);

    const badge = document.createElement("div");
    badge.classList.add("kcal-badge");
    badge.textContent = kcalValue + " kcal";

    const info = document.createElement("div");
    info.classList.add("adatok");
    info.textContent =
        "P: " + kaja.protein + "g | Sz: " + kaja.szenhidrat + "g | Zs: " + kaja.zsir + "g";

    body.appendChild(badge);
    body.appendChild(info);

    doboz.appendChild(header);
    doboz.appendChild(body);

    return doboz;
}

async function loadAllReceptek() {
    try {
        allReceptek = await getKeres('/api/receptek') || [];
    } catch (error) {
        console.error('Receptek betöltése sikertelen:', error);
        allReceptek = [];
    }
}

async function replaceRecipeWithSelect(cell) {
    if (allReceptek.length === 0) {
        await loadAllReceptek();
    }

    while (cell.firstChild) {
        cell.removeChild(cell.firstChild);
    }

    const select = document.createElement("select");
    select.classList.add("recept-valaszto");

    const tipus = cell.dataset.tipus;

    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = `Válassz ${tipus} receptet`;
    select.appendChild(defaultOpt);

    const filtered = allReceptek.filter((recept) => recept.etkezes_tipus === tipus);
    if (filtered.length === 0) {
        const emptyOpt = document.createElement("option");
        emptyOpt.value = "";
        emptyOpt.textContent = `Nincsenek ${tipus} receptek`;
        emptyOpt.disabled = true;
        select.appendChild(emptyOpt);
    } else {
        filtered.forEach((recept) => {
            const opt = document.createElement("option");
            opt.value = recept.recept_id;
            opt.textContent = `${recept.nev} (${recept.etkezes_tipus})`;
            select.appendChild(opt);
        });
    }

    select.addEventListener("change", function () {
        const selectedId = Number(select.value);
        const selectedRecipe = allReceptek.find((r) => r.recept_id === selectedId);
        if (!selectedRecipe) {
            return;
        }

        cell.innerHTML = "";
        cell.appendChild(kajaKartyaKeszites(selectedRecipe, cell));
        updateEtrendCellData(cell, selectedRecipe);
    });

    cell.appendChild(select);
}

function updateEtrendCellData(cell, recept) {
    const napIndex = Number(cell.dataset.nap);
    const tipus = cell.dataset.tipus;

    const wrapper = cell.closest(".heti-resz") || cell.closest(".saved-ettrend-card");
    const hetiEtrend = wrapper?.hetiEtrend;
    if (!Array.isArray(hetiEtrend)) {
        return;
    }

    const napiEtrend = hetiEtrend[napIndex];
    if (!napiEtrend) {
        return;
    }

    let etkezes = napiEtrend.etkezesek.find((e) => e.etkezes_tipus === tipus);
    if (!etkezes) {
        etkezes = { etkezes_tipus: tipus, recept };
        napiEtrend.etkezesek.push(etkezes);
    } else {
        etkezes.recept = recept;
    }
}
