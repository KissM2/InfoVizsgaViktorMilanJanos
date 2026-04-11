export function navbarGeneralas(linkek) {
    const navbarBefogo = document.createElement('div');
    navbarBefogo.id = "navbar";

    const navbar = document.createElement('div');
    navbar.classList.add("navunk", "container-fluid");

    const logoLink = document.createElement('a');
    logoLink.href = "..";
    logoLink.style.textDecoration = "none";

    const logoBefogo = document.createElement('div');
    logoBefogo.classList.add("home", "d-flex", "align-items-center");

    const logo = document.createElement('div');
    logo.classList.add("logo");
    logo.innerText = "F";
    logoBefogo.appendChild(logo);

    const logoSzoveg = document.createElement('div');
    logoSzoveg.classList.add("ms-2");
    logoSzoveg.innerText = "FITLIFE";
    logoBefogo.appendChild(logoSzoveg);

    logoLink.appendChild(logoBefogo);
    navbar.appendChild(logoLink);

    const auth = document.createElement('div');
    auth.classList.add("d-flex", "align-items-center");

    const bejelentkezes = document.createElement('a');
    bejelentkezes.href = "/bejelentkezes";
    bejelentkezes.classList.add("d-none", "d-sm-inline");

    const bejelentkezesBtn = document.createElement('button');
    bejelentkezesBtn.classList.add("gomb", "btn", "btn-secondary", "me-2");
    bejelentkezesBtn.innerText = "Bejelentkezés";
    bejelentkezes.appendChild(bejelentkezesBtn);

    const regisztralas = document.createElement('a');
    regisztralas.href = "/user_regisztral";
    regisztralas.classList.add("d-none", "d-sm-inline", "ms-2");

    const regisztralasBtn = document.createElement('button');
    regisztralasBtn.classList.add("gomb", "btn", "btn-secondary", "me-2");
    regisztralasBtn.innerText = "Regisztrálás";
    regisztralas.appendChild(regisztralasBtn);

    const menuBtn = document.createElement('button');
    menuBtn.type = "button";
    menuBtn.classList.add("navbar-toggler", "border-0", "ms-2", "bg-hover-transp");
    menuBtn.setAttribute("data-bs-toggle", "collapse");
    menuBtn.setAttribute("data-bs-target", "#fitlifeMenu");

    const menuSpan = document.createElement('span');
    menuSpan.classList.add("fas", "fa-bars", "fa-1x", "text-white");
    menuBtn.appendChild(menuSpan);

    auth.appendChild(bejelentkezes);
    auth.appendChild(regisztralas);
    auth.appendChild(menuBtn);

    navbar.appendChild(auth);

    const menuPontok = document.createElement('div');
    menuPontok.id = "fitlifeMenu";
    menuPontok.classList.add("menupontok", "collapse", "text-center", "bg-dark");

    const menuLista = document.createElement('ul');
    menuLista.classList.add("list-unstyled", "py-3", "m-0");

    for (const link of linkek) {
        const listaElem = document.createElement('li');

        const a = document.createElement("a");
        a.classList.add("nav-link", "text-white", "py-2", "font-size-medium");
        a.href = link.url;
        a.textContent = link.nev;

        listaElem.appendChild(a);
        menuLista.appendChild(listaElem);
    }

    menuPontok.appendChild(menuLista);

    navbar.appendChild(menuPontok);
    navbarBefogo.appendChild(navbar);

    //prepend az elem legelso helyere kerul
    document.body.prepend(navbarBefogo);
}

let ticking = false;
window.addEventListener("scroll", () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const navbar = document.getElementById("navbar");
            if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 10);
            ticking = false;
        });
        ticking = true;
    }
});
