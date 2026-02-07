import { naptarInit } from './Naptar.js';
import { letrehozEdzoProfil } from './edzoProfil.js';

const edzoAdat = {
    nev: "Pitypang Bálint",
    kep: "../images/Pitypang.jpg",
    idezet: "Eskü 180 cm vagyok",
    leiras: "Az edzés nem csupán fizikai tevékenység...",
    eredmenyek: ["Év Személyi Edzője 2023", "CrossFit Bajnok"]
};

document.addEventListener("DOMContentLoaded", () => {
    letrehozEdzoProfil("edzo", edzoAdat);
    naptarInit("naptar", "idopontok");
});