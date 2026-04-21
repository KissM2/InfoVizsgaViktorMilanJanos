import { navbarGeneralas } from './navbar.js';
import { postKeres, getKeres, postApi } from './kozosFetch.js';

const menuLinkek = [
    { nev: "Személyi edzők", url: "../html/osszesEdzo.html" },
    { nev: "Receptek", url: "../html/etrendek.html" },
    { nev: "Edzéstervek", url: "../html/edzesterv.html" },
];

document.addEventListener('DOMContentLoaded', async function(){
    navbarGeneralas(menuLinkek);

    document.getElementById('mentes_profil_adat').addEventListener('click', async function(){
        const formdata = new FormData(document.getElementById('profil_adat_form'));
        postKeres('/api/updateAuthData', formdata);
    });

    document.getElementById('mentes_szemelyi_adat').addEventListener('click', async function(){
        const formdata = new FormData(document.getElementById('szemelyi_adat_form'));
        postKeres('/api/userDataUpdate', formdata);
    });

    adatokBetolteseInputba()

    const alergiasRa = await getKeres('/api/getAllergiasRa')
    let etelAllergiakValasztott = alergiasRa.allergiak;
    let etelPrefferenciakValasztott = alergiasRa.preferenciak;

    const allergenek = (await getKeres('/api/getAllAllergen')).result;
    let allergiak = allergenek.filter((allergen) => allergen.tipus == "a")
    let preferenciak = allergenek.filter((preferencia) => preferencia.tipus == "p")

    valasztoGeneralasa('etelAllergiak', allergiak, etelAllergiakValasztott);
    valasztoGeneralasa('etelPrefferenciak', preferenciak, etelPrefferenciakValasztott);

    document.getElementById('mentes_allergiak').addEventListener('click', async function(){
        postApi('/api/postAllergiak', {etelAllergiak: etelAllergiakValasztott});
    });

    document.getElementById('mentes_preferenciak').addEventListener('click', async function(){
        postApi('/api/postPreferenciak', {etelPreferenciak: etelPrefferenciakValasztott});
    });
});

async function adatokBetolteseInputba() {
    const authAdatok = (await getKeres('/api/getAuthData')).result[0];
    const szemelyiAdatok = (await getKeres('/api/getUserData')).result[0];
    const celAlakOptions = (await getKeres('/api/getCelAlakOptions')).result;
    const EKMOptions = (await getKeres('/api/getEKMOptions')).result;

    document.getElementById('email').value = authAdatok.email;
    document.getElementById('felh_nev').value = authAdatok.felh_nev;
    document.getElementById('szul_datum').value = authAdatok.szul_datum.split("T")[0];
    document.getElementById('telszam').value = authAdatok.telszam;
    document.getElementById('nem').value = authAdatok.nem;

    document.getElementById('testsuly').value = parseFloat(szemelyiAdatok.testsuly);
    document.getElementById('cel_testsuly').value = parseFloat(szemelyiAdatok.cel_testsuly);
    document.getElementById('magassag').value = parseFloat(szemelyiAdatok.magassag);
    document.getElementById('edzesre_forditott_ido').value = parseFloat(szemelyiAdatok.edzesre_forditott_ido);

    const cel_alak_select = document.getElementById('cel_alak');
    const EKMselect = document.getElementById('edzesen_kivuli_mozgas');

    for (let i = 0; i < celAlakOptions.length; i++) {
        let celAlakOptionElement = document.createElement('option');
        celAlakOptionElement.innerText = celAlakOptions[i].nev;
        celAlakOptionElement.value = celAlakOptions[i].id;
        if(celAlakOptions[i].id == szemelyiAdatok.cel_alak_id){
            celAlakOptionElement.selected = true;
        }
        cel_alak_select.appendChild(celAlakOptionElement);
    }
    
    for (let i = 0; i < EKMOptions.length; i++) {
        let EKMOptionElement = document.createElement('option');
        EKMOptionElement.innerText = EKMOptions[i].intenzitas;
        EKMOptionElement.value = EKMOptions[i].id;
        if(EKMOptions[i].id == szemelyiAdatok.EKM_id){
            EKMOptionElement.selected = true;
        }
        EKMselect.appendChild(EKMOptionElement);
    }
}

function valasztoGeneralasa(id, lista, valasztott) {
    let befogo = document.getElementById(id);
    for (let i = 0; i < lista.length; i++) {
        let div = document.createElement('div');
        div.classList.add('survey-item', 'form-control', 'dark-input');
        if(valasztott.length > 0 && hanyadikElem(valasztott, lista[i]) < valasztott.length){
            div.classList.add('selected');
        }
        div.innerText = lista[i].nev;
        befogo.appendChild(div);
        div.addEventListener('click', function(){
            if(valasztott.length > 0 && hanyadikElem(valasztott, lista[i]) < valasztott.length){
                valasztott.splice(hanyadikElem(valasztott, lista[i]), 1);
                div.classList.remove('selected');
                return;
            }else{
                valasztott.push({allergen_id: lista[i].allergen_id});
                div.classList.add('selected');
            }
        });
    }
}

function hanyadikElem(lista, elem){
    let i = 0;    
    
    while(i < lista.length && lista[i].allergen_id != elem.allergen_id){
        i++
    }
    return i;
}
