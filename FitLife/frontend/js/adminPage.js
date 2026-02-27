let pelda = [
{
    id: 1,
    nev: "Példa Lajos",
    email: "pelda.lajos@example.com",
    jelszo: "12345678",
    szuletesiDatum: "1990-01-01",
    szerep: "edzo"
},
{
    id: 2,
    nev: "Példa Anna",
    email: "pelda.anna@example.com",
    jelszo: "87654321",
    szuletesiDatum: "1992-05-15",
    szerep: "felhasznalo"
},
{
    id: 3,
    nev: "Kovács Bence",
    email: "kovacs.bence@example.com",
    jelszo: "password123",
    szuletesiDatum: "1988-03-12",
    szerep: "admin"
},
{
    id: 4,
    nev: "Szabó Réka",
    email: "szabo.reka@example.com",
    jelszo: "edzo2024",
    szuletesiDatum: "1995-07-22",
    szerep: "felhasznalo"
},
{
    id: 5,
    nev: "Tóth Márk",
    email: "toth.mark@example.com",
    jelszo: "markpass1",
    szuletesiDatum: "1991-11-30",
    szerep: "edzo"
},
{
    id: 6,
    nev: "Nagy Dóra",
    email: "nagy.dora@example.com",
    jelszo: "dora5678",
    szuletesiDatum: "1993-09-18",
    szerep: "felhasznalo"
},
{
    id: 7,
    nev: "Varga Patrik",
    email: "varga.patrik@example.com",
    jelszo: "patrik99",
    szuletesiDatum: "1987-02-25",
    szerep: "edzo"
},
{
    id: 8,
    nev: "Horváth Eszter",
    email: "horvath.eszter@example.com",
    jelszo: "eszter321",
    szuletesiDatum: "1996-06-10",
    szerep: "edzo"
},
{
    id: 9,
    nev: "Kiss Gábor",
    email: "kiss.gabor@example.com",
    jelszo: "gabor111",
    szuletesiDatum: "1989-04-14",
    szerep: "felhasznalo"
},
{
    id: 10,
    nev: "Molnár Lili",
    email: "molnar.lili@example.com",
    jelszo: "lili2023",
    szuletesiDatum: "1994-12-01",
    szerep: "felhasznalo"
},
{
    id: 11,
    nev: "Farkas Dávid",
    email: "farkas.david@example.com",
    jelszo: "david888",
    szuletesiDatum: "1990-08-19",
    szerep: "edzo"
},
{
    id: 12,
    nev: "Balogh Zsófia",
    email: "balogh.zsofia@example.com",
    jelszo: "zsofia22",
    szuletesiDatum: "1997-01-05",
    szerep: "edzo"
},
{
    id: 13,
    nev: "Papp Ádám",
    email: "papp.adam@example.com",
    jelszo: "adam4567",
    szuletesiDatum: "1986-10-27",
    szerep: "edzo"
},
{
    id: 14,
    nev: "Lakatos Nóra",
    email: "lakatos.nora@example.com",
    jelszo: "nora7890",
    szuletesiDatum: "1998-03-03",
    szerep: "edzo"
},
{
    id: 15,
    nev: "Oláh Máté",
    email: "olah.mate@example.com",
    jelszo: "matepass",
    szuletesiDatum: "1992-07-17",
    szerep: "edzo"
},
{
    id: 16,
    nev: "Simon Petra",
    email: "simon.petra@example.com",
    jelszo: "petra555",
    szuletesiDatum: "1991-09-09",
    szerep: "edzo"
},
{
    id: 17,
    nev: "Juhász Levente",
    email: "juhasz.levente@example.com",
    jelszo: "levi2020",
    szuletesiDatum: "1985-05-21",
    szerep: "edzo"
},
{
    id: 18,
    nev: "Mészáros Hanna",
    email: "meszaros.hanna@example.com",
    jelszo: "hanna333",
    szuletesiDatum: "1999-11-11",
    szerep: "edzo"
},
{
    id: 19,
    nev: "Bíró András",
    email: "biro.andras@example.com",
    jelszo: "andras007",
    szuletesiDatum: "1984-06-06",
    szerep: "edzo"
},
{
    id: 20,
    nev: "Kelemen Fanni",
    email: "kelemen.fanni@example.com",
    jelszo: "fanni2022",
    szuletesiDatum: "1993-02-13",
    szerep: "edzo"
},
{
    id: 21,
    nev: "Fehér Dominik",
    email: "feher.dominik@example.com",
    jelszo: "dominik99",
    szuletesiDatum: "1996-04-04",
    szerep: "edzo"
},
{
    id: 22,
    nev: "Gál Viktória",
    email: "gal.viktoria@example.com",
    jelszo: "viki1234",
    szuletesiDatum: "1990-12-24",
    szerep: "edzo"
}]

document.addEventListener("DOMContentLoaded", function(){
    userTablaFeltoltes();
});

function userTablaFeltoltes(){
    let tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';

    pelda.forEach(user => {
        let sor = document.createElement('tr');

        for (const key in user) {
            let cella = document.createElement('td');
            cella.textContent = user[key];
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