export function navbarGeneralas(linkek) {
    const navContainer = document.createElement("nav");
    navContainer.className = "alapNav";

    const navDiv = document.createElement("div");
    navDiv.className = "nav";

    const homeLink = document.createElement("a");
    homeLink.href = "index.html";
    homeLink.className = "home d-flex align-items-center text-decoration-none";

    const logoDiv = document.createElement("div");
    logoDiv.className = "logo";
    logoDiv.textContent = "F";

    const logoSzovegDiv = document.createElement("div");
    logoSzovegDiv.className = "logoSzoveg";
    logoSzovegDiv.textContent = "FITLIFE";

    homeLink.appendChild(logoDiv);
    homeLink.appendChild(logoSzovegDiv);

    const menuContainer = document.createElement("div");
    menuContainer.className = "menu-container";

    const menuDiv = document.createElement("div");
    menuDiv.className = "menu";
    menuDiv.setAttribute("data-bs-toggle", "collapse");
    menuDiv.setAttribute("data-bs-target", "#fitlifeMenu");

    const menuSpan = document.createElement("span");
    menuSpan.textContent = "MENÜ";

    const togglerBtn = document.createElement("button");
    togglerBtn.className = "navbar-toggler p-0 border-0 shadow-none";

    const iconI = document.createElement("i");
    iconI.className = "fa-solid fa-bars text-white";

    togglerBtn.appendChild(iconI);
    menuDiv.appendChild(menuSpan);
    menuDiv.appendChild(togglerBtn);

    const collapseDiv = document.createElement("div");
    collapseDiv.className = "collapse doboz";
    collapseDiv.id = "fitlifeMenu";

    const linkekDiv = document.createElement("div");
    linkekDiv.className = "linkek";

    for (const link of linkek) {
        const a = document.createElement("a");
        a.href = link.url;
        a.textContent = link.nev;
        linkekDiv.appendChild(a);
    }

    collapseDiv.appendChild(linkekDiv);
    menuContainer.appendChild(menuDiv);
    menuContainer.appendChild(collapseDiv);
    
    navDiv.appendChild(homeLink);
    navDiv.appendChild(menuContainer);
    navContainer.appendChild(navDiv);
//prepend az elem legelso helyere kerul
    document.body.prepend(navContainer);
}