import {getKeres} from '../js/kozosFetch.js';

export async function navbarGeneralas(linkek) {
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

    const profilLink = document.createElement('a');
    profilLink.classList.add("d-none", "d-sm-inline", "ms-2");
    profilLink.style.textDecoration = "none";
    profilLink.style.display = "none";

    const profilBtn = document.createElement('button');
    profilBtn.classList.add("gomb", "btn", "btn-secondary", "me-2");
    profilBtn.innerText = "Profil";
    profilBtn.style.display = "none";
    profilLink.appendChild(profilBtn);

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
    auth.appendChild(profilLink)
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

    const vonalElem = document.createElement('li');
    vonalElem.classList.add("d-sm-none");

    const vonal = document.createElement('hr');
    vonal.classList.add("text-white", "mx-5");
    vonalElem.appendChild(vonal);

    const bejelentkezesTeloElem = document.createElement('li');
    bejelentkezesTeloElem.classList.add("d-sm-none");

    const bejelentkezesTeloLink = document.createElement('a');
    bejelentkezesTeloLink.href = "/bejelentkezes";
    bejelentkezesTeloLink.classList.add("nav-link", "text-white", "py-2", "font-size-medium")
    bejelentkezesTeloLink.innerText = "Bejelentkezés";
    bejelentkezesTeloElem.appendChild(bejelentkezesTeloLink);

    const regisztralasTeloElem = document.createElement('li');
    regisztralasTeloElem.classList.add("d-sm-none");

    const regisztralasTeloLink = document.createElement('a');
    regisztralasTeloLink.href = "/user_regisztral";
    regisztralasTeloLink.classList.add("nav-link", "text-white", "py-2", "font-size-medium")
    regisztralasTeloLink.innerText = "Regisztrálás";
    regisztralasTeloElem.appendChild(regisztralasTeloLink);
    
    const profilTeloElem = document.createElement('li');
    profilTeloElem.classList.add("d-sm-none");
    profilTeloElem.style.display = "none";

    const profilTeloLink = document.createElement('a');
    profilTeloLink.classList.add("nav-link", "text-white", "py-2", "font-size-medium")
    profilTeloLink.innerText = "Profil";
    profilTeloElem.appendChild(profilTeloLink);

    menuLista.appendChild(vonalElem);
    menuLista.appendChild(bejelentkezesTeloElem);
    menuLista.appendChild(regisztralasTeloElem);
    menuLista.appendChild(profilTeloElem);

    //még nincs meg az api végpont
    //const bejelentkezve = await getKeres('/api/bejelentkezve');
    const bejelentkezve = {
        role: "teszt",
        id: "teszt"
    };
    if(bejelentkezve && bejelentkezve.role && bejelentkezve.id){
        bejelentkezesBtn.style.display = "none";
        regisztralasBtn.style.display = "none";
        bejelentkezesTeloElem.style.display = "none";
        regisztralasTeloElem.style.display = "none";
        profilBtn.style.display = "block";
        profilLink.style.display = "block";
        profilTeloElem.style.display = "block";
        if(bejelentkezve.role == "felhasználó"){    
            //még nincs profil oldala a felhasználónak és az edzőnek

            //profilTeloLink.href = "/user_profil?id=" + bejelentkezve.id;
            //profilLink.href = "/user_profil?id=" + bejelentkezve.id;
        }else{
            if(bejelentkezve.role == "edző"){
                //még nincs profil oldala a felhasználónak és az edzőnek

                //profilTeloLink.href = "/edzo_profil?id=" + bejelentkezve.id;
                //profilLink.href = "/edzo_profil?id=" + bejelentkezve.id;
            }
        }
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
