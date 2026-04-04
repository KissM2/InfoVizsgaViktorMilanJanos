import { postKeres } from '../js/kozosFetch.js';
import { navbarGeneralas } from './navbar.js';
import { footerGeneralas } from './footer.js';

const menuLinkek = [
    { nev: "Főoldal", url: "../html/index.html" },
    { nev: "Személyi edzők", url: "../html/osszesEdzo.html" },
    { nev: "Receptek", url: "../html/etrendek.html" },
    { nev: "Edzéstervek", url: "../html/edzesterv.html" }
];
document.addEventListener("DOMContentLoaded", () => {
    navbarGeneralas(menuLinkek);
    footerGeneralas();
});

document.getElementById('regForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;

    if (password !== confirm) {
        alert("A jelszavak nem egyeznek!");
    }
    else {
        const formData = new FormData(e.target);
        let result = await postKeres('/api/userRegister', formData);
        if(result.message = "Sikeres felhasználó rögzítés."){
            window.location.href = "../userSurvey";
        };
    }
});