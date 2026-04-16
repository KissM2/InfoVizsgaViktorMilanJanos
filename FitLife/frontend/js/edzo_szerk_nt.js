import { postApi } from "./kozosFetch.js";
let aktualisEv = new Date().getFullYear();
let aktualisHonap = new Date().getMonth() + 1;
let kapottbeo = [];
let mentettbeo = [[], [], [], [], [], [], []];
let mentetttorolt = [];
document.addEventListener("DOMContentLoaded", function () {
    genBeo();
    general();
    document.getElementById("beoS").addEventListener("click",async function() {await postApi("/api/insertHB",mentettbeo);location.reload();});
    document.getElementById("torS").addEventListener("click",async function() {await postApi("/api/insertKA",mentettbeo);location.reload();});
});
const napok = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

const honapok = [
    "Január", "Február", "Március", "Április", "Május", "Június",
    "Július", "Augusztus", "Szeptember", "Október", "November", "December"
];


async function genBeo() {
    const host = document.getElementById('beo');

    const fejlecSor = document.createElement('div');
    fejlecSor.classList.add('dt-head');

    const tartalom = document.createElement('div');
    tartalom.classList.add('dt-body');

    host.appendChild(fejlecSor);
    host.appendChild(tartalom);

    for (let i = 0; i < napok.length; i++) {

        // FEJLÉC
        let fej = document.createElement('div');
        fej.innerText = napok[i];
        fej.classList.add("nap", "fejlec");
        fejlecSor.appendChild(fej);

        // OSZLOP
        let oszlop = document.createElement('div');
        oszlop.classList.add("dtc");

        for (let perc = 0; perc < 24 * 60; perc += 30) {
            let ora = Math.floor(perc / 60);
            let p = perc % 60;

            let ido = `${String(ora).padStart(2, "0")}:${String(p).padStart(2, "0")}`;

            let cell = document.createElement('div');
            cell.innerText = ido;
            cell.classList.add('nap');

            cell.dataset.bek = 0;
            cell.dataset.di = i;

            cell.addEventListener("click", function () {
                let ez = this;

                if (ez.dataset.bek == 0) {
                    ez.classList.add("bb");
                    ez.dataset.bek = 1;
                    mentettbeo[ez.dataset.di].push(ez.innerText);
                } else {
                    ez.classList.remove("bb");
                    ez.dataset.bek = 0;
                    mentettbeo[ez.dataset.di] =
                        mentettbeo[ez.dataset.di].filter(e => e !== ez.innerText);
                }

                console.log(mentettbeo);
            });

            oszlop.appendChild(cell);
        }

        tartalom.appendChild(oszlop);
    }
}
function naptarGeneral(ev, honap) {

    let hoEleje = new Date(ev, honap - 1, 1);
    let hetnapja = hoEleje.getDay();
    if (hetnapja == 0) {
        hetnapja = 7
    };

    let napszam = new Date(ev, honap, 0).getDate();
    let hetek = Math.ceil((hetnapja - 1 + napszam) / 7);

    let naptarinap = 1;

    let naptar = document.createElement("div");

    // napok fejléc
    let napSor = document.createElement("div");
    napSor.classList.add("het");

    for (let n of napok) {
        let d = document.createElement("div");
        d.classList.add("nap", "fejlec");
        d.innerText = n;
        napSor.appendChild(d);
    }

    naptar.appendChild(napSor);

    // hetek
    for (let i = 0; i < hetek; i++) {

        let het = document.createElement("div");
        het.classList.add("het");

        for (let j = 0; j < 7; j++) {

            let nap = document.createElement("div");
            nap.classList.add("nap");

            if (i * 7 + j + 1 >= hetnapja && naptarinap <= napszam) {
                nap.innerText = naptarinap;
                nap.addEventListener("click", function () {
                    let ezz = this;
                    document.getElementById('naptargombok').innerHTML = "";
                    document.getElementById('napgombokfejlec').innerHTML = "";
                    const host = document.getElementById('naptargombok');
                    host.dataset.datum = aktualisEv + "-" + aktualisHonap + "-" + ezz.innerText;
                    document.getElementById('napgombokfejlec').innerText = aktualisEv + "." + aktualisHonap + "." + ezz.innerText + ".";
                    for (let perc = 0; perc < 24 * 60; perc += 30) {
                        let ora = Math.floor(perc / 60);
                        let p = perc % 60;
                        let ido = `${String(ora).padStart(2, "0")}:${String(p).padStart(2, "0")}`;

                        let napgomb = document.createElement('button')
                        napgomb.innerText = ido;
                        napgomb.dataset.bek = 0;
                        if (mentetttorolt.includes({ nap: host.dataset.datum, ido: ido })) {
                            napgomb.dataset.bek = 1;
                            napgomb.classList.add("rr");
                        }
                        napgomb.addEventListener("click", function () {
                            let ez = this;
                            if (ez.dataset.bek == 0) {
                                ez.classList.add("rr");
                                ez.dataset.bek = 1;
                                mentetttorolt.push({ nap: document.getElementById('naptargombok').dataset.datum, ido: ez.innerText });
                            }
                            else {
                                if (mentetttorolt.length > 0) {
                                    ez.classList.remove("rr");
                                    ez.dataset.bek = 0;
                                    const nap = document.getElementById('naptargombok').dataset.datum;
                                    const ido = ez.innerText;

                                    mentetttorolt = mentetttorolt.filter(elem =>
                                        !(elem.nap === nap && elem.ido === ido)
                                    );
                                }
                            }
                            console.log(mentetttorolt);
                        });
                        host.appendChild(napgomb);
                    }
                });
                naptarinap++;
            }
            else {
                nap.classList.add("noDay");
            }

            het.appendChild(nap);
        }

        naptar.appendChild(het);
    }

    return naptar;
}

function general() {

    let kontener = document.getElementById("naptar");
    kontener.innerHTML = "";

    // fejléc
    let fejlec = document.createElement("div");
    fejlec.classList.add("naptarFejlec");

    let bal = document.createElement("button");
    bal.innerText = "<";

    let cim = document.createElement("span");
    cim.innerText = aktualisEv + " " + honapok[aktualisHonap - 1];

    let jobb = document.createElement("button");
    jobb.innerText = ">";

    fejlec.appendChild(bal);
    fejlec.appendChild(cim);
    fejlec.appendChild(jobb);

    kontener.appendChild(fejlec);

    kontener.appendChild(naptarGeneral(aktualisEv, aktualisHonap));

    // események
    bal.addEventListener("click", function () {

        aktualisHonap--;

        if (aktualisHonap < 1) {
            aktualisHonap = 12;
            aktualisEv--;
        }

        general();
    });

    jobb.addEventListener("click", function () {

        aktualisHonap++;

        if (aktualisHonap > 12) {
            aktualisHonap = 1;
            aktualisEv++;
        }

        general();
    });

}