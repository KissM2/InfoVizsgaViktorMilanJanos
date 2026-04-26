-- =============================
-- FITLIFE DATABASE CREATION
-- =============================

CREATE DATABASE IF NOT EXISTS fitlife
CHARACTER SET utf8mb4
COLLATE utf8mb4_hungarian_ci;

USE fitlife;

-- LOGIN
CREATE TABLE IF NOT EXISTS login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    felh_nev VARCHAR(100) NOT NULL UNIQUE,
    jelszo VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telszam VARCHAR(30),
    nem VARCHAR(20),
    role ENUM('felhasznalo','edzo','admin') NOT NULL DEFAULT 'felhasznalo',
    szul_datum DATE,
    reset_token VARCHAR(255) NULL,
    reset_expires DATETIME NULL,
    deleted_at DATE DEFAULT NULL
);

-- CEL_ALAK
CREATE TABLE IF NOT EXISTS cel_alak (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nev VARCHAR(100) NOT NULL
);

-- EKM 
CREATE TABLE IF NOT EXISTS edzesen_kivuli_mozgas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    intenzitas VARCHAR(100) NOT NULL
);

-- FELHASZNALO
CREATE TABLE IF NOT EXISTS felhasznalo (
    felhasznalo_id INT PRIMARY KEY,
    testsuly FLOAT NOT NULL,
    magassag FLOAT NOT NULL,
    edzesre_forditott_ido INT NOT NULL,
    napi_kaloria_bevitel INT,
    cel_alak_id INT NOT NULL,
    cel_testsuly FLOAT,
    EKM_id INT NOT NULL, 
    FOREIGN KEY (felhasznalo_id) REFERENCES login(id),
    FOREIGN KEY (cel_alak_id) REFERENCES cel_alak(id),
    FOREIGN KEY (EKM_id) REFERENCES edzesen_kivuli_mozgas(id)
);

-- FELHASZNÁLÓ EDZÉSI NAPJAI
CREATE TABLE IF NOT EXISTS felhasznalo_edzesi_napok (
    felhasznalo_id INT NOT NULL,
    nap_sorszam INT NOT NULL,
    PRIMARY KEY (felhasznalo_id, nap_sorszam),
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id)
);

-- EDZO
CREATE TABLE IF NOT EXISTS edzo (
    edzo_id INT PRIMARY KEY,
    edzoterem_cim POINT,
    kep TEXT,
    idezet TEXT,
    leiras TEXT,
    kompetenciak TEXT,
    FOREIGN KEY (edzo_id) REFERENCES login(id)
);

-- GYAKORLAT
CREATE TABLE IF NOT EXISTS gyakorlat (
    gyakorlat_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(150) NOT NULL,
    leiras TEXT,
    kor INT NOT NULL,
    ismetles INT NOT NULL,
    tipus ENUM('sulyzós', 'saját_testsúlyos', 'kardió') NOT NULL
);

-- EDZESTERV
CREATE TABLE IF NOT EXISTS edzesterv (
    edzesterv_id INT AUTO_INCREMENT PRIMARY KEY,
    terv_csoport_id VARCHAR(50) NOT NULL,
    weekday_sorszam INT NOT NULL,
    gyakorlat_id INT NOT NULL,
    sorrend INT NOT NULL,
    felhasznalo_id INT NOT NULL,
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id),
    FOREIGN KEY (gyakorlat_id) REFERENCES gyakorlat(gyakorlat_id)
);

-- KELLEK
CREATE TABLE IF NOT EXISTS kellek (
    kellek_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(150) NOT NULL
);

-- EDZESTERV - GYAKORLAT
CREATE TABLE IF NOT EXISTS gyakorlatok_kivalasztasa (
    edzesterv_id INT NOT NULL,
    gyakorlat_id INT NOT NULL,
    PRIMARY KEY (edzesterv_id, gyakorlat_id),
    FOREIGN KEY (edzesterv_id) REFERENCES edzesterv(edzesterv_id),
    FOREIGN KEY (gyakorlat_id) REFERENCES gyakorlat(gyakorlat_id)
);

-- GYAKORLAT - KELLEK
CREATE TABLE IF NOT EXISTS kellekek_kivalasztasa (
    gyakorlat_id INT NOT NULL,
    kellek_id INT NOT NULL,
    PRIMARY KEY (gyakorlat_id, kellek_id),
    FOREIGN KEY (gyakorlat_id) REFERENCES gyakorlat(gyakorlat_id) ON DELETE CASCADE,
    FOREIGN KEY (kellek_id) REFERENCES kellek(kellek_id) ON DELETE CASCADE
);

-- ALLERGEN
CREATE TABLE IF NOT EXISTS allergen (
    allergen_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(150) NOT NULL,
    tipus ENUM('a', 'p') NOT NULL DEFAULT 'p'
);

-- FELHASZNALO - ALLERGEN
CREATE TABLE IF NOT EXISTS allergias_ra (
    felhasznalo_id INT NOT NULL,
    allergen_id INT NOT NULL,
    PRIMARY KEY (felhasznalo_id, allergen_id),
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id),
    FOREIGN KEY (allergen_id) REFERENCES allergen(allergen_id)
);

-- RECEPT
CREATE TABLE IF NOT EXISTS recept (
    recept_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(150) NOT NULL,
    leiras TEXT NOT NULL,
    etkezes_tipus VARCHAR(100) NOT NULL,
    zsir FLOAT NOT NULL,
    protein FLOAT NOT NULL,
    szenhidrat FLOAT NOT NULL
);

-- RECEPT - ALLERGEN
CREATE TABLE IF NOT EXISTS allergiat_okoz (
    recept_id INT NOT NULL,
    allergen_id INT NOT NULL,
    PRIMARY KEY (recept_id, allergen_id),
    FOREIGN KEY (recept_id) REFERENCES recept(recept_id) ON DELETE CASCADE,
    FOREIGN KEY (allergen_id) REFERENCES allergen(allergen_id) ON DELETE CASCADE
);

-- ETREND
CREATE TABLE IF NOT EXISTS etrend (
    etrend_id INT AUTO_INCREMENT PRIMARY KEY,
    weekday VARCHAR(20) NOT NULL,
    etkezes_sorszama INT NOT NULL,
    felhasznalo_id INT NOT NULL,
    recept_id INT NOT NULL,
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id),
    FOREIGN KEY (recept_id) REFERENCES recept(recept_id)
);

-- KOMMENT
CREATE TABLE IF NOT EXISTS komment (
    komment_id INT AUTO_INCREMENT PRIMARY KEY,
    szoveg TEXT NOT NULL,
    ertekeles INT NOT NULL,
    statusz ENUM('aktiv', 'inaktiv') NOT NULL DEFAULT 'aktiv',
    edzo_id INT NOT NULL,
    felhasznalo_id INT NOT NULL,
    FOREIGN KEY (edzo_id) REFERENCES edzo(edzo_id),
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id)
);

-- FOGLALAS
CREATE TABLE IF NOT EXISTS foglalas (
foglalas_id INT AUTO_INCREMENT PRIMARY KEY,
datum DATE,
start TIME,
end TIME,
statusz ENUM('aktiv', 'inaktiv','torolt') NOT NULL DEFAULT 'aktiv', 
edzo_id INT,
felhasznalo_id INT,
FOREIGN KEY (edzo_id) REFERENCES edzo(edzo_id),
FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id)
);

-- HETI_BEOSZTAS
CREATE TABLE IF NOT EXISTS heti_beosztas (
beo_id INT AUTO_INCREMENT PRIMARY KEY,
weekday int,
start TIME,
end TIME,
statusz ENUM('aktiv','torolt') NOT NULL DEFAULT 'aktiv', 
mettol_ervenyes DATE,
edzo_id INT,
FOREIGN KEY (edzo_id) REFERENCES edzo(edzo_id)
);

-- KULONLEGES_ALKALOM
CREATE TABLE IF NOT EXISTS kulonleges_alkalom (
ka_id INT AUTO_INCREMENT PRIMARY KEY,
datum DATE,
start TIME,
end TIME,
statusz ENUM('aktiv', 'inaktiv','torolt') NOT NULL DEFAULT 'aktiv', 
edzo_id INT,
FOREIGN KEY (edzo_id) REFERENCES edzo(edzo_id)
);

-- IZOMCSOPORT TÖRZZSTÁBLA
CREATE TABLE IF NOT EXISTS izomcsoport (
    izom_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(100) NOT NULL UNIQUE
);

-- KAPCSOLÓTÁBLA 
CREATE TABLE IF NOT EXISTS gyakorlat_izomcsoport (
    gyakorlat_id INT NOT NULL,
    izom_id INT NOT NULL,
    PRIMARY KEY (gyakorlat_id, izom_id),
    FOREIGN KEY (gyakorlat_id) REFERENCES gyakorlat(gyakorlat_id) ON DELETE CASCADE,
    FOREIGN KEY (izom_id) REFERENCES izomcsoport(izom_id) ON DELETE CASCADE
);

-- Insertek:

-- 1. Cél alakok
INSERT INTO cel_alak (id, nev) VALUES 
(1, 'Izomépítés'), 
(2, 'Fogyás'), 
(3, 'Erőemelés'), 
(4, 'Állóképesség');

-- 2. Edzésen kívüli mozgás (EKM)
INSERT INTO edzesen_kivuli_mozgas (id, intenzitas) VALUES 
(1, 'Ülőmunka (kevés mozgás)'), 
(2, 'Séta / Könnyű mozgás'), 
(3, 'Aktív fizikai munka'), 
(4, 'Rendszeres sport naponta');

-- 3. login tábla(felhasználók):
INSERT INTO login (felh_nev, jelszo, email, telszam, nem, role, szul_datum) VALUES 
('teszt_elek', '$2b$10$85wY6ThuC9.OkKaXnkoK4ezXmmluG0v3fIkK7AYRYBUHguDGsDM5O', 'elek@gmail.com', '+36201112233', 'Férfi', 'felhasznalo', '1995-05-10'), -- jelszo1
('kovacs_bela', '$2b$10$z5TWZ0KF1ulKMLV/XCH0vOfOOcbGD47RUfpJ6JOLphs0wU.lLPM5G', 'fitlife123123@gmail.com', '+36202223344', 'Férfi', 'felhasznalo', '1988-11-20'), -- jelszo2
('nagy_anna', '$2b$10$GdvOHW2kXCrNeo5Bozby1OZHkjjtr20J0yClzi9Az8BwcIDTezf5u', 'anna@gmail.com', '+36203334455', 'Nő', 'felhasznalo', '2000-01-15'), -- jelszo3
('szabo_peti', '$2b$10$kz/bxutu/RMIKsD4ou2rre1.Y.zj2jYgn3N4F79dSq1YyqTEsBYtC', 'peti@gmail.com', '+36204445566', 'Férfi', 'felhasznalo', '1992-07-30'), -- jelszo4
('horvath_kata', '$2b$10$eb8zzmXS8E0Kv9NGr4XPDelWWfguIOZ3BexnNkosblOjt/AXlHmgi', 'kata@gmail.com', '+36205556677', 'Nő', 'felhasznalo', '1998-03-22'), -- jelszo5
('kiss_gergo', '$2b$10$NAxxRxqe0NhdMaA8VC6hhOPS9fWn8AP6e94a65T/AiswynIE7XDaO', 'gergo@gmail.com', '+36206667788', 'Férfi', 'felhasznalo', '1990-09-05'), -- jelszo6
('molnar_zsofia', '$2b$10$JSVc8ofgkhE9LA5BvtIXaefNunM/xoxp6SuDJpiXEiVt.S8TrOjJu', 'zsofia@gmail.com', '+36207778899', 'Nő', 'felhasznalo', '2002-12-10'), -- jelszo7
('Togi', '$2b$10$7P1Jd4/xLmCpz.y2syZPxubyxrPUhdrxkgXydQw0LvHZPX3RvemnO', 'togi@fitlife.hu', '+36301112233', 'Férfi', 'edzo', '1998-05-12'), -- jelszo8
('Chris Tren', '$2b$10$NCNMNwhBaM7tAs7ga1rsyOQdfjt0gnJCn1UTf4IGNZtOe9KKSQgyO', 'chris@fitlife.hu', '+36302223344', 'Férfi', 'edzo', '2001-08-20'), -- jelszo9
('Mike Tren', '$2b$10$T8tb9l0D/tx0EsHNP1kbzeaKG1rI5rTU7GLCg0PISFuvSZ4uYz0t.', 'mike@fitlife.hu', '+36303334455', 'Férfi', 'edzo', '2001-08-20'), -- jelszo10
('Sara Saffari', '$2b$10$TF8piZtTMXchk8pdakgQreoS8fdfSupRztoCyh4JVZBnyqVrwJQAK', 'sara@fitlife.hu', '+36304445566', 'Nő', 'edzo', '2001-02-28'), -- jelszo11
('Rich Piana', '$2b$10$bBjGJwfBibiZykx0QTirN.GSamM6bDCWccbXYAwpr.UvoRAk.W9Ia', 'rich@fitlife.hu', '+36305556677', 'Férfi', 'edzo', '1970-02-21'), -- jelszo12
('Annabel Lucinda', '$2b$10$MwfyU50O47dVq8esK.Y5oOQ/8Eav4J/8qNKTR/JcCFZr2WETgddPq', 'annabel@fitlife.hu', '+36306667788', 'Nő', 'edzo', '1999-11-15'), -- jelszo13
('Keiani', '$2b$10$.Dd2HJ9ZNZWU1Cld6fNrnOgyvLosovy51a9J0X.2Tpo6xj59BziCC', 'keiani@fitlife.hu', '+36307778899', 'Nő', 'edzo', '2000-03-10'), -- jelszo14
('Krissy Cela', '$2b$10$xCgnJrNazlKK6aa5hI0Qde9lAi6SBFOF0ofNHAgMKu9dw.sSXRauu', 'krissy@fitlife.hu', '+36308889900', 'Nő', 'edzo', '1994-10-07'), -- jelszo15
('LeanBeefPatty', '$2b$10$jv80VhgQKqSWomukNnpZS.PCP3cgcW6cSXQxqwj.ckq0aDUr271J.', 'patty@fitlife.hu', '+36309990011', 'Nő', 'edzo', '1997-01-21'), -- jelszo16
('Alex Eubank', '$2b$10$aZZaO8zQpU/UhCWN5lK9.ueSZDWByA8HTHt3JU4Cb51vFHxN0s3KS', 'alex@fitlife.hu', '+36300001122', 'Férfi', 'edzo', '2000-05-23'), -- jelszo17
('Sam Sulek', '$2b$10$lJAZ3uel0KEm1lIaxflNhOP1Qyr401JoncdXqmpPIrrmBPloSLxsK', 'sam@fitlife.hu', '+36300002233', 'Férfi', 'edzo', '2002-02-07'), -- jelszo18
('David Laid', '$2b$10$9UqffWtV6z0Yy057l2SPyOu/qzr1QLGKUT40NazWTXpFfJE2XVZqK', 'david@fitlife.hu', '+36300003344', 'Férfi', 'edzo', '1998-01-29'), -- jelszo19
('Whitney Simmons', '$2b$10$XpnQTUH6j2A0WekJjlCt3uwwc3rAdBeXpJTOI9UaKlqZuo/Km4M96', 'whitney@fitlife.hu', '+36300004455', 'Nő', 'edzo', '1993-02-27'), -- jelszo20
('Pamela Reif', '$2b$10$9MyhOgI2tacQQlQOv/UH7.je1fouxwIwZs37n115fnVvbnESfP8ce', 'pamela@fitlife.hu', '+36300005566', 'Nő', 'edzo', '1996-07-09'); -- jelszo21

-- 3. login tábla(adminok):
INSERT INTO login(felh_nev, jelszo, email, role) VALUES 
('Admin János', '$2b$10$0HCK1iiFSfA1viP8LT4G.eF6Wlf0wWtCsQJJhbpxQP88Awsa43zCi', 'admin.janos@fitlife.hu','admin'), -- jelszo22
('Admin Anna', '$2b$10$krPgMJVf3uN.qfII6pJlHehtQ9lK5W9OeJiUp0lUaHd4nyoguo6F6', 'admin.anna@fitlife.hu','admin'), -- jelszo23
('Admin Milán', '$2b$10$SaGyx1ZnFFhXLCq0QXtlxeRplNMqp0oFm./q6EuQ2Co48uR6b5gEG', 'admin.milan@fitlife.hu','admin'), -- jelszo24
('Admin Bálint', '$2b$10$ayGcbvMeSaZa2w.V2zpnGePY.xNqOzSN32itMvueuZHgwriwhgbri', 'admin.balint@fitlife.hu','admin'), -- jelszo25
('Admin Gergely', '$2b$10$w8VGjHxXECKIQXQjmJkk4O2ArMg1JqGTnlfYz.k47fHK/IC/DDH02', 'admin.gergely@fitlife.hu','admin'), -- jelszo26
('Admin Béla', '$2b$10$5bFSgJGtJh4L7g96Q82qqOeL1s4MHm5679HL47pdE.LW6RvR52BQG', 'admin.bela@fitlife.hu','admin'); -- jelszo27

-- 4. gyakorlat tábla:
INSERT INTO gyakorlat ( nev, leiras, kor, ismetles) VALUES 
-- MELL (15 gyakorlat)
( 'Fekvenyomás rúddal', 'Klasszikus nyomás vízszintes padon.', 4, 10),
( 'Fekvenyomás kézisúlyzóval', 'Vízszintes nyomás egykezes súlyzókkal.', 4, 10),
( 'Fekvenyomás ferdepadon rúddal', 'Felső mellizom fókuszú nyomás.', 4, 10),
( 'Fekvenyomás ferdepadon kézisúlyzóval', 'Felső mellizom egykezes súlyzókkal.', 4, 10),
( 'Fekvenyomás negatív padon', 'Alsó mellizom fókuszú nyomás.', 3, 12),
( 'Tárogatás egyenes padon', 'Íves mozdulat vízszintes padon.', 3, 12),
( 'Tárogatás ferdepadon', 'Íves mozdulat ferdepadon.', 3, 12),
( 'Tárogatás gépen (Pec Deck)', 'Izolációs mellgyakorlat gépen.', 4, 12),
( 'Kábel keresztezés fentről', 'Alsó és belső mellizom fókusz.', 4, 15),
( 'Kábel keresztezés alulról', 'Felső mellizom fókusz csigán.', 4, 15),
( 'Tolódzkodás mellre', 'Saját testsúlyos gyakorlat előredőlve.', 3, 10),
( 'Áthúzás kézisúlyzóval', 'Mellkas tágító gyakorlat.', 3, 12),
( 'Fekvőtámasz', 'Klasszikus saját testsúlyos gyakorlat.', 4, 20),
( 'Széles fekvőtámasz', 'Szélesebb fogású fekvőtámasz.', 3, 15),
( 'Súlytárcsa nyomás (Svend Press)', 'Tárcsa préselése és nyomása előre.', 3, 15),

-- HÁT (15 gyakorlat)
( 'Húzódzkodás széles fogással', 'Saját testsúlyos széleshát fókusz.', 4, 8),
( 'Húzódzkodás szűk fogással', 'Alsó hát és bicepsz fókusz.', 4, 8),
( 'Lehúzás csigán széles fogással', 'Széleshátizom gépgyakorlat.', 4, 10),
( 'Lehúzás csigán szűk fogással', 'V-fogantyús lehúzás.', 4, 10),
( 'Evezés rúddal döntött törzzsel', 'Vastagító hátgyakorlat rúddal.', 4, 10),
( 'Evezés egykezes súlyzóval', 'Fűrészelés padon támaszkodva.', 4, 10),
( 'T-rudas evezés', 'Döntött törzsű evezés T-rúddal.', 4, 10),
( 'Evezés alsó csigán', 'Ülő evezés szűk fogással.', 4, 12),
( 'Evezés melltámasszal', 'Kíméli a derekat, izolált evezés.', 4, 12),
( 'Felhúzás (Deadlift)', 'Összetett erőgyakorlat hátra és lábra.', 4, 5),
( 'Hiperhajlítás', 'Alsóhát (merevítő) gyakorlat padon.', 4, 15),
( 'Áthúzás csigán egyenes karral', 'Széleshátizom izoláció csigán.', 4, 15),
( 'Fordított tárogatás gépen', 'Hátsó delták és lapocka környéke.', 4, 12),
( 'Evezés padon (Seal Row)', 'Vízszintes padon fekve végzett evezés.', 4, 10),
( 'Jóreggelt gyakorlat', 'Alsóhát rúd a nyakban.', 3, 12),

-- VÁLL (12 gyakorlat)
('Mellből nyomás rúddal', 'Klasszikus vállnyomás állva vagy ülve.', 4, 10),
('Vállnyomás egykezes súlyzóval', 'Ülő nyomás egykezesekkel.', 4, 10),
('Oldalemelés', 'Oldalsó delta izolálása egykezesekkel.', 4, 12),
('Előreemelés', 'Elülső delta fókusz súlyzóval vagy tárcsával.', 3, 12),
('Döntött törzsű oldalemelés', 'Hátsó delta gyakorlat egykezesekkel.', 4, 12),
('Arnold nyomás', 'Csavaró mozdulatos vállnyomás.', 4, 10),
('Archoz húzás (Face pull)', 'Hátsó delta és rotátorköpeny csigán.', 4, 15),
('Oldalemelés csigán', 'Folyamatos feszülést biztosító oldalemelés.', 4, 12),
('Evezés állhoz rúddal', 'Széles váll fókuszú húzó mozdulat.', 4, 10),
('Vállvonogatás rúddal', 'Csuklyásizom gyakorlat.', 4, 15),
('Vállvonogatás egykezesekkel', 'Csuklyásizom izolációja.', 4, 15),
('Fordított pec-deck', 'Hátsó delta gépen.', 4, 12),
-- BICEPSZ (10 gyakorlat)
('Bicepsz állva rúddal', 'Alap tömegnövelő bicepsz gyakorlat.', 4, 10),
('Váltott karú bicepsz', 'Álló vagy ülő hajlítás egykezesekkel.', 4, 10),
('Kalapács bicepsz', 'Kétfejű karizom és brachialis fókusz.', 4, 12),
('Koncentrált bicepsz', 'Izolációs gyakorlat combon támasztva.', 3, 12),
('Scott-pados hajlítás', 'Bicepsz alsó tapadási pontjának terhelése.', 4, 10),
('Bicepsz alsó csigán', 'Folyamatos feszülésű hajlítás rúddal.', 4, 12),
('Francia rudas bicepsz', 'Csuklókímélő álló bicepsz.', 4, 10),
('Bicepsz pók padon', 'Előredőlve végzett izolációs hajlítás.', 3, 12),
('21-es bicepsz', 'Részismétléses intenzitásnövelő módszer.', 3, 21),
('Keresztező kalapács', 'Test előtt vezetett kalapács hajlítás.', 3, 12),
-- TRICEPSZ (10 gyakorlat)
('Letolás csigán kötéllel', 'Tricepsz külső fejének izolációja.', 4, 12),
('Letolás csigán egyenes rúddal', 'Nagyobb súlyos tricepsz gyakorlat.', 4, 10),
('Homlokzatra engedés (Koponyazúzó)', 'Fekve végzett hajlítás francia rúddal.', 4, 10),
('Lórugás egykezes súlyzóval', 'Döntött törzsű tricepsz extenzió.', 3, 12),
('Tricepsz nyomás fej felett egykezessel', 'Tricepsz hosszú fejének nyújtása.', 4, 10),
('Szűk nyomás padon', 'Tömegnövelő tricepsz alapgyakorlat.', 4, 8),
('Tolódzkodás padon', 'Saját testsúlyos tricepsz gyakorlat.', 4, 15),
('Köteles nyomás fej felett csigán', 'Hosszú fej fókusz kábelen.', 4, 12),
('Egykezes fordított letolás', 'Alsó fogásos izoláció csigán.', 3, 15),
('Tricepsz fekvőtámasz (Gyémánt)', 'Szűk kéztartásos fekvőtámasz.', 3, 15),
-- ALKAR
('Csuklóbehúzás rúddal', 'Alkar hajlító izmai padon támasztva.', 4, 15),
('Csuklófeszítés rúddal', 'Alkar feszítő izmai padon támasztva.', 4, 15),
('Fordított fogású bicepsz', 'Brachioradialis (alkar) és bicepsz.', 4, 12),
('Zottman hajlítás', 'Fel- és lefelé más fogással végzett hajlítás.', 3, 12),
('Farmer séta', 'Nehéz súlyok cipelése a szorítás javításáért.', 4, 1),
('Tárcsa csípés (Pinch Grip)', 'Tárcsák ujjheggyel tartása.', 3, 1),
('Csuklóbehúzás egykezesekkel', 'Egykezes izoláció padon.', 3, 15),
('Csavarás rúddal (Wrist roller)', 'Súly feltekerése rúdra.', 3, 1),

-- QUADRICEPS
('Guggolás rúddal', 'Összetett alapgyakorlat a teljes combra.', 4, 8),
('Elölguggolás', 'Rúd a kulcscsonton, domináns Quadriceps terhelés.', 4, 10),
('Lábtolás gépen', 'Nagy súlyos nyomás háttámasszal.', 4, 12),
('Lábnyújtás gépen', 'Izolációs gyakorlat a Quadriceps fejeire.', 4, 15),
('Hack-guggolás', 'Gépen végzett guggolás, stabil törzzsel.', 4, 10),
('Sissy guggolás', 'Saját testsúlyos feszítés a comb elülső részére.', 3, 12),
('Bolgár guggolás', 'Egy lábas guggolás, intenzív feszítő munka.', 3, 10),
('Kehely guggolás', 'Súlyzóval végzett mély guggolás.', 4, 12),
('Kitörés előre', 'Dinamikus lábgyakorlat a combfeszítőnek.', 3, 12),
('Lépcsőzés súllyal', 'Funkcionális Quadriceps és állóképesség.', 3, 15),
-- HAMSTRING (8 gyakorlat)
('Merevlábas felhúzás', 'Hamstring nyújtása és terhelése rúddal.', 4, 10),
('Lábhajlítás fekve', 'Gépi izoláció a comb hátsó részére.', 4, 12),
('Lábhajlítás ülve', 'Koncentrált Hamstring gyakorlat gépen.', 4, 12),
('Jóreggelt gyakorlat', 'Csípőhajlítás rúddal a nyakban.', 3, 12),
('Római székes hajlítás', 'Saját testsúlyos Hamstring izoláció.', 3, 10),
('Sumo felhúzás', 'Széles terpeszű emelés Hamstring fókusszal.', 4, 8),
('Lábhajlítás állva', 'Egy lábas gépi hajlítás.', 3, 12),
('Nordic hajlítás', 'Excentrikus Hamstring erősítés.', 3, 8),
-- FARIZOM (6 gyakorlat)
('Csípőfeltolás (Hip Thrust)', 'A leghatékonyabb farizom építő mozgás.', 4, 10),
('Kábeles hátrarúgás', 'Izolált farizom edzés csigán.', 3, 15),
('Combtávolítás gépen', 'A külső farizmok (abduktorok) edzése.', 3, 15),
('Fellépés padra', 'Magasra lépés farizom fókusszal.', 3, 12),
('Kagyló gyakorlat', 'Rehabilitációs és aktivációs farizom munka.', 3, 20),
('Széles guggolás (Plié)', 'Belső comb és farizom fókusz.', 3, 15),
-- VÁDLI (6 gyakorlat)
('Vádli állva gépen', 'Teljes lábszár izomzat terhelése.', 4, 15),
('Vádli ülve gépen', 'A mélyen fekvő gázlóizom edzése.', 4, 20),
('Szamárvádli', 'Döntött törzsű vádli gyakorlat.', 3, 15),
('Vádli lábtológépen', 'Bokahajlítás lábtoló gépen.', 4, 15),
('Vádli állva egy lábon', 'Saját testsúlyos egyensúly és vádli.', 3, 20),
('Fordított vádli', 'A sípcsonti izom erősítése.', 3, 15);

-- 5. kellek tábla:
INSERT INTO kellek( nev) VALUES 
('súlyzó'),
('kézi súlyzó'),
('állítható súlyzó'),
('kettlebell'),
('súlytárcsa'),
('súlyrúd'),
('egyenes rúd'),
('francia rúd'),
('trap bar'),
('húzódzkodó rúd'),
('fekvenyomó pad'),
('állítható pad'),
('guggoló állvány'),
('power rack'),
('smith keret'),
('csigás gép'),
('multifunkciós edzőgép'),
('lábtoló gép'),
('combfeszítő gép'),
('combhajlító gép'),
('vállnyomó gép'),
('mellgép'),
('háthúzó gép'),
('evezőgép'),
('futópad'),
('szobakerékpár'),
('ellipszis tréner'),
('lépcsőző gép'),
('ugrókötél'),
('fitnesz szalag'),
('ellenállás szalag'),
('gumiszalag'),
('TRX heveder'),
('súlymellény'),
('bokasúly'),
('csuklósúly'),
('medicinlabda'),
('fitball'),
('pilates labda'),
('egyensúlyozó labda'),
('balance board'),
('bosu labda'),
('jóga matrac'),
('fitnesz matrac'),
('foam roller'),
('masszázs henger'),
('kézi erősítő'),
('markolat erősítő'),
('tolódzkodó keret'),
('paralel rúd'),
('haskerék'),
('csúszó korong'),
('step pad'),
('step pad platform'),
('box ugróplatform'),
('agility létra'),
('koordinációs bója'),
('gyorsasági ernyő'),
('szánkó húzó eszköz'),
('kötél (battle rope)'),
('mászókötél'),
('súlyemelő öv'),
('csuklószorító'),
('térdszorító'),
('edzőkesztyű'),
('nyakpárna súlyemeléshez'),
('vízzel tölthető súly'),
('homokzsák'),
('súlyzsák'),
('falilabda'),
('reflexlabda'),
('boxzsák'),
('álló boxzsák'),
('boxkesztyű'),
('speed bag'),
('ugró doboz'),
('stretching szalag'),
('jóga blokk'),
('jóga heveder'),
('tornakarika'),
('svédszekrény'),
('bordásfal'),
('tornagyűrű'),
('mászófal panel'),
('core tréner rúd'),
('landmine adapter'),
('kábeles fogantyú'),
('tricepsz kötél'),
('lat lehúzó rúd'),
('V fogantyú'),
('golyós súlyfogantyú');

-- 6. allergen tábla:
INSERT INTO allergen(nev,tipus) VALUES
('búza', 'a'),
('rozs','a'),
('árpa','a'),
('zab','a'),
('rákfélék','a'),
('tojás','a'),
('hal','a'),
('földimogyoró','a'),
('szójabab','a'),
('tej','a'),
('laktóz','a'),
('mandula','a'),
('mogyoró','a'),
('dió','a'),
('kesudió','a'),
('pekándió','a'),
('brazil dió','a'),
('pisztácia','a'),
('makadámdió','a'),
('zeller','a'),
('mustár','a'),
('szezámmag','a'),
('kén-dioxid és szulfitok','a'),
('csillagfürt','a'),
('puhatestűek','a'),
('kagyló','a'),
('osztriga','a'),
('csiga','a'),
('tintahal','a');
INSERT INTO allergen(nev) VALUES
('gomba'),
('tök'),
('cukkini'),
('padlizsán'),
('kelbimbó'),
('brokkoli'),
('karfiol'),
('káposzta'),
('vöröskáposzta'),
('savanyú káposzta'),
('spenót'),
('sóska'),
('cékla'),
('retek'),
('torma'),
('hagyma'),
('fokhagyma'),
('póréhagyma'),
('petrezselyemgyökér'),
('kapor'),
('koriander'),
('olívabogyó'),
('articsóka'),
('spárga'),
('zöldbab'),
('lencse'),
('csicseriborsó'),
('babfélék'),
('tofu'),
('máj'),
('véres hurka'),
('disznósajt'),
('pacal'),
('velő'),
('kocsonya'),
('szalonna (zsíros része)'),
('tonhal'),
('szardínia'),
('hering'),
('makréla'),
('polip'),
('tojás (főtt)'),
('tojás (lágytojás)'),
('ananasz'),
('mazsola'),
('aszalt gyümölcsök'),
('grépfrút'),
('avokádó'),
('csípős paprika'),
('chili'),
('ecetes ételek'),
('zselatinos édességek'),
('marcipán'),
('édesgyökér'),
('lakritz');

-- 7. recept tábla:
INSERT INTO recept (nev, leiras, etkezes_tipus, zsir, protein, szenhidrat) VALUES
('Csirkés rizstál','Hozzávalók: csirkemell, rizs, brokkoli, só, bors. Elkészítés: a rizst főzd meg, a csirkemellet kockázva süsd meg serpenyőben, párold a brokkolit majd keverd össze.','ebed',5,38,55), -- brokkoli
('Zabkása mogyoróvajjal','Hozzávalók: zabpehely, víz vagy tej, mogyoróvaj, banán. Elkészítés: a zabot főzd krémesre, keverd bele a mogyoróvajat és a felszeletelt banánt.','reggeli',12,15,60), -- zab, földimogyoró
('Pulykamell saláta','Hozzávalók: pulykamell, salátakeverék, paradicsom, olívaolaj. Elkészítés: grillezd a pulykát, majd szeleteld és keverd a salátához.','vacsora',6,34,10), --
('Tojásos avokádó toast','Hozzávalók: teljes kiőrlésű kenyér, tojás, avokádó. Elkészítés: pirítsd meg a kenyeret, főzz tojást, az avokádót villával törd össze és kend a kenyérre.','reggeli',14,20,28), -- tojás, búza, avokádó
('Tonhalas rizs','Hozzávalók: tonhalkonzerv, főtt rizs, kukorica, citromlé. Elkészítés: keverd össze az összetevőket egy tálban.','ebed',4,32,50), -- tonhal
('Csirkés quinoa saláta','Hozzávalók: quinoa, csirkemell, uborka, paradicsom. Elkészítés: főzd meg a quinoát, süsd meg a csirkét és keverd össze a zöldségekkel.','ebed',6,36,40), --
('Protein palacsinta','Hozzávalók: tojás, fehérjepor, zabpehely. Elkészítés: turmixold össze, majd süsd ki palacsintaként.','reggeli',7,30,20), -- tojás, zab, tej
('Lazac brokkolival','Hozzávalók: lazacfilé, brokkoli, citrom. Elkészítés: süsd meg a lazacot sütőben, párold a brokkolit.','vacsora',14,34,6), -- hal, brokkoli
('Csirkés wrap','Hozzávalók: tortilla, csirkemell, saláta, joghurtos öntet. Elkészítés: süsd meg a csirkét, töltsd a tortillába a salátával együtt.','ebed',7,32,40), -- búza, tej
('Zöldséges omlett','Hozzávalók: tojás, spenót, hagyma. Elkészítés: a tojásokat felverve süsd meg a zöldségekkel együtt.','reggeli',9,22,6), -- tojás, spenót, hagyma
('Csirkés bulgur','Hozzávalók: bulgur, csirkemell, paprika. Elkészítés: főzd meg a bulgurt, a csirkét kockázva pirítsd meg és keverd össze.','ebed',5,35,45), -- búza
('Pulyka burger','Hozzávalók: darált pulykahús, teljes kiőrlésű zsemle, saláta. Elkészítés: süsd meg a húspogácsát, majd rakd össze a burgert.','ebed',8,32,40), -- búza
('Túrós zabkása','Hozzávalók: zabpehely, túró, méz. Elkészítés: főzd meg a zabkását, majd keverd bele a túrót.','reggeli',6,25,50), -- zab, tej
('Csirkés karfiolrizs','Hozzávalók: csirkemell, karfiol, fűszerek. Elkészítés: reszeld le a karfiolt rizs állagúra, pirítsd csirkével.','vacsora',5,35,12), -- karfiol
('Makréla saláta','Hozzávalók: makréla, saláta, paradicsom. Elkészítés: a makrélát keverd a salátával.','vacsora',13,30,5), -- makréla
('Babos csirketál','Hozzávalók: csirkemell, vörösbab, rizs. Elkészítés: főzd meg a rizst, süsd a csirkét és keverd össze a babbal.','ebed',6,38,60), -- babfélék
('Avokádós csirke saláta','Hozzávalók: csirkemell, avokádó, saláta. Elkészítés: grillezd a csirkét és keverd össze az avokádóval.','vacsora',12,34,8), -- avokádó
('Tonhalas tészta','Hozzávalók: teljes kiőrlésű tészta, tonhal, paradicsom. Elkészítés: főzd meg a tésztát és keverd össze tonhallal.','ebed',7,32,65), -- búza, tonhal
('Protein joghurt gyümölccsel','Hozzávalók: natúr joghurt, fehérjepor, bogyós gyümölcs. Elkészítés: keverd össze egy tálban.','csemege',3,24,15), -- tej
('Csirkés zöldségleves','Hozzávalók: csirkemell, sárgarépa, zeller. Elkészítés: főzd össze alaplében.','vacsora',3,20,10), -- zeller
('Pulykás rizottó','Hozzávalók: rizs, pulykamell, hagyma. Elkészítés: pirítsd meg a húst, add hozzá a rizst és főzd puhára.','ebed',6,34,55), -- hagyma
('Tofu stir fry','Hozzávalók: tofu, brokkoli, szójaszósz. Elkészítés: pirítsd össze wokban.','ebed',9,20,18), -- tofu, szójabab, brokkoli
('Zab muffin','Hozzávalók: zabpehely, tojás, banán. Elkészítés: keverd össze és süsd muffin formában.','csemege',5,10,30), -- zab, tojás
('Grillezett csirke saláta','Hozzávalók: csirkemell, uborka, paradicsom. Elkészítés: grillezd a csirkét és keverd a zöldségekkel.','vacsora',4,36,8), --
('Lazac quinoa bowl','Hozzávalók: lazac, quinoa, spárga. Elkészítés: süsd meg a lazacot és tálald quinoával.','vacsora',14,35,30), -- hal, spárga
('Csirkés kuszkusz','Hozzávalók: kuszkusz, csirkemell, paprika. Elkészítés: főzd meg a kuszkuszt és keverd a csirkével.','ebed',5,34,50), -- búza
('Tojásos rizs','Hozzávalók: rizs, tojás, szójaszósz. Elkészítés: pirítsd össze serpenyőben.','ebed',9,20,45), -- tojás, szójabab
('Mandulás zabkása','Hozzávalók: zabpehely, mandula, méz. Elkészítés: főzd meg a zabot és szórd meg mandulával.','reggeli',10,15,50), -- zab, mandula
('Csirkés brokkoli rizs','Hozzávalók: csirkemell, rizs, brokkoli. Elkészítés: párold a brokkolit és keverd a csirkével.','ebed',5,38,55), -- brokkoli
('Protein zabgolyó','Hozzávalók: zabpehely, fehérjepor, mogyoróvaj. Elkészítés: keverd össze és formázz golyókat.','csemege',8,20,25), -- zab, földimogyoró
('Csirkés édesburgonya tál','Hozzávalók: csirkemell, édesburgonya, olívaolaj, só, bors. Elkészítés: az édesburgonyát kockázd fel és süsd meg sütőben, a csirkemellet serpenyőben süsd aranybarnára, majd tálald együtt.','ebed',6,38,45), --
('Protein zabturmix','Hozzávalók: zabpehely, fehérjepor, tej vagy víz, banán. Elkészítés: turmixold össze az összes hozzávalót krémes állagúra.','reggeli',4,28,50), -- zab, tej
('Pulykás saláta','Hozzávalók: pulykamell, saláta, paradicsom, uborka. Elkészítés: grillezd a pulykamellet, majd szeleteld fel és keverd a salátával.','vacsora',4,35,8), --
('Tojásos zabpalacsinta','Hozzávalók: zabpehely, tojás, tej. Elkészítés: turmixold össze, majd serpenyőben süsd ki palacsinta formában.','reggeli',7,24,30), -- zab, tojás, tej
('Tonhalas kuszkusz','Hozzávalók: tonhal, kuszkusz, citromlé, paradicsom. Elkészítés: készítsd el a kuszkuszt, majd keverd össze tonhallal.','ebed',5,30,45), -- tonhal, búza
('Grillezett csirke cukkínivel','Hozzávalók: csirkemell, cukkini, fokhagyma. Elkészítés: süsd meg a csirkét grillen, a cukkinit serpenyőben pirítsd.','vacsora',5,36,10), -- cukkini, fokhagyma
('Protein túrókrém','Hozzávalók: túró, fehérjepor, méz. Elkészítés: keverd össze egy tálban krémesre.','csemege',3,28,12), -- tej
('Marhahúsos rizstál','Hozzávalók: sovány darált marhahús, rizs, paprika. Elkészítés: pirítsd meg a húst, főzd meg a rizst és keverd össze.','ebed',9,40,55), --
('Csirkés brokkoli quinoa','Hozzávalók: csirkemell, quinoa, brokkoli. Elkészítés: főzd meg a quinoát, párold a brokkolit, majd keverd össze a csirkével.','ebed',5,37,40), -- brokkoli
('Zöldséges tofu tál','Hozzávalók: tofu, paprika, brokkoli, szójaszósz. Elkészítés: pirítsd össze wokban.','ebed',9,22,18), -- tofu, szójabab, brokkoli
('Protein chia puding','Hozzávalók: chia mag, tej, fehérjepor. Elkészítés: keverd össze és hagyd állni hűtőben.','reggeli',8,22,15), -- tej
('Pulykás wrap','Hozzávalók: tortilla, pulykamell, saláta. Elkészítés: grillezd a húst, majd töltsd tortillába.','ebed',7,32,42), -- búza
('Tojásos spenótos omlett','Hozzávalók: tojás, spenót, hagyma. Elkészítés: a tojásokat felverve süsd meg a zöldségekkel.','reggeli',9,24,6), -- tojás, spenót, hagyma
('Csirkés bulgur saláta','Hozzávalók: bulgur, csirkemell, paradicsom. Elkészítés: főzd meg a bulgurt, keverd össze csirkével és zöldségekkel.','ebed',5,34,45), -- búza
('Lazacos avokádó saláta','Hozzávalók: lazac, avokádó, saláta. Elkészítés: süsd meg a lazacot és keverd össze az avokádóval.','vacsora',14,34,10), -- hal, avokádó
('Babos csirke chili','Hozzávalók: csirkemell, bab, paradicsomszósz, chili. Elkészítés: főzd össze az összetevőket egy lábasban.','ebed',6,38,40), -- babfélék, chili
('Zabos protein muffin','Hozzávalók: zabpehely, tojás, fehérjepor. Elkészítés: keverd össze és süsd muffin formában.','csemege',6,18,28), -- zab, tojás
('Grillezett tonhal steak','Hozzávalók: tonhal steak, citrom, olívaolaj. Elkészítés: süsd meg grillen oldalanként pár percig.','vacsora',8,36,0), -- tonhal
('Pulykás rizs tál','Hozzávalók: pulykamell, rizs, paprika. Elkészítés: süsd meg a húst, majd keverd össze a főtt rizzsel.','ebed',5,36,55), --
('Mandulás zabkása','Hozzávalók: zabpehely, mandula, méz. Elkészítés: főzd meg a zabot és szórd meg mandulával.','reggeli',10,16,50), -- zab, mandula
('Csirkés karfiol stir fry','Hozzávalók: csirkemell, karfiol, szójaszósz. Elkészítés: pirítsd össze wokban.','vacsora',5,35,12), -- karfiol, szójabab
('Tojásos rizs zöldségekkel','Hozzávalók: rizs, tojás, brokkoli, répa. Elkészítés: pirítsd össze serpenyőben.','ebed',9,22,48), -- tojás, brokkoli
('Protein smoothie bogyós gyümölccsel','Hozzávalók: fehérjepor, tej, bogyós gyümölcs. Elkészítés: turmixold össze.','csemege',3,26,20), -- tej
('Csirkés lencsesaláta','Hozzávalók: csirkemell, főtt lencse, paradicsom. Elkészítés: keverd össze egy tálban.','ebed',5,36,30), -- lencse
('Makréla quinoa tál','Hozzávalók: makréla, quinoa, uborka. Elkészítés: főzd meg a quinoát, majd keverd a makrélával.','vacsora',13,30,35), -- makréla
('Protein zabkása','Hozzávalók: zabpehely, fehérjepor, tej. Elkészítés: főzd össze krémes állagúra.','reggeli',5,30,45), -- zab, tej
('Pulyka burger salátával','Hozzávalók: pulykahús pogácsa, saláta, paradicsom. Elkészítés: süsd meg a pogácsát és tálald salátával.','ebed',9,34,12), --
('Csirkés zöldbab','Hozzávalók: csirkemell, zöldbab, fokhagyma. Elkészítés: pirítsd össze serpenyőben.','vacsora',5,35,10), -- zöldbab, fokhagyma
('Tonhalas rizssaláta','Hozzávalók: tonhal, rizs, kukorica. Elkészítés: keverd össze hidegen.','ebed',5,30,50), -- tonhal
('Avokádós tojás saláta','Hozzávalók: tojás, avokádó, saláta. Elkészítés: főzd meg a tojást, majd keverd az avokádóval.','reggeli',14,22,10), -- tojás, avokádó
('Csirkés rizs brokkolival','Hozzávalók: csirkemell, rizs, brokkoli, só, bors. Elkészítés: a rizst főzd meg, a csirkét serpenyőben süsd meg, a brokkolit párold, majd keverd össze.','ebed',5,38,55), -- brokkoli
('Zabkása almával','Hozzávalók: zabpehely, tej vagy víz, alma, fahéj. Elkészítés: a zabot főzd krémesre, add hozzá a reszelt almát és a fahéjat.','reggeli',4,12,55), -- zab
('Pulykás quinoa tál','Hozzávalók: pulykamell, quinoa, paprika. Elkészítés: főzd meg a quinoát, a pulykát pirítsd meg, majd tálald együtt.','ebed',6,34,40), --
('Tojásos avokádó saláta','Hozzávalók: tojás, avokádó, saláta. Elkészítés: főzd meg a tojást, szeleteld fel, majd keverd össze az avokádóval és salátával.','reggeli',14,22,10), -- tojás, avokádó
('Tonhalas salátatál','Hozzávalók: tonhal, salátakeverék, paradicsom. Elkészítés: keverd össze egy tálban és locsold meg citromlével.','vacsora',6,30,8), -- tonhal
('Protein zabturmix','Hozzávalók: zabpehely, fehérjepor, tej, banán. Elkészítés: turmixold össze krémes állagúra.','reggeli',4,28,45), -- zab, tej
('Csirkés bulgur','Hozzávalók: bulgur, csirkemell, paprika. Elkészítés: főzd meg a bulgurt, süsd meg a csirkét és keverd össze.','ebed',5,36,50), -- búza
('Lazac spárgával','Hozzávalók: lazacfilé, spárga, citrom. Elkészítés: a lazacot süsd meg sütőben, a spárgát párold.','vacsora',14,34,6), -- hal, spárga
('Zabpalacsinta banánnal','Hozzávalók: zabpehely, tojás, banán. Elkészítés: turmixold össze és süsd palacsintának.','reggeli',6,20,35), -- zab, tojás
('Pulykás saláta','Hozzávalók: pulykamell, saláta, uborka, paradicsom. Elkészítés: grillezd a pulykát és keverd a zöldségekhez.','vacsora',4,34,10), --
('Csirkés karfiolrizs','Hozzávalók: csirkemell, karfiol, fokhagyma. Elkészítés: reszeld a karfiolt rizs állagúra, majd pirítsd össze csirkével.','vacsora',5,35,12), -- karfiol, fokhagyma
('Protein joghurt','Hozzávalók: natúr joghurt, fehérjepor, méz. Elkészítés: keverd össze egy tálban.','csemege',3,25,12), -- tej
('Csirkés tészta','Hozzávalók: teljes kiőrlésű tészta, csirkemell, paradicsomszósz. Elkészítés: főzd meg a tésztát, majd keverd össze csirkével és szósszal.','ebed',7,32,60), -- búza
('Babos pulykatál','Hozzávalók: pulykamell, vörösbab, rizs. Elkészítés: főzd meg a rizst, a pulykát süsd meg és keverd a babbal.','ebed',6,38,50), -- babfélék
('Zöldséges tofu wok','Hozzávalók: tofu, brokkoli, paprika, szójaszósz. Elkészítés: pirítsd össze wokban.','ebed',9,20,18), -- tofu, szójabab, brokkoli
('Mandulás zabkása','Hozzávalók: zabpehely, mandula, méz. Elkészítés: főzd meg a zabot és szórd meg mandulával.','reggeli',10,15,50), -- zab, mandula
('Makréla saláta','Hozzávalók: makréla, saláta, paradicsom. Elkészítés: keverd össze hidegen.','vacsora',13,28,5), -- makréla
('Csirkés quinoa','Hozzávalók: quinoa, csirkemell, uborka. Elkészítés: főzd meg a quinoát, majd keverd össze a csirkével.','ebed',6,36,40), --
('Protein muffin','Hozzávalók: zabpehely, tojás, fehérjepor. Elkészítés: keverd össze és süsd muffin formában.','csemege',6,18,28), -- zab, tojás
('Tonhalas rizs','Hozzávalók: tonhal, rizs, citromlé. Elkészítés: keverd össze egy tálban.','ebed',4,32,50), -- tonhal
('Tojásos omlett spenóttal','Hozzávalók: tojás, spenót, hagyma. Elkészítés: a tojást felverve süsd meg a zöldségekkel.','reggeli',9,24,6), -- tojás, spenót, hagyma
('Csirkés zöldbab','Hozzávalók: csirkemell, zöldbab, fokhagyma. Elkészítés: pirítsd össze serpenyőben.','vacsora',5,35,10), -- zöldbab, fokhagyma
('Pulykás rizottó','Hozzávalók: rizs, pulykamell, hagyma. Elkészítés: pirítsd meg a húst, add hozzá a rizst és főzd puhára.','ebed',6,34,55), -- hagyma
('Protein turmix','Hozzávalók: fehérjepor, tej, banán. Elkészítés: turmixold össze.','csemege',3,26,25), -- tej
('Lazacos quinoa bowl','Hozzávalók: lazac, quinoa, uborka. Elkészítés: süsd meg a lazacot és tálald quinoával.','vacsora',14,34,30), -- hal
('Zabos energiaszelet','Hozzávalók: zabpehely, mogyoróvaj, méz. Elkészítés: keverd össze és préseld formába.','csemege',10,12,30), -- zab, földimogyoró
('Csirkés tortilla','Hozzávalók: tortilla, csirkemell, saláta. Elkészítés: süsd meg a csirkét és töltsd tortillába.','ebed',7,30,40), -- búza
('Avokádós csirke saláta','Hozzávalók: csirkemell, avokádó, saláta. Elkészítés: grillezd a csirkét és keverd össze az avokádóval.','vacsora',12,34,8), -- avokádó
('Babos csirke chili','Hozzávalók: csirkemell, bab, paradicsomszósz, chili. Elkészítés: főzd össze egy lábasban.','ebed',6,38,40), -- babfélék, chili
('Protein zabkása','Hozzávalók: zabpehely, fehérjepor, tej. Elkészítés: főzd össze krémesre.','reggeli',5,30,45), -- zab, tej
('Csirkés kuszkusz','Hozzávalók: kuszkusz, csirkemell, paprika. Elkészítés: készítsd el a kuszkuszt és keverd csirkével.','ebed',5,34,50), -- búza
('Tojásos rizs','Hozzávalók: rizs, tojás, szójaszósz. Elkészítés: pirítsd össze serpenyőben.','ebed',9,20,45), -- tojás, szójabab
('Pulyka burger','Hozzávalók: pulykahús pogácsa, teljes kiőrlésű zsemle. Elkészítés: süsd meg a pogácsát és tálald zsemlében.','ebed',9,34,35), -- búza
('Sardínia saláta','Hozzávalók: szardínia, saláta, paradicsom. Elkészítés: keverd össze egy tálban.','vacsora',11,28,4), -- szardínia
('Zöld smoothie','Hozzávalók: spenót, banán, víz. Elkészítés: turmixold össze.','csemege',2,4,20), -- spenót
('Csirkés brokkoli rizs','Hozzávalók: csirkemell, rizs, brokkoli. Elkészítés: párold a brokkolit és keverd csirkével és rizzsel.','ebed',5,38,55), -- brokkoli
('Tofu saláta','Hozzávalók: tofu, saláta, uborka. Elkészítés: keverd össze hidegen.','vacsora',8,18,8), -- tofu, szójabab
('Makréla quinoa','Hozzávalók: makréla, quinoa. Elkészítés: főzd meg a quinoát és keverd össze makrélával.','vacsora',13,30,35), -- makréla
('Mandulás joghurt','Hozzávalók: natúr joghurt, mandula, méz. Elkészítés: keverd össze.','csemege',8,15,12), -- tej, mandula
('Zabpalacsinta áfonyával','Hozzávalók: zabpehely, tojás, áfonya. Elkészítés: turmixold össze és süsd ki.','reggeli',6,20,40); -- zab, tojás

-- 8. izomcsoport tábla:
INSERT INTO izomcsoport (izom_id, nev) VALUES 
(1, 'Mell'), 
(2, 'Váll'), 
(3, 'Tricepsz'), 
(4, 'Hát'), 
(5, 'Bicepsz'),             
(6, 'Láb'), 
(7, 'Has');

-- 9. felhasznalo tábla:
INSERT INTO felhasznalo (felhasznalo_id, testsuly, magassag, edzesre_forditott_ido, napi_kaloria_bevitel, cel_alak_id, cel_testsuly, EKM_id) VALUES
(1, 85.0, 180, 60, 2500, 1, 80.0, 2),
(2, 95.0, 185, 45, 3000, 2, 85.0, 1),
(3, 60.0, 165, 90, 1800, 3, 58.0, 2),
(4, 78.0, 175, 120, 2800, 4, 85.0, 3),
(5, 68.0, 170, 30, 2000, 2, 62.0, 2),
(6, 110.0, 190, 60, 3500, 4, 95.0, 4),
(7, 55.0, 160, 45, 1600, 1, 55.0, 2);

-- 10. edzo tábla:
INSERT INTO edzo (edzo_id, edzoterem_cim, kep, idezet, leiras) VALUES 
(8, POINT(-118.49, 34.16), 'togi.jpg', '"Minden nap tökéletes, ha szteroidozól."', 'Extra kalóriabevitel, agresszív fejlődés, Kebab-diéta szakértő.'),
(9, POINT(-118.49, 34.16), 'chris.jpg', '"PR vagy ER."', 'Brutális súlyok, üvöltve edzés, a Tren-ikrek egyik fele.'),
(10, POINT(-118.49, 34.16), 'mike.jpg', '"Ha még tudsz beszélni, nem raktál rá elég súlyt."', 'Káosz-menedzsment a teremben, nehéz vasak.'),
(11, POINT(-118.48, 34.00), 'sara.jpg', '"Várj, ezt le kell videóznom!"', 'Influenszer tréning, tartalomgyártás edzés közben.'),
(12, POINT(-73.52, 40.80), 'rich.jpg', '"Mi lenne, ha több kaját ennél?"', 'Napi 10 étkezés, 8 órás karezés szakértő, 5% legenda.'),
(13, POINT(144.96, -37.82), 'annabel.jpg', '"A forma nem vár, dolgozz meg érte!"', 'Esztétikus testalkat, precíz étrendtervezés, intenzív alsótest edzés.'),
(14, POINT(-95.54, 29.62), 'keiani.jpg', '"Erősebb vagy, mint gondolnád."', 'Súlyemelés és funkcionális fitness Hawaii-ról.'),
(15, POINT(-1.79, 52.37), 'krissy.jpg', '"Ne csak csináld, értsd is meg!"', 'Női közösségépítés, otthoni és edzőtermi komplex programok.'),
(16, POINT(-83.09, 42.41), 'patty.jpg', '"Ez csak egy kis mozgás, nyugi."', 'Zseniális mobilitás, testépítés és egy kis humor.'),
(17, POINT(-95.54, 29.62), 'alex.jpg', '"Görög isten forma."', 'Természetes testépítés és esztétika.'),
(18, POINT(-83.06, 40.30), 'sam.jpg', '"Érezd a bedurranást."', 'Intenzív edzés, klasszikus testépítő stílus.'),
(19, POINT(-74.26, 40.72), 'david.jpg', '"Maradj következetes."', 'Transzformáció és erőnléti edzés.'),
(20, POINT(-111.89, 40.76), 'whitney.jpg', '"Csodás nap élni!"', 'Pozitivitás és funkcionális női tréning.'),
(21, POINT(8.40, 49.00), 'pamela.jpg', '"Érezd az égetést!"', 'Eszköz nélküli otthoni edzések és HIIT.');

-- 11. edzesterv tábla:

-- 12. komment tábla:
INSERT INTO komment (szoveg, ertekeles, statusz, edzo_id, felhasznalo_id) VALUES
-- Togi (8)
('A Kebab-diéta tényleg működik, köszi!', 5, 'aktív', 8, 1),
('', 4, 'aktív', 8, 2),
-- Chris Tren (9)
('Brutális edzések, azóta csak üvöltve nyomok fekve.', 5, 'aktív', 9, 3),
('', 5, 'aktív', 9, 4),
-- Mike Tren (10)
('Szigorú de igazságos, kemények a súlyok.', 4, 'aktív', 10, 5),
('', 5, 'aktív', 10, 6),
-- Sara Saffari (11)
('Nagyon kedves, és segített beállítani a fényeket is a videómhoz!', 5, 'aktív', 11, 7),
('', 3, 'aktív', 11, 1),
-- Rich Piana (12)
('8 órás karezés után nem érzem a kezeim, 5% forever!', 5, 'aktív', 12, 2),
('', 5, 'aktív', 12, 3),
-- Annabel Lucinda (13)
('Precíz étrend, látványos fejlődés pár hét alatt.', 5, 'aktív', 13, 4),
('', 4, 'aktív', 13, 5),
-- Keiani (14)
('Szuper hangulatú funkcionális edzések!', 5, 'aktív', 14, 6),
('', 5, 'aktív', 14, 7),
-- Krissy Cela (15)
('A közösség és a program is zseniális.', 5, 'aktív', 15, 1),
('', 4, 'aktív', 15, 2),
-- LeanBeefPatty (16)
('A mobilitási gyakorlatok megváltoztatták az életem.', 5, 'aktív', 16, 3),
('', 5, 'aktív', 16, 4),
-- Alex Eubank (17)
('Esztétika mindenek felett, remek tanácsok.', 5, 'aktív', 17, 5),
('', 4, 'aktív', 17, 6),
-- Sam Sulek (18)
('Rövid, tömör, intenzív. Pont ahogy szeretem.', 5, 'aktív', 18, 7),
('', 5, 'aktív', 18, 1),
-- David Laid (19)
('Nagyon következetes edzéstervet kaptam.', 5, 'aktív', 19, 2),
('', 4, 'aktív', 19, 3),
-- Whitney Simmons (20)
('Sugárzik belőle a pozitivitás, öröm vele az edzés.', 5, 'aktív', 20, 4),
('', 5, 'aktív', 20, 5),
-- Pamela Reif (21)
('A HIIT edzései kinyírtak, de imádom!', 5, 'aktív', 21, 6),
('', 4, 'aktív', 21, 7);

-- 13. allergiat_okoz tábla:
INSERT INTO allergiat_okoz (recept_id, allergen_id) VALUES
(1,35),
(2,4),(2,8),
(4,6),(4,1),(4,76),
(5,65),
(7,6),(7,4),(7,10),
(8,7),(8,35),
(9,1),(9,10),
(10,6),(10,40),(10,45),
(11,1),
(12,1),
(13,4),(13,10),
(14,36),
(15,68),
(16,57),
(17,76),
(18,1),(18,65),
(19,10),
(20,20),
(21,45),
(22,58),(22,9),(22,35),
(23,4),(23,6),
(25,7),(25,53),
(26,1),
(27,6),(27,9),
(28,4),(28,12),
(29,35),
(30,4),(30,8),
(32,4),(32,10),
(34,4),(34,6),(34,10),
(35,65),(35,1),
(36,32),(36,46),
(37,10),
(39,35),
(40,58),(40,9),(40,35),
(41,10),
(42,1),
(43,6),(43,40),(43,45),
(44,1),
(45,7),(45,76),
(46,57),(46,80),
(47,4),(47,6),
(48,65),
(50,4),(50,12),
(51,36),(51,9),
(52,6),(52,35),
(53,10),
(54,55),
(55,68),
(56,4),(56,10),
(58,54),(58,46),
(59,65),
(60,6),(60,76),
(61,35),
(62,4),
(64,6),(64,76),
(65,65),
(66,4),(66,10),
(67,1),
(68,7),(68,53),
(69,4),(69,6),
(71,36),(71,46),
(72,10),
(73,1),
(74,57),
(75,58),(75,9),(75,35),
(76,4),(76,12),
(77,68),
(79,4),(79,6),
(80,65),
(81,6),(81,40),(81,45),
(82,54),(82,46),
(83,45),
(84,10),
(85,7),
(86,4),(86,8),
(87,1),
(88,76),
(89,57),(89,80),
(90,4),(90,10),
(91,1),
(92,6),(92,9),
(93,1),
(94,66),
(95,40),
(96,35),
(97,58),(97,9),
(98,68),
(99,10),(99,12),
(100,4),(100,6);

-- 14. kellekek_kivalasztasa tábla:
INSERT INTO kellekek_kivalasztasa (gyakorlat_id, kellek_id) VALUES
-- MELL
(1,7),(1,11),
(2,2),(2,11),
(3,7),(3,12),
(4,2),(4,12),
(5,7),(5,12),
(6,2),(6,11),
(7,2),(7,12),
(8,22),
(9,16),
(10,16),
(11,49),
(12,2),(12,11),
(13,43),
(14,43),
(15,5),

-- HÁT
(16,10),
(17,10),
(18,23),(18,89),
(19,23),(19,90),
(20,7),
(21,2),
(22,6),
(23,24),
(24,24),
(25,6),
(26,12),
(27,16),
(28,22),
(29,11),
(30,7),

-- VÁLL
(31,7),
(32,2),
(33,2),
(34,5),
(35,2),
(36,2),
(37,16),
(38,16),
(39,7),
(40,6),
(41,2),
(42,22),

-- BICEPSZ
(43,7),
(44,2),
(45,2),
(46,2),
(47,12),
(48,16),
(49,8),
(50,11),
(51,7),
(52,2),

-- TRICEPSZ
(53,16),(53,88),
(54,16),(54,7),
(55,8),(55,11),
(56,2),
(57,2),
(58,7),(58,11),
(59,11),
(60,16),(60,88),
(61,16),
(62,43),

-- ALKAR
(63,7),
(64,7),
(65,7),
(66,2),
(67,2),
(68,5),
(69,2),
(70,7),

-- QUADRICEPS
(71,7),(71,13),
(72,7),(72,13),
(73,18),
(74,19),
(75,15),
(76,43),
(77,2),
(78,2),
(79,2),
(80,52),

-- HAMSTRING
(81,7),
(82,20),
(83,20),
(84,7),
(85,43),
(86,9),
(87,20),
(88,43),

-- FARIZOM
(89,7),(89,11),
(90,16),
(91,17),
(92,52),
(93,43),
(94,7),

-- VÁDLI
(95,17),
(96,17),
(97,43),
(98,18),
(99,43),
(100,43);

-- 15. gyakorlat_izomcsoport tábla:
-- Előbb ürítsük a táblát, hogy ne legyen duplikáció a teszteléskor
INSERT INTO gyakorlat_izomcsoport (gyakorlat_id, izom_id) VALUES 
-- Mell (1)
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), 
(6, 1), (7, 1), (8, 1), (9, 1), (10, 1), 
(11, 1), (12, 1), (13, 1), (14, 1), (15, 1),

-- Váll (2)
(31, 2), (32, 2), (33, 2), (34, 2), (35, 2), 
(36, 2), (37, 2), (38, 2), (39, 2), (40, 2), (41, 2), (42, 2),

-- Tricepsz (3) -> Átírva 5-ről 3-ra
(53, 3), (54, 3), (55, 3), (56, 3), (57, 3), 
(58, 3), (59, 3), (60, 3), (61, 3), (62, 3),

-- Hát (4)
(16, 4), (17, 4), (18, 4), (19, 4), (20, 4), 
(21, 4), (22, 4), (23, 4), (24, 4), (25, 4), 
(26, 4), (27, 4), (28, 4), (29, 4), (30, 4),

-- Bicepsz (5)
(43, 5), (44, 5), (45, 5), (46, 5), (47, 5), 
(48, 5), (49, 5), (50, 5), (51, 5), (52, 5),

-- Láb (6)
(71, 6), (72, 6), (73, 6), (74, 6), (75, 6), (76, 6), (77, 6), (78, 6), (79, 6), (80, 6),
(81, 6), (82, 6), (83, 6), (84, 6), (85, 6), (86, 6), (87, 6), (88, 6),
(89, 6), (90, 6), (91, 6), (92, 6), (93, 6), (94, 6),
(95, 6), (96, 6), (97, 6), (98, 6), (99, 6), (100, 6);