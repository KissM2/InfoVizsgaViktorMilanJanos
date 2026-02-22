const receptek = [
    { nev: "Zabkása", leiras: "Zabpehely tejjel és bogyós gyümölcsökkel.", etkezes_tipus: "Reggeli", zsir: 5, protein: 12, szenhidrat: 45 },
    { nev: "Tojásrántotta", leiras: "3 tojásból készült rántotta zöldségekkel.", etkezes_tipus: "Reggeli", zsir: 15, protein: 18, szenhidrat: 2 },
    { nev: "Roston csirke", leiras: "Csirkemell rizzsel és brokkolival.", etkezes_tipus: "Ebéd", zsir: 8, protein: 35, szenhidrat: 40 },
    { nev: "Marhapörkölt", leiras: "Szaftos marhahús édesburgonyával.", etkezes_tipus: "Ebéd", zsir: 18, protein: 40, szenhidrat: 35 },
    { nev: "Lazac saláta", leiras: "Friss kevert saláta grillezett lazaccal.", etkezes_tipus: "Vacsora", zsir: 20, protein: 25, szenhidrat: 10 },
    { nev: "Túrókrém", leiras: "Zsírszegény túró natúr joghurttal.", etkezes_tipus: "Vacsora", zsir: 4, protein: 30, szenhidrat: 8 }
];

document.addEventListener("DOMContentLoaded", function () {
    const gomb = document.getElementById("generalGomb");
    gomb.addEventListener("click", generacio);
});

let hetEltolas = 0;

function generacio() {
    const teljes = document.getElementById("teljes");
    const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
    const tipusok = ["Reggeli", "Ebéd", "Vacsora"];
    const ma = new Date();
    //napindexben 0 a vasarnap es 1 a hetfo
    const napIndex = ma.getDay();
    let helyesen;
    if (napIndex == 0) {
        helyesen = -6;
    }
    else {
        helyesen = 1;
    }
    const kulon = ma.getDate() - napIndex + helyesen;
    const hetfo = new Date(ma.setDate(kulon));
    hetfo.setDate(hetfo.getDate() + (hetEltolas * 7));

    const ev = hetfo.getFullYear();
    const honap = hetfo.getMonth() + 1;
    const nap = hetfo.getDate();
    let maiNapIndex = new Date().getDay() - 1;
    if (maiNapIndex === -1){
        maiNapIndex = 6;
    } 
    const hetCim = document.createElement("h2");
    hetCim.classList.add("datum");
    hetCim.textContent = ev + ". " + honap + ". " + nap + ". hét";
    teljes.appendChild(hetCim);
    const table = document.createElement("table");
    table.classList.add("Tabla");
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");

    const thEtkezes = document.createElement("th");
    thEtkezes.classList.add("elso");
    thEtkezes.textContent = "Étkezés";
    trHead.appendChild(thEtkezes);
    for (let i = 0; i < napok.length; i++) {
        const th = document.createElement("th");
        th.classList.add("napok");
        th.textContent = napok[i];
        if (i == maiNapIndex && hetEltolas == 0) {
            th.style.color = "red";
        }
        trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    for (let i = 0; i < tipusok.length; i++) {
        const tr = document.createElement("tr");
        const tdTipus = document.createElement("td");
        tdTipus.classList.add("etkez");
        tdTipus.textContent = tipusok[i];
        tr.appendChild(tdTipus);

        const adottTipusReceptek = [];
        for (let j = 0; j < receptek.length; j++) {
            if (receptek[j].etkezes_tipus == tipusok[i]) {
                adottTipusReceptek.push(receptek[j]);
            }
        }

        for (let j = 0; j < 7; j++) {
            const rndIndex = Math.floor(Math.random() * adottTipusReceptek.length);
            const kaja = adottTipusReceptek[rndIndex];
            const td = document.createElement("td");
            td.classList.add("tdek");
            const nev = document.createElement("div");
            nev.classList.add("etelNev");
            nev.textContent = kaja.nev;
            const leiras = document.createElement("div");
            leiras.classList.add("leiras");
            leiras.textContent = kaja.leiras;
            const info = document.createElement("div");
            info.classList.add("adatok");
            info.textContent = "Protein: " + kaja.protein + "g | Szénhidrát: " + kaja.szenhidrat + "g | Zsír: " + kaja.zsir + "g";
            td.append(nev, leiras, info);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    teljes.appendChild(table);
    hetEltolas++;
}