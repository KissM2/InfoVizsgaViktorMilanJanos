export function footerGeneralas() {
    const footer = document.createElement("footer");
    footer.className = "lab pt-5 pb-3 mt-5";

    const container = document.createElement("div");
    container.className = "container";

    const row = document.createElement("div");
    row.className = "row";

    const col1 = document.createElement("div");
    col1.className = "col-md-4 col-sm-12 mb-4 mb-md-0";

    const cim1 = document.createElement("h5");
    cim1.className = "footer-cim";
    cim1.textContent = "Elérhetőségek";

    const adatok = [
        "FITLIFE Edzőterem",
        "1234 Budapest, Csapó utca 12.",
        "Telefon: +36 30 123 4567",
        "Email: info@fitlife.hu"
    ];

    col1.appendChild(cim1);
    adatok.forEach((szoveg, index) => {
        const p = document.createElement("p");
        if (index == adatok.length - 1) {
            p.className = "mb-0";
        } else {
            p.className = "mb-3";
        }
        p.textContent = szoveg;
        col1.appendChild(p);
    });

    const col2 = document.createElement("div");
    col2.className = "col-md-4 col-sm-12 mb-4 mb-md-0 text-center";

    const cim2 = document.createElement("h5");
    cim2.className = "footer-cim";
    cim2.textContent = "Kövess Minket";

    const socialDiv = document.createElement("div");
    socialDiv.className = "links d-flex justify-content-center mt-3";

    const socialMedia = [
        { ikon: "fab fa-facebook-f", url: "https://facebook.com" },
        { ikon: "fab fa-instagram", url: "https://instagram.com" }
    ];

    socialMedia.forEach((platform, index) => {
        const a = document.createElement("a");
        a.href = platform.url;
        a.target = "_blank";
        if (index == 0) {
            a.className = "social";
        } else {
            a.className = "social ms-4";
        }

        const i = document.createElement("i");
        i.className = platform.ikon;

        a.appendChild(i);
        socialDiv.appendChild(a);
    });

    col2.appendChild(cim2);
    col2.appendChild(socialDiv);

    const col3 = document.createElement("div");
    col3.className = "col-md-4 col-sm-12 text-md-end text-sm-start";

    const cim3 = document.createElement("h5");
    cim3.className = "footer-cim";
    cim3.textContent = "Gyorsmenü";

    const ul = document.createElement("ul");
    ul.className = "footer-menu list-unstyled";

    const linkek = [
        { nev: "Főoldal", url: "../html/index.html" },
        { nev: "Edzéstervek", url: "../html/edzesterv.html" },
        { nev: "Személyi Edzők", url: "../html/osszesEdzo.html" },
        { nev: "Receptek", url: "../html/etrendek.html" }
    ];

    linkek.forEach(link => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = link.url;
        a.textContent = link.nev;
        li.appendChild(a);
        ul.appendChild(li);
    });

    const copyright = document.createElement("p");
    copyright.className = "copyright mt-4";
    copyright.textContent = `© ${new Date().getFullYear()} FITLIFE. Minden jog fenntartva.`;

    col3.appendChild(cim3);
    col3.appendChild(ul);
    col3.appendChild(copyright);

    row.append(col1, col2, col3);
    container.appendChild(row);
    footer.appendChild(container);

    document.body.appendChild(footer);
}