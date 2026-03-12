export async function postKeres(url, formData, hova) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        alert(result.message);

        if (response.ok && hova) {
            window.location.href = hova;
        }
        return result;
    } catch (error) {
        console.error('Hiba:', error);
        alert("Hálózati hiba!");
    }
}