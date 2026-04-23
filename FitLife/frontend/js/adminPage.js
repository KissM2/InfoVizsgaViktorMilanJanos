import {getKeres} from '../js/kozosFetch.js';

document.addEventListener("DOMContentLoaded", async function(){
    const felhasznalok = await getKeres('/api/getAllAuthData')    
    userTablaFeltoltes(felhasznalok.result);
    const kommentek = await getKeres('/api/getAllKommentek');
    kommentKiiras(kommentek.results);

    document.getElementById('ujFelhasznaloBtn').addEventListener('click', function(){
        //ide jön majd az új felhasználó hozzáadásának a funkciója
    });

    document.getElementById('felhasznaloFrissites').addEventListener('click', async function(){
        const felhasznalok = await getKeres('/api/getAllAuthData')    
        userTablaFeltoltes(felhasznalok.result);
    });

    document.getElementById('kommentekFrissites').addEventListener('click', async function(){
        const kommentek = await getKeres('/api/getAllKommentek');
        kommentKiiras(kommentek.results);
    });
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
                if(key == "role"){
                    roleSelectGeneralas(cella, user);
                }else{
                    cella.textContent = user[key];
                }
            }
            sor.appendChild(cella);
        }

        let torlesCella = document.createElement('td');

        let torles = document.createElement('button');
        torles.textContent = 'Törlés';
        torles.classList.add('btn', 'btn-danger', 'btn-sm');
        torles.addEventListener('click', function (event) {            
            //ide jön majd a törlés funkció
        });

        sor.addEventListener('click', async function(event){
            //megakadályozzuk, hogy a selectre vagy a gombra kattintva is lefusson ez az event
            if (event.target.closest('select, button')) {
                return;
            }

            if(user.role == "edzo"){
                const kommentek = await getKeres('/api/getKommentekForAdmin?edzo_id=' + user.id);
                kommentKiiras(kommentek.results);
            }else{
                const kommentek = await getKeres('/api/getKommentekForAdmin?user_id=' + user.id);
                kommentKiiras(kommentek.results);
            }            
        });

        torlesCella.appendChild(torles);
        sor.appendChild(torlesCella);
        tbody.appendChild(sor);
    });
}

function kommentKiiras(kommentek){
    let tbody = document.getElementById('kommentekTableBody');
    tbody.innerHTML = '';    

    kommentek.forEach(komment =>{
        let sor = document.createElement('tr');
        sor.dataset.id = komment.id;
        sor.classList.add('row-hover-border')

        for (const key in komment) {
            let cella = document.createElement('td');
            if(key == "szul_datum"){
                cella.textContent = komment[key].split('T')[0];    
            }else{
                cella.textContent = komment[key];
            }
            sor.appendChild(cella);
        }

        let torlesCella = document.createElement('td');

        let torles = document.createElement('button');
        torles.textContent = 'inaktiválás';
        torles.classList.add('btn', 'btn-danger', 'btn-sm');
        torles.addEventListener('click', function () {
            //ide jön majd a törlés funkció
        });

        torlesCella.appendChild(torles);
        sor.appendChild(torlesCella);
        tbody.appendChild(sor);
    })
}

function roleSelectGeneralas(cella, user){
    let select = document.createElement('select');

    let optionA = document.createElement('option');
    optionA.value = "felhasznalo";
    optionA.innerText = "felhasználó";

    let optionB = document.createElement('option');
    optionB.value = "edzo";
    optionB.innerText = "edző";

    if(user.role == "felhasznalo"){
        optionA.selected = true;
    }else{
        if(user.role == "edzo"){
            optionB.selected = true;
        }
    }

    select.addEventListener('change', function(){
        
        //ide jön majd a role módosító funkció
    });

    select.appendChild(optionA);
    select.appendChild(optionB);
    cella.appendChild(select);
}
