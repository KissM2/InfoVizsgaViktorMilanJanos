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
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    let result = await postKeres('/api/login', formData);
    if(result && result.message == "Sikeres bejelentkezés."){
        switch(result.role){
            case "admin": window.location.href = "/../html/adminPage.html"; break;
            case "edzo": 
                if(result.elfogadva){
                    if(result.surveyDone){
                        window.location.href = "/../html/edzofo.html";
                    }else{
                        window.location.href = "/../html/edzoSurvey.html";
                    }
                }else{
                    window.location.href = "/../html/jelentkezett.html";
                } break;
            case "felhasznalo": 
                if(!result.surveyDone){
                    window.location.href = "/../html/userSurvey.html";
                }else{
                 window.location.href = "/..";
                } break;
            default: console.error("Nem megfelelő szerep");
        }
    };
});