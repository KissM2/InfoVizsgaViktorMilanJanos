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
    h3Eredmeny.classList.add("text-white", "mt-4", "h5");
    h3Eredmeny.textContent = "Kiemelt eredmények:";
    const lista = document.createElement("ul");
    lista.classList.add("list-group", "list-group-flush", "bg-transparent", "mb-4");
    adatObj.eredmenyek.forEach(eredmeny => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "bg-transparent", "text-white", "border-success");
        const icon = document.createElement("i");
        icon.classList.add("fas", "fa-check", "text-success", "me-2");
        const span = document.createElement("span");
        span.textContent = eredmeny;
        li.append(icon, span);
        lista.appendChild(li);
    });

    colText.append(leirCim, pLeiras, h3Eredmeny, lista);
    row.append(aKepCol, colText);
    mainDiv.appendChild(row);
    container.appendChild(mainDiv);
}