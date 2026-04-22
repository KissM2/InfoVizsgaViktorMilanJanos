import {getKeres} from '../js/kozosFetch.js';

document.addEventListener("DOMContentLoaded", async function(){
    const felhasznalok = await getKeres('/api/getAllAuthData')    
    userTablaFeltoltes(felhasznalok.result);
    //const kommentek = await getKeres('/api/');
    //kommentKiiras(kommentek);
});

function userTablaFeltoltes(felhasznalok){
    let tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';

    felhasznalok.forEach(user => {
        let sor = document.createElement('tr');
        sor.dataset.id = user.id;
        sor.classList.add('row-hover-border')

        for (const key in user) {
            let cella = document.createElement('td');
            if(key == "szul_datum"){
                cella.textContent = user[key].split('T')[0];    
            }else{
                cella.textContent = user[key];
            }
            sor.appendChild(cella);
        }

        let torlesCella = document.createElement('td');

        let torles = document.createElement('button');
        torles.textContent = 'Törlés';
        torles.classList.add('btn', 'btn-danger', 'btn-sm');
        torles.addEventListener('click', function () {
            //ide jön majd a törlés funkció
        });

        torlesCella.appendChild(torles);
        sor.appendChild(torlesCella);
        tbody.appendChild(sor);
    });
}

function kommentKiiras(kommentek){
    let kommentDiv = document.getElementById('kommentek');
    kommentDiv.innerHTML = '';    

    kommentek.forEach(komment =>{
        let card = document.createElement('div');
        card.classList.add('card', 'mb-3', 'col-lg-4', 'col-md-6', 'col-sm-12');
        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        let title = document.createElement('h5');
        title.textContent = komment.felhasznaloNev;
        title.classList.add('card-title');
        cardBody.appendChild(title);

        let kommentText = document.createElement('p');
        kommentText.textContent = komment.komment;
        kommentText.classList.add('card-text');
        cardBody.appendChild(kommentText);

        let ertekeles = document.createElement('p');
        ertekeles.textContent = "Értékelés: 4/5";
        ertekeles.classList.add('card-text');
        cardBody.appendChild(ertekeles);

        let datum = document.createElement('small');
        datum.textContent = komment.datum;
        datum.classList.add('text-muted');
        cardBody.appendChild(datum);

        card.appendChild(cardBody);
        kommentDiv.appendChild(card);
    })
}