import { getKeres, postKeres } from "./kozosFetch.js";
import { navbarGeneralas } from './navbar.js';
import { marker } from './edzoteremValasztoMap.js';
const menuLinkek = [
    { nev: "Edző főoldal", url: "/edzofo" },
    { nev: "Naptár szerkesztése", url: "/esznt" }
];
document.addEventListener("DOMContentLoaded", async function () {
    navbarGeneralas(menuLinkek);
    const valasz = await getKeres("/api/edzoProfilSajat");
    if (valasz && valasz.results) {
        const adat = valasz.results;
        document.getElementById('preview').setAttribute("src", ("../images/" + adat.kep));
        document.getElementById('idezetInput').value = adat.idezet;
        document.getElementById('leirasInput').value = adat.leiras;
        document.getElementById('kompetenciakInput').value = adat.kompetenciak;
    }
    document.getElementById("kepInput").addEventListener("change", (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById("preview");
        if (file) {
            preview.src = URL.createObjectURL(file);
        }
    });
    document.getElementById('submit').addEventListener('click', async function (e) {
        e.preventDefault();
        let formData = new FormData(document.getElementById('edzoNevjegyForm'));
        const fileInput = document.getElementById('kepInput');
        if (fileInput.files.length > 0) {
            formData.append('kep', fileInput.files[0]);
        }
        formData.append('edzoterem_cim_lat', marker.position.lat);
        formData.append('edzoterem_cim_lng', marker.position.lng);
        const result = await postKeres('/api/edzoDataUpdate', formData);
    });
});

