export async function postKeres(url, formData) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        alert(result.message);

        if (!response.ok) {
            throw new Error("a POST lekérés nem 'ok' stástusszal tért vissza");
        }
        return result;
    } catch (error) {
        console.error('Hiba:', error);
        alert("Hálózati hiba!");
    }
}
export async function getKeres(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Szerver hiba: "+response.status);
        }
        return await response.json();
    } catch (error) {
        console.error("Lekérdezési hiba:", error);
    }
}