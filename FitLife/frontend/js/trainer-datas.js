const apisUrl1="";
const apisUrl2="";
document.addEventListener("DOMContentLoaded", function () {
    start();
    const profileBtn = document.getElementById("profileBtn");
    const overlay = document.getElementById("overlay");
    profileBtn.addEventListener("click", darking);
    overlay.addEventListener("click", closeMenu);
    document.getElementById("mentes").addEventListener("click",submit)
    document.getElementById("hozzaad").addEventListener("click",termek)
});
function darking() {
    const profileMenu = document.getElementById("profileMenu");
    const isOpen = profileMenu.style.display === "flex";
    if (isOpen) {
        closeMenu();
    }
    else {
        openMenu();
    }
}
function openMenu() {
    const profileMenu = document.getElementById("profileMenu");
    const overlay = document.getElementById("overlay");
    profileMenu.style.display = "flex";
    overlay.style.display = "block";
}
function closeMenu() {
    const profileMenu = document.getElementById("profileMenu");
    const overlay = document.getElementById("overlay");
    profileMenu.style.display = "none";
    overlay.style.display = "none";
}
async function start()
{
    
}
async function submit() {
    let a=document.getElementById("email").value;
    let b=document.getElementById("felh").value;
    let c=document.getElementById("jelsz").value;
    let d=document.getElementById("telsz").value;
    let data=await postApi(apisUrl2,a,b,c,d)
}
async function getApi() {
try {
const response = await fetch(apiUrl, {
method: 'GET'
});
if (!response.ok) {
throw new Error(`Hiba: ${response.status}`);
}
return await response.json();
} catch (error) {
console.error('GET hiba:', error);
}
}

async function postApi(apiUrl,a,b,c,d) {
const elem = {
    email:a,
    felh:b,
    jelszo:c,
    telsz:d
};
try {
const response = await fetch(apiUrl, {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(elem)
});
if (!response.ok) throw new Error(`Hiba: ${response.status}`);
const result = await response.json();
console.log('Létrehozott felhasználó:', result);
} catch (error) {
console.error('POST hiba:', error);
}
}
async function termek() {
    let uj=document.getElementById("iptermek").value;
    let uj2=document.getElementById("varos").value;
    let lista=document.getElementById("lista");
    let li=document.createElement("li");
    li.classList.add("list-group-item");
    li.classList.add("dark-list");
    li.innerText=uj+" "+uj2;
    lista.appendChild(li);
}
