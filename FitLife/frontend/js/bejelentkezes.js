document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async () => {
        const formData = new FormData(loginForm);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            alert(result.message);
            if (response.ok) {
                window.location.href = '../html/index.html';
            }
        } catch (error) {
            console.error('Hiba történt a küldés során:', error);
            alert("Hálózati hiba történt!");
        }
    });
});