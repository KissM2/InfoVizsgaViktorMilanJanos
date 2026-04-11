import { postKeres } from '../js/kozosFetch.js';
import { navbarGeneralas } from './navbar.js';

const menuLinkek = [
    { nev: "Személyi edzők", url: "../html/osszesEdzo.html" },
    { nev: "Receptek", url: "../html/etrendek.html" },
    { nev: "Edzéstervek", url: "../html/edzesterv.html" }
];

document.addEventListener('DOMContentLoaded', function(){
    navbarGeneralas(menuLinkek);
});

document.getElementById('trainerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (document.getElementById('password').value !== document.getElementById('confirm').value) {
        alert("A jelszavak nem egyeznek!");
    }
    else {
        const formData = new FormData(e.target);
        let result = await postKeres('/api/edzoRegister', formData);
        if(result.message = "Sikeres edző rögzítés."){
            window.location.href = "../edzoSurvey"
        };
    }

});