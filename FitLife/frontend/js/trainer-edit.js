document.addEventListener("DOMContentLoaded", function () {
    const profileBtn = document.getElementById("profileBtn");
    const overlay = document.getElementById("overlay");
    profileBtn.addEventListener("click", darking);
    overlay.addEventListener("click", closeMenu);
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
