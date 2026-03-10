document.addEventListener("DOMContentLoaded", function () {
    const trainerForm = document.getElementById('trainerForm');

    trainerForm.addEventListener('submit', async () => {
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm').value;

        if (password != confirm) {
            alert("A jelszavak nem egyeznek!");
        }
        else {
            const formData = new FormData(trainerForm);
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                alert(result.message);
                if (response.ok) {
                    window.location.href = '../html/index.html';
                }
            } catch (error) {
                console.error('Hiba:', error);
                alert("Hálózati hiba!");
            }
        }
    });
});