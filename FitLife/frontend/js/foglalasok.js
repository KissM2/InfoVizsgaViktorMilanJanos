document.addEventListener("DOMContentLoaded", function () {
    genBeo();
    general();
});
const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

const honapok = [
"Január","Február","Március","Április","Május","Június",
"Július","Augusztus","Szeptember","Október","November","December"
];

let aktualisEv = new Date().getFullYear();
let aktualisHonap = new Date().getMonth()+1;
let kapottbeo = [];
let mentettbeo = [[],[],[],[],[],[],[]];
async function genBeo() {
    const host = document.getElementById('beo');
    for (let i = 0; i < napok.length; i++) {
        let divtablecolumn = document.createElement('div');
        let divtablehead = document.createElement('div');
        let divtabledatebox = document.createElement('div');
        divtablehead.innerHTML = napok[i];
        divtablecolumn.classList.add("dtc");
        divtablehead.classList.add("nap", "fejlec");
        divtabledatebox.classList.add("dtdb");
        for (let perc = 0; perc < 24 * 60; perc += 30) {
            let ora = Math.floor(perc / 60);
            let p = perc % 60;

            let ido = `${String(ora).padStart(2, "0")}:${String(p).padStart(2, "0")}`;
            let date = document.createElement('div');
            date.innerText = ido;
            date.classList.add('nap')
            date.dataset.bek = 0;
            date.dataset.di = i;
            date.addEventListener("click", function () {
                let ez = this;
                if (ez.dataset.bek==0) {
                    ez.classList.add("bb");
                    ez.dataset.bek = 1;
                    mentettbeo[ez.dataset.di].push(ez.innerText);
                }
                else {
                    if (mentettbeo[ez.dataset.di].length > 0) {
                        ez.classList.remove("bb");
                        ez.dataset.bek = 0;
                        mentettbeo[ez.dataset.di] = mentettbeo[ez.dataset.di].filter(elem => elem !== ez.innerText);
                    }
                }
                console.log(mentettbeo)
            });
            divtabledatebox.appendChild(date);
        }
        divtablecolumn.appendChild(divtablehead);
        divtablecolumn.appendChild(divtabledatebox);
        host.appendChild(divtablecolumn);
    }
}
function naptarGeneral(ev,honap){

    let hoEleje=new Date(ev,honap-1,1);
    let hetnapja=hoEleje.getDay();
    if(hetnapja==0) hetnapja=7;

    let napszam=new Date(ev,honap,0).getDate();
    let hetek = Math.ceil((hetnapja-1+napszam)/7);

    let naptarinap=1;

    let naptar=document.createElement("div");

    // napok fejléc
    let napSor=document.createElement("div");
    napSor.classList.add("het");

    for(let n of napok){
        let d=document.createElement("div");
        d.classList.add("nap","fejlec");
        d.innerText=n;
        napSor.appendChild(d);
    }

    naptar.appendChild(napSor);

    // hetek
    for (let i = 0; i < hetek; i++) {

        let het=document.createElement("div");
        het.classList.add("het");

        for (let j = 0; j < 7; j++) {

            let nap=document.createElement("div");
            nap.classList.add("nap");

            if(i*7+j+1>=hetnapja && naptarinap<=napszam){
                nap.innerText=naptarinap;
                naptarinap++;
            }
            else{
                nap.classList.add("noDay");
            }

            het.appendChild(nap);
        }

        naptar.appendChild(het);
    }

    return naptar;
}

function general(){

    let kontener=document.getElementById("naptar");
    kontener.innerHTML="";

    // fejléc
    let fejlec=document.createElement("div");
    fejlec.classList.add("naptarFejlec");

    let bal=document.createElement("button");
    bal.innerText="<";

    let cim=document.createElement("span");
    cim.innerText=aktualisEv+" "+honapok[aktualisHonap-1];

    let jobb=document.createElement("button");
    jobb.innerText=">";

    fejlec.appendChild(bal);
    fejlec.appendChild(cim);
    fejlec.appendChild(jobb);

    kontener.appendChild(fejlec);

    kontener.appendChild(naptarGeneral(aktualisEv,aktualisHonap));

    // események
    bal.addEventListener("click",function(){

        aktualisHonap--;

        if(aktualisHonap<1){
            aktualisHonap=12;
            aktualisEv--;
        }

        general();
    });

    jobb.addEventListener("click",function(){

        aktualisHonap++;

        if(aktualisHonap>12){
            aktualisHonap=1;
            aktualisEv++;
        }

        general();
    });

}