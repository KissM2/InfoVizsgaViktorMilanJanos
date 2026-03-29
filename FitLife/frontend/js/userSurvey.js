import {postKeres, getKeres} from './kozosFetch.js';

document.addEventListener('DOMContentLoaded', async function(){
    let etelAllergiakValasztott = [];
    let etelPrefferenciakValasztott = [];
    const allergenek = (await getKeres('/api/getAllAllergen')).result;
    let allergiak = allergenek.filter((allergen) => allergen.tipus == "a")
    let preferenciak = allergenek.filter((preferencia) => preferencia.tipus == "p")
    valasztoGeneralasa('etelAllergiak', allergiak, etelAllergiakValasztott);
    valasztoGeneralasa('etelPrefferenciak', preferenciak, etelPrefferenciakValasztott);

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
        div.classList.add('survey-item');
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
