
document.addEventListener("DOMContentLoaded", function () {
    start();
    const profileBtn = document.getElementById("profileBtn");
    const overlay = document.getElementById("overlay");
    profileBtn.addEventListener("click", darking);
    overlay.addEventListener("click", closeMenu);
    document.getElementById("mentes").addEventListener("click",submit)
    document.getElementById("hozzaad").addEventListener("click",termek)
});
function darking() {
    const profileMenu = document.getElementById("profileMenu");
    const isOpen = profileMenu.style.display === "flex";
    if (isOpen) {
        closeMenu();
    }
    else {
        openMenu();
    }
}
function openMenu() {
    const profileMenu = document.getElementById("profileMenu");
    const overlay = document.getElementById("overlay");
    profileMenu.style.display = "flex";
    overlay.style.display = "block";
}
function closeMenu() {
    const profileMenu = document.getElementById("profileMenu");
    const overlay = document.getElementById("overlay");
    profileMenu.style.display = "none";
    overlay.style.display = "none";
}

// PROFIL MENTÉS
async function submit() {
    let formData = new FormData();

    formData.append("email", document.getElementById("email").value);
    formData.append("felh", document.getElementById("felh").value);
    formData.append("telsz", document.getElementById("telsz").value);

    await postKeres("/api/profileEdzoUpdate",formData)
}



async function termek() {
    let uj=document.getElementById("iptermek").value;
    let uj2=document.getElementById("varos").value;
    let lista=document.getElementById("lista");
    let li=document.createElement("li");
    li.classList.add("list-group-item");
    li.classList.add("dark-list");
    li.innerText=uj+" "+uj2;
    lista.appendChild(li);
}
