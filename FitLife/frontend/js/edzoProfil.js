export function letrehozEdzoProfil(celElemId, adatObj) {
    const container = document.getElementById(celElemId);
    container.replaceChildren();
    const hero = document.createElement("header");
    hero.classList.add("hero-section", "bg-success", "text-white");
    const h1 = document.createElement("h1");
    h1.classList.add("display-4", "fw-bold");
    h1.textContent = adatObj.nev;
    const pIdezet = document.createElement("p");
    pIdezet.classList.add("fs-5", "mt-2");
    pIdezet.textContent = adatObj.idezet;

    hero.append(h1, pIdezet);
    container.appendChild(hero);

    const mainDiv = document.createElement("div");
    mainDiv.classList.add("container", "mt-5");
    const row = document.createElement("div");
    row.classList.add("row", "align-items-center");
    const aKepCol = document.createElement("div");
    aKepCol.classList.add("col-lg-6", "col-md-6", "text-center", "mb-4", "mb-md-0");
    const img = document.createElement("img");
    img.src = adatObj.kep;
    img.alt = adatObj.nev;
    img.classList.add("img-fluid", "rounded", "shadow-lg", "profilKep", "border", "border-3", "border-success");
    aKepCol.appendChild(img);
    const colText = document.createElement("div");
    colText.classList.add("col-lg-6", "col-md-6");
    const leirCim = document.createElement("h2");
    leirCim.classList.add("text-success", "mb-3");
    leirCim.textContent = "Bemutatkozás";
    const pLeiras = document.createElement("p");
    pLeiras.classList.add("fs-5", "text-light");
    pLeiras.textContent = adatObj.leiras;
    const h3Eredmeny = document.createElement("h3");
    h3Eredmeny.classList.add("text-white", "mt-4", "mb-3", "h5");
    h3Eredmeny.textContent = "További információk:";
    const lista = document.createElement("ul");
    lista.classList.add("list-group", "list-group-flush", "bg-transparent", "mb-4");
    adatObj.eredmenyek.forEach(eredmeny => {
        const li = document.createElement("li");
        li.classList.add("mb-4", "d-flex", "align-items-start");
        const kettospontIndex = eredmeny.indexOf(':');
        let cimkeStr = eredmeny;
        let ertekStr = "";

        if (kettospontIndex !== -1) {
            cimkeStr = eredmeny.substring(0, kettospontIndex + 1);
            ertekStr = eredmeny.substring(kettospontIndex + 1).trim();
        }
        let iconClass = "fa-check";
        let iconColor = "text-success";
        if (cimkeStr.includes("Email")) {
            iconClass = "fa-envelope";
        } 
        else if (cimkeStr.includes("Telefon")) {
            iconClass = "fa-phone";
        } 
        else if (cimkeStr.includes("Átlagos")) {
            iconClass = "fa-star";
            iconColor = "text-warning";
        }
        const icon = document.createElement("i");
        icon.classList.add("fas", iconClass, iconColor, "me-3", "mt-1");
        const szovegBefogo = document.createElement("div");
        const strongCimke = document.createElement("strong");
        strongCimke.classList.add("text-white");
        strongCimke.textContent = cimkeStr + " ";
        const spanErtek = document.createElement("span");
        spanErtek.classList.add("text-light");
        spanErtek.textContent = ertekStr;
        szovegBefogo.append(strongCimke, spanErtek);
        li.append(icon, szovegBefogo);
        lista.appendChild(li);
    });

    colText.append(leirCim, pLeiras, h3Eredmeny, lista);
    row.append(aKepCol, colText);
    mainDiv.appendChild(row);
    container.appendChild(mainDiv);
}