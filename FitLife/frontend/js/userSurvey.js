const etelAllergiak = [
  "földimogyoró",
  "diófélék",
  "tej",
  "tojás",
  "glutén",
  "búza",
  "szója",
  "hal",
  "rákfélék",
  "puhatestűek",
  "szezámmag",
  "mustár",
  "zeller",
  "csillagfürt",
  "kén-dioxid és szulfitok"
];

const etelPrefferenciak = [
  "földimogyoró",
  "diófélék",
  "tej",
  "tojás",
  "glutén",
  "búza",
  "szója",
  "hal",
  "rákfélék",
  "puhatestűek",
  "szezámmag",
  "mustár",
  "zeller",
  "csillagfürt",
  "kén-dioxid és szulfitok"
];

import {postKeres} from('./kozosFetch.js');

document.addEventListener('DOMContentLoaded', function(){
    let etelAllergiakValasztott = [];
    let etelPrefferenciakValasztott = [];
    valasztoGeneralasa('etelAllergiak', etelAllergiak, etelAllergiakValasztott);
    valasztoGeneralasa('etelPrefferenciak', etelPrefferenciak, etelPrefferenciakValasztott);

    document.getElementById('submit').addEventListener('click', function(){
        const formData = new FormData(document.getElementById('surveyForm'));
        formData.append("etelAllergiak", JSON.stringify(etelAllergiakValasztott));
        formData.append("etelPreferenciak", JSON.stringify(etelPrefferenciakValasztott));
        postKeres('/api/userData');
    });
})

function valasztoGeneralasa(id, lista, valasztott) {
    let befogo = document.getElementById(id);
    for (let i = 0; i < lista.length; i++) {
        let div = document.createElement('div');
        div.classList.add('survey-item');
        div.innerText = lista[i];
        befogo.appendChild(div);
        div.addEventListener('click', function(){
            if(valasztott.includes(lista[i])){
                valasztott.splice(valasztott.indexOf(lista[i]), 1);
                div.classList.remove('selected');
                return;
            }else{
                valasztott.push(lista[i]);
                div.classList.add('selected');
            }
        });
    }
}

function osszeszedAdatok(allergiakValasztott, preferenciakValasztott) {
    const sulySuly = document.getElementById('celTestsulyInput').value;

    return {
        celTestsuly: parseInt(sulySuly),
        allergiak: allergiakValasztott,
        nemPrefferaltEtelek: preferenciakValasztott
    };
}
