import { naptarGeneral } from './Naptar.js';
import { letrehozEdzoProfil } from './edzoProfil.js';
let edzo1 = {
        nev: "Pitypang Bálint",
        kep: "../images/Pitypang.jpg",
        idezet: "Eskü 180 cm vagyok",
        leiras: "Az edzés nem csupán fizikai tevékenység, hanem egy út önmagad jobb verziója felé. Hiszem, hogy mindenki képes átlépni a határait.",
        eredmenyek: ["Év Személyi Edzője 2023", "CrossFit Regionális Bajnok", "Több mint 500 sikeres átalakulás"]
    };
document.addEventListener("DOMContentLoaded", function () {
    let main = document.getElementById("naptar");
    const ma = new Date();
    const koviHonap = new Date(ma.getFullYear(), ma.getMonth() + 1, 1);
    main.appendChild(naptarGeneral(ma.getFullYear(), ma.getMonth() + 1, ma.getDate()));
    main.appendChild(naptarGeneral(koviHonap.getFullYear(), koviHonap.getMonth() + 1, 1));    
    letrehozEdzoProfil("edzo", edzo1);
});