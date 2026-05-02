import {getKeres,postApi} from '../js/kozosFetch.js';

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

    // Bejelentkezés gomb
    const bejelentkezes = document.createElement('a');
    bejelentkezes.href = "/bejelentkezes";
    bejelentkezes.classList.add("d-none", "d-sm-inline");

    const bejelentkezesBtn = document.createElement('button');
    bejelentkezesBtn.classList.add("gomb", "btn", "btn-secondary", "me-2");
    bejelentkezesBtn.innerText = "Bejelentkezés";
    bejelentkezes.appendChild(bejelentkezesBtn);

    // Regisztrálás gomb
    const regisztralas = document.createElement('a');
    regisztralas.href = "/user_regisztral";
    regisztralas.classList.add("d-none", "d-sm-inline", "ms-2");

    const regisztralasBtn = document.createElement('button');
    regisztralasBtn.classList.add("gomb", "btn", "btn-secondary", "me-2");
    regisztralasBtn.innerText = "Regisztrálás";
    regisztralas.appendChild(regisztralasBtn);

    // Profil gomb
    const profilLink = document.createElement('a');
    profilLink.classList.add("d-none", "ms-2");
    profilLink.style.textDecoration = "none";

    const profilBtn = document.createElement('button');
    profilBtn.classList.add("gomb", "btn", "btn-secondary", "me-2");
    profilBtn.innerText = "Profil";
    profilLink.appendChild(profilBtn);

    // kijelentkezes gomb
    const kijelentkezesBtn = document.createElement('button');
    kijelentkezesBtn.classList.add("btn", "gomb", "gomb-piros", "ms-2", "d-none");
    kijelentkezesBtn.innerText = "Kijelentkezés";


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
    auth.appendChild(kijelentkezesBtn);
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
    profilTeloElem.classList.add("d-none");

    const profilTeloLink = document.createElement('a');
    profilTeloLink.classList.add("nav-link", "text-white", "py-2", "font-size-medium")
    profilTeloLink.innerText = "Profil";
    profilTeloElem.appendChild(profilTeloLink);

    const kijelentkezesTeloElem = document.createElement('li');
    kijelentkezesTeloElem.classList.add("d-none");
    
    const kijelentkezesTeloLink = document.createElement('a');
    kijelentkezesTeloLink.href = "#";
    kijelentkezesTeloLink.classList.add("nav-link", "text-danger", "py-2", "font-size-medium");
    kijelentkezesTeloLink.innerText = "Kijelentkezés";
    kijelentkezesTeloElem.appendChild(kijelentkezesTeloLink);

    menuLista.appendChild(vonalElem);
    menuLista.appendChild(bejelentkezesTeloElem);
    menuLista.appendChild(regisztralasTeloElem);
    menuLista.appendChild(profilTeloElem);
    menuLista.appendChild(kijelentkezesTeloElem);

    const bejelentkezve = await getKeres('/api/getLoginStatus');
    if(bejelentkezve && bejelentkezve.role && bejelentkezve.id){

        bejelentkezes.classList.replace("d-sm-inline", "d-none");
        regisztralas.classList.replace("d-sm-inline", "d-none");
        bejelentkezesTeloElem.classList.replace("d-sm-none", "d-none");
        regisztralasTeloElem.classList.replace("d-sm-none", "d-none");
        
        profilLink.classList.add("d-sm-inline"); 
        profilTeloElem.classList.replace("d-none", "d-sm-none");
         
        kijelentkezesBtn.classList.add("d-sm-inline");
        kijelentkezesTeloElem.classList.replace("d-none", "d-sm-none");

        if(bejelentkezve.role == "felhasznalo"){    
            profilTeloLink.href = "/userProfil?id=" + bejelentkezve.id;
            profilLink.href = "/userProfil?id=" + bejelentkezve.id;
        }else{
            if(bejelentkezve.role == "edzo"){
                //még nincs profil oldala a felhasználónak és az edzőnek

                //profilTeloLink.href = "/edzo_profil?id=" + bejelentkezve.id;
                //profilLink.href = "/edzo_profil?id=" + bejelentkezve.id;
            }
        }
    }
    async function logoutFunction(e) {
        e.preventDefault();
        try {
            await postApi('/api/kijelentkezes', {});
            window.location.href = "/";
        } catch (error) {
            console.error("Hiba a kijelentkezéskor", error);
        }
    }
    kijelentkezesBtn.addEventListener('click', logoutFunction);
    kijelentkezesTeloLink.addEventListener('click', logoutFunction);

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
