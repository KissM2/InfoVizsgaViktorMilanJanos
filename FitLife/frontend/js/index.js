let ticking = false;
window.addEventListener("scroll", () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const navbar = document.getElementById("navbar");
            const topBtn = document.getElementById("top");

            if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 10);
            if (topBtn) topBtn.style.display = window.scrollY > 300 ? "block" : "none";
            ticking = false;
        });
        ticking = true;
    }
});