import { postKeres } from '../js/kozosFetch.js';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let result = await postKeres('/api/login', formData);
    if(result.message = "Sikeres bejelentkezés."){
        window.location.href = ".."
    };
});