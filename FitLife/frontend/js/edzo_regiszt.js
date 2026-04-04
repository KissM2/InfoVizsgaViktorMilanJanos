import { postKeres } from '../js/kozosFetch.js';
import { footerGeneralas } from './footer.js';

document.addEventListener("DOMContentLoaded", async function () {
    footerGeneralas()
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