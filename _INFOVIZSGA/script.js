window.addEventListener("scroll", () => {
  let navbar = document.getElementById("navbar");
  let top1 = document.getElementById("top");
  if (window.scrollY > 10) {
    navbar.classList.add("scrolled");
  }
  else {
    navbar.classList.remove("scrolled");
  }
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      top1.style.display = "block";
    } else {
      top1.style.display = "none";
    }
  });
  top1.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

});