import {getKeres, postKeres, deleteKeres, postApi} from '../js/kozosFetch.js';

document.addEventListener("DOMContentLoaded", async function(){

    ujEdzoPageBetoltes();
    document.getElementById('ujEdzoPage').classList.remove('d-none');
    selectekFeltoltese();
    const allergenek = await getKeres('/api/getAllAllergen');
    let valasztottAllergenek = [];

    document.getElementById('felhKommPageBtn').addEventListener('click', async function(){
        felhTablaPageBetoltes();
        setAllPageDNone();
        setAllNavBtnDefault();
        
        document.getElementById('felhKommPage').classList.remove('d-none');
        document.getElementById('felhKommPageBtn').classList.add('btn-dark');
        document.getElementById('felhKommPageBtn').classList.remove('color-green');

    });

    document.getElementById('adminokPageBtn').addEventListener('click', async function(){
        adminPageBetoltes();
        setAllPageDNone();
        setAllNavBtnDefault();

        document.getElementById('adminokPage').classList.remove('d-none');
        document.getElementById('adminokPageBtn').classList.add('btn-dark');
        document.getElementById('adminokPageBtn').classList.remove('color-green');
    });
        
    document.getElementById('gyakReceptPageBtn').addEventListener('click', async function(){
        gyakorlatReceptPageBetoltes();
        setAllPageDNone();
        setAllNavBtnDefault();

        document.getElementById('gyakorlatReceptPage').classList.remove('d-none');
        document.getElementById('gyakReceptPageBtn').classList.add('btn-dark');
        document.getElementById('gyakReceptPageBtn').classList.remove('color-green');
    });

    document.getElementById('ujEdzoPageBtn').addEventListener('click', async function(){
        ujEdzoPageBetoltes();
        setAllPageDNone();
        setAllNavBtnDefault();

        document.getElementById('ujEdzoPage').classList.remove('d-none');
        document.getElementById('ujEdzoPageBtn').classList.add('btn-dark');
        document.getElementById('ujEdzoPageBtn').classList.remove('color-green');
    });

    document.getElementById('megerositesBtn').addEventListener('click', async function(event){            
        switch (event.target.dataset.action) {
            case 'deleteUser': {
                const response = await deleteKeres('/api/deleteUser?id=' + event.target.value);
                if(response.message == 'Felhasználó törlése sikeres.'){
                    const felhasznalok = await getKeres('/api/getAllAuthData');
                    userTablaFeltoltes(felhasznalok.result);
                }
                break;
            }
            case 'userVisszaAllitas': {
                const response = await postApi('/api/restoreUser', {id: event.target.value});
                if(response.message == 'Felhasználó visszaállítása sikeres.'){
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
                break;
            }
            case 'deleteAdmin': {
                const response = await deleteKeres('/api/deleteUser?id=' + event.target.value);
                if(response.message == 'Felhasználó törlése sikeres.'){
                    const adminok = await getKeres('/api/getAllAdminAuthData');
                    adminTablaFeltoltes(adminok.result);
                }
                break;
            }
            case 'adminVisszaAllitas': {
                const response = await postApi('/api/restoreUser', {id: event.target.value});
                if(response.message == 'Felhasználó visszaállítása sikeres.'){
                    const adminok = await getKeres('/api/getAllAdminAuthData');
                    adminTablaFeltoltes(adminok.result);
                }
                break;
            }
            case 'deleteGyakorlat': {
                const response = await deleteKeres('/api/deleteGyakorlat?id=' + event.target.value);
                if(response.message == 'Gyakorlat sikeresen törölve.'){
                    const gyakorlatok = await getKeres('/api/gyakorlatok');
                    gyakorlatTablaFeltoltes(gyakorlatok);
                }
                break;
            }
            case 'deleteRecept': {
                const response = await deleteKeres('/api/deleteRecept?id=' + event.target.value);
                if(response.message == 'Recept sikeresen törölve.'){
                    const receptek = await getKeres('/api/receptek');
                    receptTablaFeltoltes(receptek);
                }
                break;
            }
            case 'edzoElutasitasa': {
                const indokInput = document.getElementById('elutasitasIndok');
                const indok = indokInput?.value.trim() || 'Nem felelt meg az elvárásoknak.';

                const response = await deleteKeres(`/api/deleteJelentkezo?id=${event.target.value}&indok=${indok}`);
                if(response.message == 'Edző jelentkezése sikeresen elutasítva'){
                    ujEdzoPageBetoltes();
                }
                break;
            }
            case 'edzoElfogadasa': {
                const response = await postApi('/api/postJelentkezoelfogadas', {id: event.target.value});
                if(response.message == 'Edző jelentkezése sikeresen elfogadva'){
                    ujEdzoPageBetoltes();
                }
                break;
            }
        }
    });

    document.getElementById('gyakorlatokFrissites').addEventListener('click', async function(){
        const gyakorlatok = await getKeres('/api/gyakorlatok');
        gyakorlatTablaFeltoltes(gyakorlatok);
    });

    document.getElementById('receptekFrissites').addEventListener('click', async function(){
        const receptek = await getKeres('/api/receptek');
        receptTablaFeltoltes(receptek);
    });

    document.getElementById('ujGyakorlatBtn').addEventListener('click', async function(e){
        e.preventDefault();
        const formData = new FormData(document.getElementById('newGyakorlatForm'));
        const response = await postKeres('/api/postUjGyakorlat', formData);
        if(response.message == 'Sikeres új gyakorlat rögzítés.'){
            const gyakorlatok = await getKeres('/api/gyakorlatok');
            gyakorlatTablaFeltoltes(gyakorlatok);
        }
    });

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
        if(response.message == 'Sikeres felhasználó rögzítés.' || response.message == 'Sikeres edző rögzítés.'){
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

    document.getElementById('ujAdminBtn').addEventListener('click', async function(e){
        e.preventDefault();

        const formdata = new FormData(document.getElementById('newAdminForm'));
        const response = await postKeres('/api/adminRegister', formdata);
        if(response.message == 'Sikeres admin rögzítés.'){
            const adminok = await getKeres('/api/getAllAdminAuthData');
            adminTablaFeltoltes(adminok.result);
        }
    });

    document.getElementById('adminokFrissites').addEventListener('click', async function(){
        const adminok = await getKeres('/api/getAllAdminAuthData');
        adminTablaFeltoltes(adminok.result);
    });

    document.getElementById('ujReceptModalBtn').addEventListener('click', function(){
        valasztottAllergenek.slice(0, valasztottAllergenek.length); //tömb kiürítése
    });
    valasztoGeneralasa('allergenekContainer', allergenek.result, valasztottAllergenek);

    document.getElementById('ujReceptBtn').addEventListener('click', async function(e){
        e.preventDefault();
        const formData = new FormData(document.getElementById('newReceptForm'));
        formData.append('allergenek', JSON.stringify(valasztottAllergenek));
        const response = await postKeres('/api/postUjRecept', formData);
        if(response.message == 'Recept sikeresen rögzítve.'){
            const receptek = await getKeres('/api/receptek');
            receptTablaFeltoltes(receptek);
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

        let cvCella = document.createElement('td');
        let cvLink = document.createElement('a');
        cvLink.textContent = 'CV letöltése';

        //lekérjük a felhasználó önéletrajzát
        cvLink.href = "/api/jelentkezok/" + user.id + "/cv";
        cvLink.download = true;
        cvLink.target = '_blank';
        cvCella.appendChild(cvLink);

        let clCella = document.createElement('td');
        let clLink = document.createElement('a');
        clLink.textContent = 'Motivációs levél letöltése';
        //lekérjük a felhasználó motivációs levelét
        clLink.href = "/api/jelentkezok/" + user.id + "/cover-letter";
        clLink.download = true;
        clLink.target = '_blank';
        clCella.appendChild(clLink);

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

        cvCella.appendChild(cvLink);
        sor.appendChild(cvCella);
        clCella.appendChild(clLink);
        sor.appendChild(clCella);
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
    select.classList.add('dark-input', 'form-select');

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

function adminTablaFeltoltes(felhasznalok){
    let tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = '';

    felhasznalok.forEach(user => {
        let sor = document.createElement('tr');
        sor.dataset.id = user.id;
        sor.classList.add('row-hover-border')

        for (const key in user) {
            let cella = document.createElement('td');
            cella.textContent = user[key];
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
                    </ul>
                `;
                let megerositesBtn = document.getElementById('megerositesBtn');
                megerositesBtn.value = user.id; //gombra tesszük a törlendő user id-jét, hogy onnan tudjuk majd lekérni
                megerositesBtn.classList.add('btn-danger');
                megerositesBtn.classList.remove('btn-success');
                megerositesBtn.dataset.action = 'deleteAdmin'; //gombra teszünk egy data attribútumot, hogy tudjuk majd, hogy mi lesz a művelet
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
                    </ul>
                `;
                let megerositesBtn = document.getElementById('megerositesBtn');
                megerositesBtn.value = user.id; //gombra tesszük a törlendő user id-jét, hogy onnan tudjuk majd lekérni
                megerositesBtn.classList.remove('btn-danger');
                megerositesBtn.classList.add('btn-success');
                megerositesBtn.dataset.action = 'adminVisszaAllitas'; //gombra teszünk egy data attribútumot, hogy tudjuk majd, hogy mi lesz a művelet
            });
        }

        megerositesCella.appendChild(megerosites);
        sor.appendChild(megerositesCella);
        tbody.appendChild(sor);
    });
}

async function felhTablaPageBetoltes(){
    const felhasznalok = await getKeres('/api/getAllAuthData')    
    userTablaFeltoltes(felhasznalok.result);

    const kommentek = await getKeres('/api/getAllKommentek');
    kommentKiiras(kommentek.results);
}

async function adminPageBetoltes(){
    const adminok = await getKeres('/api/getAllAdminAuthData');
    adminTablaFeltoltes(adminok.result);
}

function setAllNavBtnDefault(){
    document.getElementById('adminokPageBtn').classList.remove('btn-dark');
    document.getElementById('adminokPageBtn').classList.add('color-green');

    document.getElementById('felhKommPageBtn').classList.remove('btn-dark');
    document.getElementById('felhKommPageBtn').classList.add('color-green');

    document.getElementById('ujEdzoPageBtn').classList.remove('btn-dark');
    document.getElementById('ujEdzoPageBtn').classList.add('color-green');

    document.getElementById('gyakReceptPageBtn').classList.remove('btn-dark');
    document.getElementById('gyakReceptPageBtn').classList.add('color-green');
}

function setAllPageDNone(){
    document.getElementById('adminokPage').classList.add('d-none');
    document.getElementById('felhKommPage').classList.add('d-none');
    document.getElementById('ujEdzoPage').classList.add('d-none');
    document.getElementById('gyakorlatReceptPage').classList.add('d-none');
}

async function gyakorlatReceptPageBetoltes() {
    const gyakorlatok = await getKeres('/api/gyakorlatok');
    gyakorlatTablaFeltoltes(gyakorlatok);
    const receptek = await getKeres('/api/receptek');
    receptTablaFeltoltes(receptek);
}

function gyakorlatTablaFeltoltes(gyakorlatok){
    let tbody = document.getElementById('gyakorlatTableBody');
    tbody.innerHTML = '';

    gyakorlatok.forEach(gyakorlat => {
        let sor = document.createElement('tr');
        sor.dataset.id = gyakorlat.gyakorlat_id;
        sor.classList.add('row-hover-border')

        for (const key in gyakorlat) {
            let cella = document.createElement('td');
            cella.textContent = gyakorlat[key];
            sor.appendChild(cella);
        }

        let megerositesCella = document.createElement('td');
        let megerosites = document.createElement('button');
        megerosites.setAttribute('data-bs-toggle', 'modal');
        megerosites.setAttribute('data-bs-target', '#megerositesModal');
        megerosites.classList.add('btn', 'btn-sm');
        megerosites.textContent = 'Törlés';
        megerosites.classList.add('btn-danger');
        megerosites.addEventListener('click', function () {
            document.getElementById('megerositesModalLabel').textContent = 'Gyakorlat törlése';
            document.getElementById('megerositoKerdes').textContent = 'Biztosan törölni szeretnéd ezt a gyakorlatot?';
            const modalContent = document.getElementById('megerositesModalContent');
            modalContent.innerHTML = `
                <ul>
                    <li><strong>ID:</strong> ${gyakorlat.gyakorlat_id}</li>
                    <li><strong>Név:</strong> ${gyakorlat.gyakorlat_nev}</li>
                    <li><strong>Leírás:</strong> ${gyakorlat.leiras}</li>
                    <li><strong>Kör:</strong> ${gyakorlat.kor}</li>
                    <li><strong>Ismétlés:</strong> ${gyakorlat.ismetles}</li>
                    <li><strong>Típus:</strong> ${gyakorlat.tipus}</li>
                    <li><strong>Izomcsoport:</strong> ${gyakorlat.izomcsoport_nev}</li>
                </ul>
            `;
            let megerositesBtn = document.getElementById('megerositesBtn');
            megerositesBtn.value = gyakorlat.gyakorlat_id; //gombra tesszük a törlendő gyakorlat id-jét, hogy onnan tudjuk majd lekérni
            megerositesBtn.classList.add('btn-danger');
            megerositesBtn.classList.remove('btn-success');
            megerositesBtn.dataset.action = 'deleteGyakorlat'; //gombra teszünk egy data attribútumot, hogy tudjuk majd, hogy mi lesz a művelet
        });

        megerositesCella.appendChild(megerosites);
        sor.appendChild(megerositesCella);
        tbody.appendChild(sor);
    });
}

function receptTablaFeltoltes(receptek){
    let tbody = document.getElementById('receptTableBody');
    tbody.innerHTML = '';

    receptek.forEach(recept => {
        let sor = document.createElement('tr');
        sor.dataset.id = recept.recept_id;
        sor.classList.add('row-hover-border')

        for (const key in recept) {
            let cella = document.createElement('td');
            cella.textContent = recept[key];
            sor.appendChild(cella);
        }

        let megerositesCella = document.createElement('td');
        let megerosites = document.createElement('button');
        megerosites.setAttribute('data-bs-toggle', 'modal');
        megerosites.setAttribute('data-bs-target', '#megerositesModal');
        megerosites.classList.add('btn', 'btn-sm');
        megerosites.textContent = 'Törlés';
        megerosites.classList.add('btn-danger');
        megerosites.addEventListener('click', function () {
            document.getElementById('megerositesModalLabel').textContent = 'Recept törlése';
            document.getElementById('megerositoKerdes').textContent = 'Biztosan törölni szeretnéd ezt a receptet?';
            const modalContent = document.getElementById('megerositesModalContent');
            modalContent.innerHTML = `
                <ul>
                    <li><strong>ID:</strong> ${recept.recept_id}</li>
                    <li><strong>Név:</strong> ${recept.nev}</li>
                    <li><strong>Leírás:</strong> ${recept.leiras}</li>
                    <li><strong>Etkezés típusa:</strong> ${recept.etkezes_tipus}</li>
                    <li><strong>Zsír:</strong> ${recept.zsir}</li>
                    <li><strong>Protein:</strong> ${recept.protein}</li>
                    <li><strong>Szénhidrat:</strong> ${recept.szenhidrat}</li>
                </ul>
            `;
            let megerositesBtn = document.getElementById('megerositesBtn');
            megerositesBtn.value = recept.recept_id; //gombra tesszük a törlendő recept id-jét, hogy onnan tudjuk majd lekérni
            megerositesBtn.classList.add('btn-danger');
            megerositesBtn.classList.remove('btn-success');
            megerositesBtn.dataset.action = 'deleteRecept'; //gombra teszünk egy data attribútumot, hogy tudjuk majd, hogy mi lesz a művelet
        });

        megerositesCella.appendChild(megerosites);
        sor.appendChild(megerositesCella);
        tbody.appendChild(sor);
    });
}

async function selectekFeltoltese(){
    const izomcsoportok = await getKeres('/api/getIzomcsoportok');
    let izomcsoportSelect = document.getElementById('izomcsoportSelect');
    izomcsoportok.results.forEach(izomcsoport => {
        let option = document.createElement('option');
        option.value = izomcsoport.izom_id;
        option.textContent = izomcsoport.nev;
        izomcsoportSelect.appendChild(option);
    });
}

function valasztoGeneralasa(id, lista, valasztott) {
    let befogo = document.getElementById(id);
    for (let i = 0; i < lista.length; i++) {
        let div = document.createElement('div');
        div.classList.add('survey-item', 'form-control', 'dark-input');
        div.innerText = lista[i].nev;
        befogo.appendChild(div);
        div.addEventListener('click', function(){
            if(hanyadikElem(valasztott, lista[i]) < valasztott.length){
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

async function ujEdzoPageBetoltes() {
    const jelentkezok = await getKeres('/api/getJelentkezok');
    ujEdzoTablaFeltoltes(jelentkezok.results);
}

async function ujEdzoTablaFeltoltes(jelentkezok) {
    let tbody = document.getElementById('edzoJelentkezesTableBody');
    tbody.innerHTML = '';

    if( jelentkezok.length == 0){
        let sor = document.createElement('tr');
        let cella = document.createElement('td');
        cella.textContent = 'Nincsenek jelenleg új edző jelentkezések.';
        cella.setAttribute('colspan', '10');
        sor.appendChild(cella);
        tbody.appendChild(sor);
        return;
    }

    jelentkezok.forEach(user => {
        let sor = document.createElement('tr');
        sor.dataset.id = user.id;
        sor.classList.add('row-hover-border')

        for (const key in user) {
            let cella = document.createElement('td');
            cella.textContent = user[key];
            sor.appendChild(cella);
        }

        let cvCella = document.createElement('td');
        let cvLink = document.createElement('a');
        cvLink.textContent = 'CV letöltése';

        //lekérjük a felhasználó önéletrajzát
        cvLink.href = "/api/jelentkezok/" + user.id + "/cv";
        cvLink.download = true;
        cvLink.target = '_blank';
        cvCella.appendChild(cvLink);

        let clCella = document.createElement('td');
        let clLink = document.createElement('a');
        clLink.textContent = 'Motivációs levél letöltése';

        //lekérjük a felhasználó motivációs levelét
        clLink.href = "/api/jelentkezok/" + user.id + "/cover-letter";
        clLink.download = true;
        clLink.target = '_blank';
        clCella.appendChild(clLink);

        let elfogadasCella = document.createElement('td');
        let elfogadas = document.createElement('button');
        elfogadas.setAttribute('data-bs-toggle', 'modal');
        elfogadas.setAttribute('data-bs-target', '#megerositesModal');
        elfogadas.classList.add('btn', 'btn-sm', 'btn-success');
        elfogadas.textContent = 'Elfogadás';        
        elfogadas.addEventListener('click', function () {
            document.getElementById('megerositesModalLabel').textContent = 'Jelentkező elfogadása';
            document.getElementById('megerositoKerdes').textContent = 'Biztosan elfogadod ezt a jelentkezőt?';
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
            let elfogadasBtn = document.getElementById('megerositesBtn');
            elfogadasBtn.value = user.id; //gombra tesszük a törlendő user id-jét, hogy onnan tudjuk majdlekérni
            elfogadasBtn.classList.add('btn-success');
            elfogadasBtn.classList.remove('btn-danger');
            elfogadasBtn.dataset.action = 'edzoElfogadasa'; //gombra teszünk egy data attribútumot, hogy tudjukmajd, hogy mi lesz a művelet
        });

        let elutasitasCella = document.createElement('td');
        let elutasitas = document.createElement('button');
        elutasitas.setAttribute('data-bs-toggle', 'modal');
        elutasitas.setAttribute('data-bs-target', '#megerositesModal');
        elutasitas.classList.add('btn', 'btn-sm', 'btn-danger');
        elutasitas.textContent = 'Elutasítás';        
        elutasitas.addEventListener('click', function () {
            document.getElementById('megerositesModalLabel').textContent = 'Jelentkező elutasítása';
            document.getElementById('megerositoKerdes').textContent = 'Biztosan elutasítod ezt a jelentkezőt?';
            const modalContent = document.getElementById('megerositesModalContent');
            modalContent.innerHTML = `
                <ul>
                    <li><strong>ID:</strong> ${user.id}</li>
                    <li><strong>Név:</strong> ${user.felh_nev}</li>
                    <li><strong>Email:</strong> ${user.email}</li>
                    <li><strong>Telefon:</strong> ${user.telszam}</li>
                    <li><strong>Nem:</strong> ${user.nem}</li>
                    <li><strong>Születési dátum:</strong> ${user.szul_datum}</li>
                    <label for="">Indok: </label>
                    <input type="text" id="elutasitasIndok" class="form-control">
                </ul>
            `;
            let elutasitasBtn = document.getElementById('megerositesBtn');
            elutasitasBtn.value = user.id; //gombra tesszük a törlendő user id-jét, hogy onnan tudjuk majdlekérni
            elutasitasBtn.classList.add('btn-danger');
            elutasitasBtn.classList.remove('btn-success');
            elutasitasBtn.dataset.action = 'edzoElutasitasa'; //gombra teszünk egy data attribútumot, hogy tudjukmajd, hogy mi lesz a művelet
        });

        sor.appendChild(cvCella);
        sor.appendChild(clCella);
        elfogadasCella.appendChild(elfogadas);
        sor.appendChild(elfogadasCella);
        elutasitasCella.appendChild(elutasitas);
        sor.appendChild(elutasitasCella);
        tbody.appendChild(sor);
    });
}
