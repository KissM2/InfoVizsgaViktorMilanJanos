document.addEventListener("DOMContentLoaded", function () {
    genBeo();
});
const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
let kapottbeo = [];
let mentettbeo = [];
async function genBeo() {
    const host = document.getElementById('beo');
    for (let i = 0; i < napok.length; i++) {
        let divtablecolumn = document.createElement('div');
        let divtablehead = document.createElement('div');
        let divtabledatebox = document.createElement('div');
        divtablehead.innerHTML = napok[i];
        divtablecolumn.classList.add("dtc");
        divtablehead.classList.add("dth");
        divtabledatebox.classList.add("dtdb");
        for (let perc = 0; perc < 24 * 60; perc += 30) {
            let ora = Math.floor(perc / 60);
            let p = perc % 60;

            let ido = `${String(ora).padStart(2, "0")}:${String(p).padStart(2, "0")}`;
            let date = document.createElement('div');
            date.innerText = ido;
            date.dataset.bek = false;
            date.dataset.di = i;
            date.addEventListener("click", function () {
                let ez = this;
                if (!ez.dataset.bek) {
                    ez.classList.add("bb");
                    ez.dataset.bek = true;
                    mentettbeo[ez.dataset.di].push(ez.innerText);
                }
                else {
                    ez.classList.remove("bb");
                    ez.dataset.bek = false;
                    mentettbeo[ez.dataset.di] = mentettbeo[ez.dataset.di].filter(elem => elem !== ez.innerText);
                }
            });
            divtabledatebox.appendChild(date);
        }
        divtablecolumn.appendChild(divtablehead);
        divtablecolumn.appendChild(divtabledatebox);
        host.appendChild(divtablecolumn);
    }
}