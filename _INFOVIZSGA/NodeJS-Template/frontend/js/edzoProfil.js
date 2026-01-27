export function letrehozEdzoProfil(celElemId, adatObj) {
    const container = document.getElementById(celElemId);
    container.innerHTML = "";

    const header = document.createElement("header");
    header.classList.add("py-5", "text-center", "bg-success", "text-white", "mb-5");
    const h1 = document.createElement("h1");
    h1.classList.add("display-4", "fw-bold");
    h1.innerText = adatObj.nev;
    const Pidezet = document.createElement("p");
    Pidezet.innerText = adatObj.idezet;

    header.appendChild(h1);
    header.appendChild(Pidezet);
    container.appendChild(header);

    const mainDiv = document.createElement("div");
    mainDiv.classList.add("container");

    const row = document.createElement("div");
    row.classList.add("row", "align-items-center");

    const aKep = document.createElement("div");
    aKep.classList.add("col-lg-6", "col-md-6", "text-center", "mb-4", "mb-md-0");

    const img = document.createElement("img");
    img.src = adatObj.kep;
    img.alt = adatObj.nev;
    img.classList.add("img-fluid", "rounded", "shadow-lg", "profilKep", "border", "border-3", "border-success");

    aKep.appendChild(img);

    const colText = document.createElement("div");
    colText.classList.add("col-lg-6", "col-md-6");

    const leir = document.createElement("h2");
    leir.classList.add("text-success", "mb-3");
    leir.innerText = "Bemutatkozás";

    const pCucc = document.createElement("p");
    pCucc.classList.add("fs-5", "text-light");
    pCucc.innerText = adatObj.leiras;

    const h3 = document.createElement("h3");
    h3.classList.add("text-white", "mt-4", "h5");
    h3.innerText = "Kiemelt eredmények:";

    const lista = document.createElement("ul");
    lista.classList.add("list-group", "list-group-flush", "bg-transparent", "mb-4");

    for (let i = 0; i < adatObj.eredmenyek.length; i++) {
        const eredmeny = adatObj.eredmenyek[i];
        const li = document.createElement("li");
        li.classList.add("list-group-item", "bg-transparent", "text-white", "border-success");
        const icon = document.createElement("i");
        icon.classList.add("fas", "fa-check", "text-success", "me-2");
        const span = document.createElement("span");
        span.innerText = eredmeny;
        li.appendChild(icon);
        li.appendChild(span);
        lista.appendChild(li);
    }

    colText.appendChild(leir);
    colText.appendChild(pCucc);
    colText.appendChild(h3);
    colText.appendChild(lista);

    row.appendChild(aKep);
    row.appendChild(colText);
    mainDiv.appendChild(row);
    container.appendChild(mainDiv);
}
