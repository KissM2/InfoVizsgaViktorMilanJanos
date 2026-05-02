import { postKeres } from '../js/kozosFetch.js';
import { navbarGeneralas } from './navbar.js';
import { footerGeneralas } from './footer.js';

const menuLinkek = [
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
    const email = document.getElementById('email').value;
    const telszam = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;
    const errorDiv = document.getElementById('error-message');
    errorDiv.classList.add('d-none');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telszamRegex = /^\+?[0-9\s\-]{9,15}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    if (!emailRegex.test(email)) {
        errorDiv.textContent = "Kérlek, adj meg egy érvényes e-mail címet!";
        return errorDiv.classList.remove('d-none');
    }
    if (!telszamRegex.test(telszam)) {
        errorDiv.textContent = "A telefonszám érvénytelen!";
        return errorDiv.classList.remove('d-none');
    }
    if (!passwordRegex.test(password)) {
        errorDiv.textContent = "A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell legalább egy nagybetűt, egy számot és egy speciális karaktert!";
        return errorDiv.classList.remove('d-none');
    }
    if (password !== confirm) {
        errorDiv.textContent = "A jelszavak nem egyeznek!";
        return errorDiv.classList.remove('d-none');
    }

    const formData = new FormData(e.target);
    try {
        let result = await postKeres('/api/userRegister', formData);
        if(result && result.message === "Sikeres felhasználó rögzítés."){
            window.location.href = "../userSurvey";
        } else {
            errorDiv.textContent = result.message || "Hiba történt a regisztráció során.";
            errorDiv.classList.remove('d-none');
        }
    } catch (error) {
        errorDiv.textContent = "Szerver hiba történt a regisztráció során.";
        errorDiv.classList.remove('d-none');
    }
});