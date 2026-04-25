import {getKeres, postKeres, deleteKeres, postApi} from '../js/kozosFetch.js';

document.addEventListener("DOMContentLoaded", async function(){
    const felhasznalok = await getKeres('/api/getAllAuthData')    
    userTablaFeltoltes(felhasznalok.result);
    const kommentek = await getKeres('/api/getAllKommentek');
    kommentKiiras(kommentek.results);

    document.getElementById('ujFelhBtn').addEventListener('click', async function(e){
        e.preventDefault();
        const formData = new FormData(document.getElementById('newUserForm'));
        let response;
        if(formData.get('role') == "felhasznalo"){
            response = await postKeres('/api/userRegister', formData);
        }
        else{
            response = await postKeres('/api/edzoRegister', formData);
        }
        if(await response.message == 'Sikeres felhasználó rögzítés.' || await response.message == 'Sikeres edző rögzítés.'){
            const felhasznalok = await getKeres('/api/getAllAuthData')
            userTablaFeltoltes(felhasznalok.result);
        }
    });

    document.getElementById('felhasznaloFrissites').addEventListener('click', async function(){
        const felhasznalok = await getKeres('/api/getAllAuthData')    
        userTablaFeltoltes(felhasznalok.result);
    });

    document.getElementById('kommentekFrissites').addEventListener('click', async function(){
        const kommentek = await getKeres('/api/getAllKommentek');
        kommentKiiras(kommentek.results);
    });

    document.getElementById('megerositesBtn').addEventListener('click', async function(event){            
        switch (event.target.dataset.action) {
            case 'deleteUser': {
                const response = await deleteKeres('/api/deleteUser?id=' + event.target.value);
                if(await response.message == 'Felhasználó törlése sikeres.'){
                    const felhasznalok = await getKeres('/api/getAllAuthData');
                    userTablaFeltoltes(felhasznalok.result);
                }
                break;
            }
            case 'userVisszaAllitas': {
                const response = await postApi('/api/restoreUser', {id: event.target.value});
                if(await response.message == 'Felhasználó visszaállítása sikeres.'){
                    const felhasznalok = await getKeres('/api/getAllAuthData');
                    userTablaFeltoltes(felhasznalok.result);
                }
                break;
            }
            case 'kommentInaktivalas': {
                const result = await deleteKeres('/api/kommentInaktivalas?komment_id=' + event.target.value);
                if(result.message == 'Komment inaktiválása sikeres.'){
                    const kommentek = await getKeres('/api/getAllKommentek');
                    kommentKiiras(kommentek.results);
                }

                break;
            }
            case 'kommentAktivalas': {
                const result = await postApi('/api/kommentAktivalas', { komment_id: event.target.value });
                if(result.message == 'Komment aktiválása sikeres.'){
                    const kommentek = await getKeres('/api/getAllKommentek');
                    kommentKiiras(kommentek.results);
                }                
                break;
            }
            case 'felhasznaloSzerepModositas':{
                const result = await postApi('/api/felhasznaloSzerepModositas', { id: event.target.value, ujRole: event.target.dataset.ujRole });
                if(result.message == 'Felhasználó szerepének módosítása sikeres.'){
                    const felhasznalok = await getKeres('/api/getAllAuthData');
                    userTablaFeltoltes(felhasznalok.result);
                }
            }
        }
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
            if(key == "role"){
                roleSelectGeneralas(cella, user);
            }else{
                cella.textContent = user[key];
            }
            sor.appendChild(cella);
        }

        let megerositesCella = document.createElement('td');
        let megerosites = document.createElement('button');
        megerosites.setAttribute('data-bs-toggle', 'modal');
        megerosites.setAttribute('data-bs-target', '#megerositesModal');
        megerosites.classList.add('btn', 'btn-sm');
        if(user.deleted_at == null){
            megerosites.textContent = 'Törlés';
            megerosites.classList.add('btn-danger');
            megerosites.addEventListener('click', function () {
                document.getElementById('megerositesModalLabel').textContent = 'Felhasználó törlése';
                document.getElementById('megerositoKerdes').textContent = 'Biztosan törölni szeretnéd ezt a felhasználót?';
                const modalContent = document.getElementById('megerositesModalContent');
                modalContent.innerHTML = `
                    <ul>
                        <li><strong>ID:</strong> ${user.id}</li>
                        <li><strong>Név:</strong> ${user.felh_nev}</li>
                        <li><strong>Email:</strong> ${user.email}</li>
                        <li><strong>Telefon:</strong> ${user.telszam}</li>
                        <li><strong>Nem:</strong> ${user.nem}</li>
                        <li><strong>Születési dátum:</strong> ${user.szul_datum}</li>
                    </ul>
                `;
                let megerositesBtn = document.getElementById('megerositesBtn');
                megerositesBtn.value = user.id; //gombra tesszük a törlendő user id-jét, hogy onnan tudjuk majd lekérni
                megerositesBtn.classList.add('btn-danger');
                megerositesBtn.classList.remove('btn-success');
                megerositesBtn.dataset.action = 'deleteUser'; //gombra teszünk egy data attribútumot, hogy tudjuk majd, hogy mi lesz a művelet
            });
        }else{
            megerosites.textContent = 'visszaállítás';
            megerosites.classList.add('btn-success');
            megerosites.addEventListener('click', async function (event) {       
                document.getElementById('megerositesModalLabel').textContent = 'Felhasználó visszaállítása';
                document.getElementById('megerositoKerdes').textContent = 'Biztosan szeretnéd visszaállítani ezt a felhasználót?';
                const modalContent = document.getElementById('megerositesModalContent');
                modalContent.innerHTML = `
                    <ul>
                        <li><strong>ID:</strong> ${user.id}</li>
                        <li><strong>Név:</strong> ${user.felh_nev}</li>
                        <li><strong>Email:</strong> ${user.email}</li>
                        <li><strong>Telefon:</strong> ${user.telszam}</li>
                        <li><strong>Nem:</strong> ${user.nem}</li>
                        <li><strong>Születési dátum:</strong> ${user.szul_datum}</li>
                    </ul>
                `;
                let megerositesBtn = document.getElementById('megerositesBtn');
                megerositesBtn.value = user.id; //gombra tesszük a törlendő user id-jét, hogy onnan tudjuk majd lekérni
                megerositesBtn.classList.remove('btn-danger');
                megerositesBtn.classList.add('btn-success');
                megerositesBtn.dataset.action = 'userVisszaAllitas'; //gombra teszünk egy data attribútumot, hogy tudjuk majd, hogy mi lesz a művelet
            });
        }

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

        megerositesCella.appendChild(megerosites);
        sor.appendChild(megerositesCella);
        tbody.appendChild(sor);
    });
}

function kommentKiiras(kommentek){
    let tbody = document.getElementById('kommentekTableBody');
    tbody.innerHTML = '';    

    kommentek.forEach(komment =>{
        let sor = document.createElement('tr');
        sor.dataset.id = komment.komment_id;
        sor.classList.add('row-hover-border')

        for (const key in komment) {
            let cella = document.createElement('td');
            if(key == "szul_datum"){
                cella.textContent = komment[key];    
            }else{
                cella.textContent = komment[key];
            }
            sor.appendChild(cella);
        }

        let megerositesCella = document.createElement('td');

        let megerosites = document.createElement('button');
        megerosites.classList.add('btn', 'btn-sm');
        megerosites.setAttribute('data-bs-toggle', 'modal');
        megerosites.setAttribute('data-bs-target', '#megerositesModal');
        if(komment.statusz == "inaktiv"){
            megerosites.textContent = 'aktiválás';
            megerosites.classList.add('btn-success');
            megerosites.addEventListener('click', async function () {
                document.getElementById('megerositesModalLabel').textContent = 'komment aktiválása';
                document.getElementById('megerositoKerdes').textContent = 'Biztosan szeretnéd aktiválni ezt a kommentet?';
                const modalContent = document.getElementById('megerositesModalContent');
                modalContent.innerHTML = `
                    <ul>
                        <li><strong>ID:</strong> ${komment.komment_id}</li>
                        <li><strong>Komment:</strong> ${komment.szoveg}</li>
                        <li><strong>Értékelés:</strong> ${komment.ertekeles}</li>
                        <li><strong>Edző:</strong> ${komment.edzo_nev}</li>
                        <li><strong>Felhasználó:</strong> ${komment.felh_nev}</li>
                    </ul>
                `;
                let megerositesBtn = document.getElementById('megerositesBtn');
                megerositesBtn.value = komment.komment_id; //gombra tesszük a törlendő komment id-jét, hogy onnan tudjuk majd lekérni
                megerositesBtn.classList.remove('btn-danger');
                megerositesBtn.classList.add('btn-success');
                megerositesBtn.dataset.action = 'kommentAktivalas'; //gombra teszünk egy data attribútumot, hogy tudjuk majd, hogy mi lesz a művelet
            });
        }else{
            megerosites.textContent = 'inaktiválás';
            megerosites.classList.add('btn-danger');
            megerosites.addEventListener('click', async function () {
                document.getElementById('megerositesModalLabel').textContent = 'Komment inaktiválása';
                document.getElementById('megerositoKerdes').textContent = 'Biztosan inaktiválni szeretnéd ezt a kommentet?';
                const modalContent = document.getElementById('megerositesModalContent');
                modalContent.innerHTML = `
                    <ul>
                        <li><strong>ID:</strong> ${komment.komment_id}</li>
                        <li><strong>Komment:</strong> ${komment.szoveg}</li>
                        <li><strong>Értékelés:</strong> ${komment.ertekeles}</li>
                        <li><strong>Edző:</strong> ${komment.edzo_nev}</li>
                        <li><strong>Felhasználó:</strong> ${komment.felh_nev}</li>
                    </ul>
                `;
                let megerositesBtn = document.getElementById('megerositesBtn');
                megerositesBtn.value = komment.komment_id; //gombra tesszük a törlendő komment id-jét, hogy onnan tudjuk majd lekérni
                megerositesBtn.classList.add('btn-danger');
                megerositesBtn.classList.remove('btn-success');
                megerositesBtn.dataset.action = 'kommentInaktivalas'; //gombra teszünk egy data attribútumot, hogy tudjuk majd, hogy mi lesz a művelet
            });
        }

        sor.addEventListener('click', async function(){
            if (event.target.closest('select, button')) {
                return;
            }
            const erintettek = await getKeres('/api/getErintettekForAdmin?komment_id=' + komment.komment_id);
            userTablaFeltoltes(erintettek.results);
        });

        megerositesCella.appendChild(megerosites);
        sor.appendChild(megerositesCella);
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
        const modalElement = document.getElementById('megerositesModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        document.getElementById('megerositesModalLabel').textContent = 'Felhasználó szerep módosítása';
        document.getElementById('megerositoKerdes').textContent = 'Biztosan szeretnéd módosítani ennek a felhasználónak a szerepét?';
        const modalContent = document.getElementById('megerositesModalContent');
        modalContent.innerHTML = `
            <ul>
                <li><strong>ID:</strong> ${user.id}</li>
                <li><strong>Név:</strong> ${user.felh_nev}</li>
                <li><strong>Email:</strong> ${user.email}</li>
                <li><strong>Szerep:</strong> ${user.role}</li>
                <li><strong>Új szerep:</strong> ${select.value}</li>
                <li><strong>Telefon:</strong> ${user.telszam}</li>
                <li><strong>Nem:</strong> ${user.nem}</li>
                <li><strong>Születési dátum:</strong> ${user.szul_datum}</li>
            </ul>
        `;
        let megerositesBtn = document.getElementById('megerositesBtn');
        megerositesBtn.value = user.id; //gombra tesszük a törlendő felhasználó id-jét, hogy onnan tudjuk majd lekérni
        megerositesBtn.classList.remove('btn-danger');
        megerositesBtn.classList.add('btn-success');
        megerositesBtn.dataset.action = 'felhasznaloSzerepModositas'; //gombra teszünk egy data attribútumot, hogy tudjuk majd, hogy mi lesz a művelet
        megerositesBtn.dataset.ujRole = select.value; //gombra teszünk egy data attribútumot, hogy tudjuk majd, hogy mi lesz az új szerep
    });

    select.appendChild(optionA);
    select.appendChild(optionB);
    cella.appendChild(select);
}
