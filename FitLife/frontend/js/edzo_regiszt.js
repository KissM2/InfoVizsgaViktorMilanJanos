import { postKeres } from '../js/kozosFetch.js';

document.getElementById('trainerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (document.getElementById('password').value !== document.getElementById('confirm').value) {
        alert("A jelszavak nem egyeznek!");
    }
    else {
        const formData = new FormData(e.target);
        postKeres('/api/register/trainer', formData, '../html/index.html');
    }

});