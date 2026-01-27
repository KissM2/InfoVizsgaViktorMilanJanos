export function naptarGeneral(ev, honap, nap) {
    let hoEleje = new Date(ev, honap - 1, 1);
    let hetnapja = hoEleje.getDay() === 0 ? 7 : hoEleje.getDay(); 
    let napszam = new Date(ev, honap, 0).getDate();
    let hetek = Math.ceil((hetnapja - 1 + napszam) / 7);
    
    let naptardiv = document.createElement("div");
    naptardiv.classList.add("honap-kontener");
    
    let naptarinap = 1;
    for (let i = 0; i < hetek; i++) {
        let hetdiv = document.createElement("div");
        hetdiv.classList.add("het");
        for (let j = 1; j <= 7; j++) {
            let napdiv = document.createElement("div");
            napdiv.classList.add("nap");
            
            let cellaIndex = i * 7 + j;
            if (cellaIndex >= hetnapja && naptarinap <= napszam) {
                napdiv.innerText = naptarinap;
                naptarinap++;
            } else {
                napdiv.classList.add("noDay");
            }
            hetdiv.appendChild(napdiv);
        }
        naptardiv.appendChild(hetdiv);
    }
    return naptardiv;
}