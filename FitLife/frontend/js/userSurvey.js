import {postKeres, getKeres} from './kozosFetch.js';

document.addEventListener('DOMContentLoaded', async function(){
    let etelAllergiakValasztott = [];
    let etelPrefferenciakValasztott = [];
    const allergenek = (await getKeres('/api/getAllAllergen')).result;
    let allergiak = allergenek.filter((allergen) => allergen.tipus == "a")
    let preferenciak = allergenek.filter((preferencia) => preferencia.tipus == "p")
    valasztoGeneralasa('etelAllergiak', allergiak, etelAllergiakValasztott);
    valasztoGeneralasa('etelPrefferenciak', preferenciak, etelPrefferenciakValasztott);

    selectFeltoltes();

    document.getElementById('submit').addEventListener('click', async function(e){
        e.preventDefault();
        const formData = new FormData(document.getElementById('surveyForm'));
        formData.append("etelAllergiak", JSON.stringify(etelAllergiakValasztott));
        formData.append("etelPreferenciak", JSON.stringify(etelPrefferenciakValasztott));
        let result = await postKeres('/api/userDataInsert', formData);
        if(result.message = "Sikeres felhasználó rögzítés."){
            window.location.href = ".."
        };
    });
})

function valasztoGeneralasa(id, lista, valasztott) {
    let befogo = document.getElementById(id);
    for (let i = 0; i < lista.length; i++) {
        let div = document.createElement('div');
        div.classList.add('survey-item', 'form-control', 'dark-input');
        div.innerText = lista[i].nev;
        befogo.appendChild(div);
        div.addEventListener('click', function(){
            if(valasztott.includes(lista[i].allergen_id)){
                valasztott.splice(valasztott.indexOf(lista[i].allergen_id), 1);
                div.classList.remove('selected');
                return;
            }else{
                valasztott.push(lista[i].allergen_id);
                div.classList.add('selected');
            }
        });
    }
}

async function selectFeltoltes() {
    const celAlakOptions = (await getKeres('/api/getCelAlakOptions')).result;
    const EKMOptions = (await getKeres('/api/getEKMOptions')).result;

    const cel_alak_select = document.getElementById('cel_alak');
    const EKMselect = document.getElementById('edzesen_kivuli_mozgas');

    for (let i = 0; i < celAlakOptions.length; i++) {
        let celAlakOptionElement = document.createElement('option');
        celAlakOptionElement.innerText = celAlakOptions[i].nev;
        celAlakOptionElement.value = celAlakOptions[i].id;
        cel_alak_select.appendChild(celAlakOptionElement);
    }
    
    for (let i = 0; i < EKMOptions.length; i++) {
        let EKMOptionElement = document.createElement('option');
        EKMOptionElement.innerText = EKMOptions[i].intenzitas;
        EKMOptionElement.value = EKMOptions[i].id;
        EKMselect.appendChild(EKMOptionElement);
    }
}
