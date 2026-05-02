import { postApi } from './kozosFetch.js';

document.getElementById('forgotForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const uzenet = document.getElementById('uzenet');

    try {
        const res = await postApi('/api/forgot-password', { email });
        uzenet.textContent = "Email kiküldve! Ellenőrizd a fiókodat.";
        uzenet.style.color = "#28a745";
    } catch (err) {
        uzenet.textContent = "Hiba a küldés során.";
        uzenet.style.color = "red";
    }
});