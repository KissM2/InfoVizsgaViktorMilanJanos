import { postKeres } from '../js/kozosFetch.js';

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