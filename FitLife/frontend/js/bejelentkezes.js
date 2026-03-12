import { postKeres } from '../js/kozosFetch';
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    postKeres('/api/login', formData, '../html/index.html');
});