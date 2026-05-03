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
    nem ENUM('férfi','nő') NOT NULL,
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
    statusz ENUM('jelentkezett', 'elfogadva') NOT NULL DEFAULT 'jelentkezett',
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

-- EDZESTERV - GYAKORLAT
CREATE TABLE IF NOT EXISTS gyakorlatok_kivalasztasa (
    edzesterv_id INT NOT NULL,
    gyakorlat_id INT NOT NULL,
    PRIMARY KEY (edzesterv_id, gyakorlat_id),
    FOREIGN KEY (edzesterv_id) REFERENCES edzesterv(edzesterv_id),
    FOREIGN KEY (gyakorlat_id) REFERENCES gyakorlat(gyakorlat_id)
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
    csoport_id INT NOT NULL,
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
datum DATE NOT NULL,
ido TIME NOT NULL,
statusz ENUM('aktiv', 'inaktiv','torolt') NOT NULL DEFAULT 'aktiv', 
edzo_id INT NOT NULL,
felhasznalo_id INT NOT NULL,
aktiv_flag TINYINT GENERATED ALWAYS AS (statusz = 'aktiv') STORED,
UNIQUE KEY unique_foglalas_slot (edzo_id, datum, ido, aktiv_flag),
FOREIGN KEY (edzo_id) REFERENCES edzo(edzo_id),
FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id)
);

-- HETI_BEOSZTAS
CREATE TABLE IF NOT EXISTS heti_beosztas (
beo_id INT AUTO_INCREMENT PRIMARY KEY,
weekday int NOT NULL,
start TIME NOT NULL,
end TIME NOT NULL,
statusz ENUM('aktiv','torolt') NOT NULL DEFAULT 'aktiv', 
mettol_ervenyes DATE NOT NULL,
edzo_id INT NOT NULL,
FOREIGN KEY (edzo_id) REFERENCES edzo(edzo_id)
);

-- KULONLEGES_ALKALOM
CREATE TABLE IF NOT EXISTS kulonleges_alkalom (
ka_id INT AUTO_INCREMENT PRIMARY KEY,
datum DATE NOT NULL,
ido TIME NOT NULL,
statusz ENUM('aktiv', 'inaktiv','torolt') NOT NULL DEFAULT 'aktiv', 
edzo_id INT NOT NULL,
aktiv_flag TINYINT GENERATED ALWAYS AS (statusz = 'aktiv') STORED,
UNIQUE KEY unique_ka_slot (edzo_id, datum, ido, aktiv_flag),
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

-- jelentkezett edzok:
INSERT INTO login (id, felh_nev, jelszo, email, telszam, nem, role, szul_datum) VALUES
(200, 'KovacsT', 'titkosjelszo', 'kovacs.tamas@fitlife.hu', '+36301234567', 'férfi', 'edzo', '1990-05-15'),
(201, 'NagyA', 'titkosjelszo', 'nagy.anna@fitlife.hu', '+36209876543', 'nő', 'edzo', '1993-08-22'),
(202, 'SzaboP', 'titkosjelszo', 'szabo.peter@fitlife.hu', '+36701112233', 'férfi', 'edzo', '1988-11-05');
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
('Csirkés rizstál','Hozzávalók: csirkemell 150 g, rizs (száraz) 70 g, brokkoli 120 g, só 2 g, bors 1 g. Elkészítés: a rizst főzd meg, a csirkemellet kockázva süsd meg serpenyőben, párold a brokkolit majd keverd össze.','ebed',6,36,58),
('Zabkása mogyoróvajjal','Hozzávalók: zabpehely 60 g, tej 200 ml, mogyoróvaj 20 g, banán 100 g. Elkészítés: a zabot főzd krémesre, keverd bele a mogyoróvajat és a felszeletelt banánt.','reggeli',15,20,73),
('Pulykamell saláta','Hozzávalók: pulykamell 150 g, salátakeverék 80 g, paradicsom 120 g, olívaolaj 10 g. Elkészítés: grillezd a pulykát, majd szeleteld és keverd a salátához.','vacsora',12,35,8),
('Tojásos avokádó toast','Hozzávalók: teljes kiőrlésű kenyér 70 g, tojás 2 db (100 g), avokádó 80 g. Elkészítés: pirítsd meg a kenyeret, főzz tojást, az avokádót villával törd össze és kend a kenyérre.','reggeli',21,20,35),
('Tonhalas rizs','Hozzávalók: tonhalkonzerv saját lében (lecsepegtetve) 120 g, főtt rizs 200 g, kukorica 60 g, citromlé 10 ml. Elkészítés: keverd össze az összetevőket egy tálban.','ebed',3,33,64),
('Csirkés quinoa saláta','Hozzávalók: quinoa (száraz) 65 g, csirkemell 140 g, uborka 100 g, paradicsom 100 g. Elkészítés: főzd meg a quinoát, süsd meg a csirkét és keverd össze a zöldségekkel.','ebed',7,38,45),
('Protein palacsinta','Hozzávalók: tojás 2 db (100 g), fehérjepor 30 g, zabpehely 40 g. Elkészítés: turmixold össze, majd süsd ki palacsintaként.','reggeli',10,36,29),
('Lazac brokkolival','Hozzávalók: lazacfilé 150 g, brokkoli 180 g, citrom 20 g. Elkészítés: süsd meg a lazacot sütőben, párold a brokkolit.','vacsora',20,36,13),
('Csirkés wrap','Hozzávalók: tortilla 65 g, csirkemell 130 g, saláta 50 g, joghurtos öntet 50 g. Elkészítés: süsd meg a csirkét, töltsd a tortillába a salátával együtt.','ebed',9,36,43),
('Zöldséges omlett','Hozzávalók: tojás 3 db (150 g), spenót 60 g, hagyma 50 g. Elkészítés: a tojásokat felverve süsd meg a zöldségekkel együtt.','reggeli',15,22,7),
('Csirkés bulgur','Hozzávalók: bulgur (száraz) 70 g, csirkemell 140 g, paprika 100 g. Elkészítés: főzd meg a bulgurt, a csirkét kockázva pirítsd meg és keverd össze.','ebed',5,38,57),
('Pulyka burger','Hozzávalók: darált pulykahús 140 g, teljes kiőrlésű zsemle 75 g, saláta 40 g. Elkészítés: süsd meg a húspogácsát, majd rakd össze a burgert.','ebed',14,35,40),
('Túrós zabkása','Hozzávalók: zabpehely 60 g, sovány túró 150 g, méz 15 g. Elkészítés: főzd meg a zabkását, majd keverd bele a túrót.','reggeli',6,32,58),
('Csirkés karfiolrizs','Hozzávalók: csirkemell 160 g, karfiol 250 g, fűszerek 3 g, olívaolaj 5 g. Elkészítés: reszeld le a karfiolt rizs állagúra, pirítsd csirkével.','vacsora',8,40,14),
('Makréla saláta','Hozzávalók: makréla 120 g, saláta 80 g, paradicsom 120 g. Elkészítés: a makrélát keverd a salátával.','vacsora',17,25,7),
('Babos csirketál','Hozzávalók: csirkemell 140 g, vörösbab (főtt) 130 g, rizs (száraz) 60 g. Elkészítés: főzd meg a rizst, süsd a csirkét és keverd össze a babbal.','ebed',5,45,73),
('Avokádós csirke saláta','Hozzávalók: csirkemell 150 g, avokádó 100 g, saláta 80 g. Elkészítés: grillezd a csirkét és keverd össze az avokádóval.','vacsora',18,37,11),
('Tonhalas tészta','Hozzávalók: teljes kiőrlésű tészta (száraz) 80 g, tonhal saját lében (lecsepegtetve) 120 g, paradicsom 120 g. Elkészítés: főzd meg a tésztát és keverd össze tonhallal.','ebed',5,41,61),
('Protein joghurt gyümölccsel','Hozzávalók: natúr joghurt 200 g, fehérjepor 25 g, bogyós gyümölcs 100 g. Elkészítés: keverd össze egy tálban.','csemege',6,32,24),
('Csirkés zöldségleves','Hozzávalók: csirkemell 120 g, sárgarépa 100 g, zeller 60 g, alaplé 400 ml. Elkészítés: főzd össze alaplében.','vacsora',3,28,14),
('Pulykás rizottó','Hozzávalók: rizs (száraz) 75 g, pulykamell 140 g, hagyma 60 g. Elkészítés: pirítsd meg a húst, add hozzá a rizst és főzd puhára.','ebed',5,37,65),
('Tofu stir fry','Hozzávalók: tofu 180 g, brokkoli 150 g, szójaszósz 15 ml, olívaolaj 5 g. Elkészítés: pirítsd össze wokban.','ebed',18,25,16),
('Zab muffin','Hozzávalók: zabpehely 50 g, tojás 1 db (50 g), banán 100 g. Elkészítés: keverd össze és süsd muffin formában.','csemege',8,13,53),
('Grillezett csirke saláta','Hozzávalók: csirkemell 160 g, uborka 120 g, paradicsom 120 g, olívaolaj 5 g. Elkészítés: grillezd a csirkét és keverd a zöldségekkel.','vacsora',8,39,8),
('Lazac quinoa bowl','Hozzávalók: lazac 140 g, quinoa (száraz) 55 g, spárga 120 g. Elkészítés: süsd meg a lazacot és tálald quinoával.','vacsora',21,39,38),
('Csirkés kuszkusz','Hozzávalók: kuszkusz (száraz) 75 g, csirkemell 130 g, paprika 100 g. Elkészítés: főzd meg a kuszkuszt és keverd a csirkével.','ebed',4,36,63),
('Tojásos rizs','Hozzávalók: rizs (száraz) 65 g, tojás 2 db (100 g), szójaszósz 15 ml. Elkészítés: pirítsd össze serpenyőben.','ebed',12,19,53),
('Mandulás zabkása','Hozzávalók: zabpehely 60 g, mandula 20 g, méz 15 g, víz 200 ml. Elkészítés: főzd meg a zabot és szórd meg mandulával.','reggeli',15,15,56),
('Csirkés brokkoli rizs','Hozzávalók: csirkemell 150 g, rizs (száraz) 70 g, brokkoli 150 g. Elkészítés: párold a brokkolit és keverd a csirkével.','ebed',6,38,60),
('Protein zabgolyó','Hozzávalók: zabpehely 45 g, fehérjepor 25 g, mogyoróvaj 15 g. Elkészítés: keverd össze és formázz golyókat.','csemege',12,30,34),
('Csirkés édesburgonya tál','Hozzávalók: csirkemell 150 g, édesburgonya 250 g, olívaolaj 8 g, só 2 g, bors 1 g. Elkészítés: az édesburgonyát kockázd fel és süsd meg sütőben, a csirkemellet serpenyőben süsd aranybarnára, majd tálald együtt.','ebed',11,38,52),
('Protein zabturmix','Hozzávalók: zabpehely 50 g, fehérjepor 30 g, tej 250 ml, banán 100 g. Elkészítés: turmixold össze az összes hozzávalót krémes állagúra.','reggeli',8,39,69),
('Pulykás saláta','Hozzávalók: pulykamell 160 g, saláta 80 g, paradicsom 100 g, uborka 100 g. Elkészítés: grillezd a pulykamellet, majd szeleteld fel és keverd a salátával.','vacsora',3,37,8),
('Tojásos zabpalacsinta','Hozzávalók: zabpehely 55 g, tojás 2 db (100 g), tej 150 ml. Elkészítés: turmixold össze, majd serpenyőben süsd ki palacsinta formában.','reggeli',16,23,45),
('Tonhalas kuszkusz','Hozzávalók: tonhal saját lében (lecsepegtetve) 120 g, kuszkusz (száraz) 70 g, citromlé 10 ml, paradicsom 100 g. Elkészítés: készítsd el a kuszkuszt, majd keverd össze tonhallal.','ebed',3,37,57),
('Grillezett csirke cukkínivel','Hozzávalók: csirkemell 160 g, cukkini 200 g, fokhagyma 5 g, olívaolaj 5 g. Elkészítés: süsd meg a csirkét grillen, a cukkinit serpenyőben pirítsd.','vacsora',8,40,10),
('Protein túrókrém','Hozzávalók: sovány túró 200 g, fehérjepor 20 g, méz 15 g. Elkészítés: keverd össze egy tálban krémesre.','csemege',3,42,21),
('Marhahúsos rizstál','Hozzávalók: sovány darált marhahús 150 g, rizs (száraz) 70 g, paprika 100 g. Elkészítés: pirítsd meg a húst, főzd meg a rizst és keverd össze.','ebed',16,38,61),
('Csirkés brokkoli quinoa','Hozzávalók: csirkemell 145 g, quinoa (száraz) 60 g, brokkoli 150 g. Elkészítés: főzd meg a quinoát, párold a brokkolit, majd keverd össze a csirkével.','ebed',7,40,45),
('Zöldséges tofu tál','Hozzávalók: tofu 200 g, paprika 100 g, brokkoli 120 g, szójaszósz 15 ml. Elkészítés: pirítsd össze wokban.','ebed',17,28,18),
('Protein chia puding','Hozzávalók: chia mag 25 g, tej 200 ml, fehérjepor 25 g. Elkészítés: keverd össze és hagyd állni hűtőben.','reggeli',14,33,20),
('Pulykás wrap','Hozzávalók: tortilla 65 g, pulykamell 130 g, saláta 50 g. Elkészítés: grillezd a húst, majd töltsd tortillába.','ebed',7,34,41),
('Tojásos spenótos omlett','Hozzávalók: tojás 3 db (150 g), spenót 80 g, hagyma 40 g. Elkészítés: a tojásokat felverve süsd meg a zöldségekkel.','reggeli',15,23,7),
('Csirkés bulgur saláta','Hozzávalók: bulgur (száraz) 65 g, csirkemell 140 g, paradicsom 120 g. Elkészítés: főzd meg a bulgurt, keverd össze csirkével és zöldségekkel.','ebed',5,38,54),
('Lazacos avokádó saláta','Hozzávalók: lazac 130 g, avokádó 90 g, saláta 80 g. Elkészítés: süsd meg a lazacot és keverd össze az avokádóval.','vacsora',29,31,9),
('Babos csirke chili','Hozzávalók: csirkemell 140 g, bab (főtt) 150 g, paradicsomszósz 120 g, chili 3 g. Elkészítés: főzd össze az összetevőket egy lábasban.','ebed',5,43,41),
('Zabos protein muffin','Hozzávalók: zabpehely 45 g, tojás 1 db (50 g), fehérjepor 25 g. Elkészítés: keverd össze és süsd muffin formában.','csemege',8,31,33),
('Grillezett tonhal steak','Hozzávalók: tonhal steak 160 g, citrom 20 g, olívaolaj 8 g. Elkészítés: süsd meg grillen oldalanként pár percig.','vacsora',10,38,2),
('Pulykás rizs tál','Hozzávalók: pulykamell 150 g, rizs (száraz) 70 g, paprika 100 g. Elkészítés: süsd meg a húst, majd keverd össze a főtt rizzsel.','ebed',5,39,61),
('Mandulás zabkása','Hozzávalók: zabpehely 55 g, mandula 25 g, méz 10 g, tej 150 ml. Elkészítés: főzd meg a zabot és szórd meg mandulával.','reggeli',20,20,53),
('Csirkés karfiol stir fry','Hozzávalók: csirkemell 155 g, karfiol 250 g, szójaszósz 15 ml, olívaolaj 5 g. Elkészítés: pirítsd össze wokban.','vacsora',8,39,14),
('Tojásos rizs zöldségekkel','Hozzávalók: rizs (száraz) 60 g, tojás 2 db (100 g), brokkoli 100 g, répa 70 g. Elkészítés: pirítsd össze serpenyőben.','ebed',12,22,57),
('Protein smoothie bogyós gyümölccsel','Hozzávalók: fehérjepor 30 g, tej 250 ml, bogyós gyümölcs 120 g. Elkészítés: turmixold össze.','csemege',6,36,28),
('Csirkés lencsesaláta','Hozzávalók: csirkemell 140 g, főtt lencse 150 g, paradicsom 120 g. Elkészítés: keverd össze egy tálban.','ebed',5,44,35),
('Makréla quinoa tál','Hozzávalók: makréla 120 g, quinoa (száraz) 60 g, uborka 100 g. Elkészítés: főzd meg a quinoát, majd keverd a makrélával.','vacsora',19,32,41),
('Protein zabkása','Hozzávalók: zabpehely 60 g, fehérjepor 30 g, tej 200 ml. Elkészítés: főzd össze krémes állagúra.','reggeli',9,39,49),
('Pulyka burger salátával','Hozzávalók: pulykahús pogácsa 160 g, saláta 80 g, paradicsom 120 g. Elkészítés: süsd meg a pogácsát és tálald salátával.','ebed',14,35,8),
('Csirkés zöldbab','Hozzávalók: csirkemell 160 g, zöldbab 200 g, fokhagyma 5 g, olívaolaj 5 g. Elkészítés: pirítsd össze serpenyőben.','vacsora',8,41,15),
('Tonhalas rizssaláta','Hozzávalók: tonhal saját lében (lecsepegtetve) 120 g, rizs (száraz) 65 g, kukorica 60 g. Elkészítés: keverd össze hidegen.','ebed',3,36,64),
('Avokádós tojás saláta','Hozzávalók: tojás 2 db (100 g), avokádó 100 g, saláta 80 g. Elkészítés: főzd meg a tojást, majd keverd az avokádóval.','reggeli',25,15,12),
('Csirkés rizs brokkolival','Hozzávalók: csirkemell 155 g, rizs (száraz) 75 g, brokkoli 130 g, só 2 g, bors 1 g. Elkészítés: a rizst főzd meg, a csirkét serpenyőben süsd meg, a brokkolit párold, majd keverd össze.','ebed',6,39,64),
('Zabkása almával','Hozzávalók: zabpehely 60 g, tej 200 ml, alma 150 g, fahéj 2 g. Elkészítés: a zabot főzd krémesre, add hozzá a reszelt almát és a fahéjat.','reggeli',8,17,72),
('Pulykás quinoa tál','Hozzávalók: pulykamell 145 g, quinoa (száraz) 65 g, paprika 100 g. Elkészítés: főzd meg a quinoát, a pulykát pirítsd meg, majd tálald együtt.','ebed',6,40,47),
('Tojásos avokádó saláta','Hozzávalók: tojás 2 db (100 g), avokádó 90 g, saláta 100 g. Elkészítés: főzd meg a tojást, szeleteld fel, majd keverd össze az avokádóval és salátával.','reggeli',24,15,11),
('Tonhalas salátatál','Hozzávalók: tonhal saját lében (lecsepegtetve) 140 g, salátakeverék 100 g, paradicsom 120 g, citromlé 10 ml. Elkészítés: keverd össze egy tálban és locsold meg citromlével.','vacsora',3,35,8),
('Protein zabturmix','Hozzávalók: zabpehely 45 g, fehérjepor 30 g, tej 200 ml, banán 120 g. Elkészítés: turmixold össze krémes állagúra.','reggeli',7,37,65),
('Csirkés bulgur','Hozzávalók: bulgur (száraz) 75 g, csirkemell 150 g, paprika 80 g. Elkészítés: főzd meg a bulgurt, süsd meg a csirkét és keverd össze.','ebed',5,41,61),
('Lazac spárgával','Hozzávalók: lazacfilé 150 g, spárga 180 g, citrom 20 g. Elkészítés: a lazacot süsd meg sütőben, a spárgát párold.','vacsora',20,35,8),
('Zabpalacsinta banánnal','Hozzávalók: zabpehely 50 g, tojás 2 db (100 g), banán 100 g. Elkészítés: turmixold össze és süsd palacsintának.','reggeli',13,20,55),
('Pulykás saláta','Hozzávalók: pulykamell 150 g, saláta 90 g, uborka 120 g, paradicsom 120 g. Elkészítés: grillezd a pulykát és keverd a zöldségekhez.','vacsora',3,35,9),
('Csirkés karfiolrizs','Hozzávalók: csirkemell 150 g, karfiol 260 g, fokhagyma 5 g, olívaolaj 5 g. Elkészítés: reszeld a karfiolt rizs állagúra, majd pirítsd össze csirkével.','vacsora',8,39,15),
('Protein joghurt','Hozzávalók: natúr joghurt 200 g, fehérjepor 25 g, méz 15 g. Elkészítés: keverd össze egy tálban.','csemege',6,31,25),
('Csirkés tészta','Hozzávalók: teljes kiőrlésű tészta (száraz) 80 g, csirkemell 130 g, paradicsomszósz 120 g. Elkészítés: főzd meg a tésztát, majd keverd össze csirkével és szósszal.','ebed',6,41,68),
('Babos pulykatál','Hozzávalók: pulykamell 140 g, vörösbab (főtt) 130 g, rizs (száraz) 55 g. Elkészítés: főzd meg a rizst, a pulykát süsd meg és keverd a babbal.','ebed',5,43,68),
('Zöldséges tofu wok','Hozzávalók: tofu 180 g, brokkoli 150 g, paprika 100 g, szójaszósz 15 ml. Elkészítés: pirítsd össze wokban.','ebed',15,26,19),
('Mandulás zabkása','Hozzávalók: zabpehely 65 g, mandula 18 g, méz 12 g, víz 200 ml. Elkészítés: főzd meg a zabot és szórd meg mandulával.','reggeli',14,16,60),
('Makréla saláta','Hozzávalók: makréla 110 g, saláta 90 g, paradicsom 120 g. Elkészítés: keverd össze hidegen.','vacsora',16,24,7),
('Csirkés quinoa','Hozzávalók: quinoa (száraz) 70 g, csirkemell 140 g, uborka 120 g. Elkészítés: főzd meg a quinoát, majd keverd össze a csirkével.','ebed',7,38,48),
('Protein muffin','Hozzávalók: zabpehely 40 g, tojás 1 db (50 g), fehérjepor 30 g. Elkészítés: keverd össze és süsd muffin formában.','csemege',8,34,30),
('Tonhalas rizs','Hozzávalók: tonhal saját lében (lecsepegtetve) 130 g, rizs (száraz) 70 g, citromlé 10 ml. Elkészítés: keverd össze egy tálban.','ebed',3,37,56),
('Tojásos omlett spenóttal','Hozzávalók: tojás 3 db (150 g), spenót 70 g, hagyma 50 g. Elkészítés: a tojást felverve süsd meg a zöldségekkel.','reggeli',15,23,7),
('Csirkés zöldbab','Hozzávalók: csirkemell 150 g, zöldbab 220 g, fokhagyma 5 g, olívaolaj 6 g. Elkészítés: pirítsd össze serpenyőben.','vacsora',9,39,16),
('Pulykás rizottó','Hozzávalók: rizs (száraz) 70 g, pulykamell 150 g, hagyma 70 g. Elkészítés: pirítsd meg a húst, add hozzá a rizst és főzd puhára.','ebed',5,40,62),
('Protein turmix','Hozzávalók: fehérjepor 30 g, tej 250 ml, banán 120 g. Elkészítés: turmixold össze.','csemege',6,36,43),
('Lazacos quinoa bowl','Hozzávalók: lazac 130 g, quinoa (száraz) 60 g, uborka 100 g. Elkészítés: süsd meg a lazacot és tálald quinoával.','vacsora',20,37,41),
('Zabos energiaszelet','Hozzávalók: zabpehely 45 g, mogyoróvaj 20 g, méz 15 g. Elkészítés: keverd össze és préseld formába.','csemege',14,12,44),
('Csirkés tortilla','Hozzávalók: tortilla 60 g, csirkemell 130 g, saláta 60 g. Elkészítés: süsd meg a csirkét és töltsd tortillába.','ebed',7,35,38),
('Avokádós csirke saláta','Hozzávalók: csirkemell 140 g, avokádó 120 g, saláta 80 g. Elkészítés: grillezd a csirkét és keverd össze az avokádóval.','vacsora',21,35,12),
('Babos csirke chili','Hozzávalók: csirkemell 150 g, bab (főtt) 130 g, paradicsomszósz 150 g, chili 3 g. Elkészítés: főzd össze egy lábasban.','ebed',5,45,40),
('Protein zabkása','Hozzávalók: zabpehely 55 g, fehérjepor 30 g, tej 250 ml. Elkészítés: főzd össze krémesre.','reggeli',10,41,48),
('Csirkés kuszkusz','Hozzávalók: kuszkusz (száraz) 70 g, csirkemell 150 g, paprika 100 g. Elkészítés: készítsd el a kuszkuszt és keverd csirkével.','ebed',5,41,60),
('Tojásos rizs','Hozzávalók: rizs (száraz) 70 g, tojás 2 db (100 g), szójaszósz 15 ml. Elkészítés: pirítsd össze serpenyőben.','ebed',12,20,57),
('Pulyka burger','Hozzávalók: pulykahús pogácsa 150 g, teljes kiőrlésű zsemle 65 g. Elkészítés: süsd meg a pogácsát és tálald zsemlében.','ebed',13,35,34),
('Sardínia saláta','Hozzávalók: szardínia 120 g, saláta 90 g, paradicsom 120 g. Elkészítés: keverd össze egy tálban.','vacsora',14,30,7),
('Zöld smoothie','Hozzávalók: spenót 60 g, banán 120 g, víz 250 ml. Elkészítés: turmixold össze.','csemege',1,4,31),
('Csirkés brokkoli rizs','Hozzávalók: csirkemell 145 g, rizs (száraz) 75 g, brokkoli 160 g. Elkészítés: párold a brokkolit és keverd csirkével és rizzsel.','ebed',6,38,65),
('Tofu saláta','Hozzávalók: tofu 180 g, saláta 90 g, uborka 120 g. Elkészítés: keverd össze hidegen.','vacsora',14,25,9),
('Makréla quinoa','Hozzávalók: makréla 120 g, quinoa (száraz) 60 g. Elkészítés: főzd meg a quinoát és keverd össze makrélával.','vacsora',19,32,40),
('Mandulás joghurt','Hozzávalók: natúr joghurt 200 g, mandula 20 g, méz 10 g. Elkészítés: keverd össze.','csemege',16,16,23),
('Zabpalacsinta áfonyával','Hozzávalók: zabpehely 55 g, tojás 2 db (100 g), áfonya 100 g. Elkészítés: turmixold össze és süsd ki.','reggeli',13,20,51);

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

--  allergias_ra
INSERT INTO allergias_ra (felhasznalo_id, allergen_id) VALUES
(1, 5), (1, 12), (1, 28), (1, 45), (1, 62),
(3, 2), (3, 19), (3, 33), (3, 50), (3, 68),
(4, 7), (4, 15), (4, 22), (4, 39), (4, 55);


-- 10. edzo tábla:
INSERT INTO edzo (edzo_id, edzoterem_cim, kep, idezet, leiras, kompetenciak, statusz) VALUES 
(8, POINT(19.142456199999998, 47.459248699999996), 'togi.jpg', '"Minden nap tökéletes, ha szteroidozól."', 'Extra kalóriabevitel, agresszív fejlődés, Kebab-diéta szakértő.', 'Tömegnövelés, extrém kalóriabevitel, motiváció', 'elfogadva'),
(9, POINT(19.142456199999998, 47.459248699999996), 'chris.jpg', '"PR vagy ER."', 'Brutális súlyok, üvöltve edzés, a Tren-ikrek egyik fele.', 'Erőemelés, nehézatlétika, mentális állóképesség', 'elfogadva'),
(10, POINT(19.142456199999998, 47.459248699999996), 'mike.jpg', '"Ha még tudsz beszélni, nem raktál rá elég súlyt."', 'Káosz-menedzsment a teremben, nehéz vasak.', 'Erőemelés, intenzív súlyzós edzés, formajavítás', 'elfogadva'),
(11, POINT(19.142456199999998, 47.459248699999996), 'sara.jpg', '"Várj, ezt le kell videóznom!"', 'Influenszer tréning, tartalomgyártás edzés közben.', 'Esztétikus testalkat, social media fitnesz, könnyed erősítés', 'elfogadva'),
(12, POINT(19.0935352, 47.4433534), 'rich.jpg', '"Mi lenne, ha több kaját ennél?"', 'Napi 10 étkezés, 8 órás karezés szakértő, 5% legenda.', 'Extrém testépítés, pózolás, szigorú étrend tervezés', 'elfogadva'),
(13, POINT(19.0935352, 47.4433534), 'annabel.jpg', '"A forma nem vár, dolgozz meg érte!"', 'Esztétikus testalkat, precíz étrendtervezés, intenzív alsótest edzés.', 'Alsótest fókuszú edzés, precíz étrend, szálkásítás', 'elfogadva'),
(14, POINT(19.0244654, 47.4957047), 'keiani.jpg', '"Erősebb vagy, mint gondolnád."', 'Súlyemelés és funkcionális fitness Hawaii-ról.', 'Olimpiai súlyemelés, CrossFit alapok, funkcionális erőfejlesztés', 'elfogadva'),
(15, POINT(19.142456199999998, 47.459248699999996), 'krissy.jpg', '"Ne csak csináld, értsd is meg!"', 'Női közösségépítés, otthoni és edzőtermi komplex programok.', 'Otthoni edzés, női fitnesz, komplex programtervezés', 'elfogadva'),
(16, POINT(19.072618, 47.49761360000001), 'patty.jpg', '"Ez csak egy kis mozgás, nyugi."', 'Zseniális mobilitás, testépítés és egy kis humor.', 'Mobilitás, calisthenics, prevenció és rehabilitáció', 'elfogadva'),
(17, POINT(19.057223999999998, 47.527933999999995), 'alex.jpg', '"Görög isten forma."', 'Természetes testépítés és esztétika.', 'Természetes testépítés, szálkásítás, pózolás és esztétika', 'elfogadva'),
(18, POINT(19.057223999999998, 47.527933999999995), 'sam.jpg', '"Érezd a bedurranást."', 'Intenzív edzés, klasszikus testépítő stílus.', 'Klasszikus testépítés, magas intenzitású tréning (HIT), tömegnövelés', 'elfogadva'),
(19, POINT(19.0518093, 47.4938735), 'david.jpg', '"Maradj következetes."', 'Transzformáció és erőnléti edzés.', 'Testkompozíció megváltoztatása, erőnlét, fotózásra felkészítés', 'elfogadva'),
(20, POINT(19.0518093, 47.4938735), 'whitney.jpg', '"Csodás nap élni!"', 'Pozitivitás és funkcionális női tréning.', 'Funkcionális női edzés, mentális jóllét, kezdők mentorálása', 'elfogadva'),
(21, POINT(19.0518093, 47.4938735), 'pamela.jpg', '"Érezd az égetést!"', 'Eszköz nélküli otthoni edzések és HIIT.', 'HIIT, eszköz nélküli otthoni edzés, állóképesség fejlesztés', 'elfogadva');
-- 3 jelentkezett edzo
INSERT INTO edzo (edzo_id, statusz) VALUES
(200, 'jelentkezett'),
(201, 'jelentkezett'),
(202, 'jelentkezett');

-- 11. edzesterv tábla:

-- 12. komment tábla:
INSERT INTO komment (szoveg, ertekeles, statusz, edzo_id, felhasznalo_id) VALUES
-- Togi (8)
('A Kebab-diéta tényleg működik, köszi!', 5, 'aktív', 8, 1),
('A görögdinnye mellé most már a csirke-rizs is alap, köszi a motivációt!', 5, 'aktív', 8, 3),
('Nagyon jó a hangulat az edzéseken, csak ajánlani tudom!', 4, 'aktív', 8, 5),
('', 4, 'aktív', 8, 2),

-- Chris Tren (9)
('Brutális edzések, azóta csak üvöltve nyomok fekve.', 5, 'aktív', 9, 3),
('A pulzusom az egekben, de a fejlődés megkérdőjelezhetetlen.', 5, 'aktív', 9, 5),
('Soha nem gondoltam volna, hogy ennyit bírok.', 5, 'aktív', 9, 7),
('', 5, 'aktív', 9, 4),

-- Mike Tren (10)
('Szigorú de igazságos, kemények a súlyok.', 4, 'aktív', 10, 5),
('Végre valaki, aki nem csak a gépeket mutogatja, hanem tényleg edzünk.', 5, 'aktív', 10, 7),
('Minden edzés egy kihívás, de megéri a szenvedést.', 5, 'aktív', 10, 2),
('', 5, 'aktív', 10, 6),

-- Sara Saffari (11)
('Nagyon kedves, és segített beállítani a fényeket is a videómhoz!', 5, 'aktív', 11, 7),
('Nagyon jó fejek az edzések, és a tippek is hasznosak a mindennapokra.', 4, 'aktív', 11, 2),
('Szuper energiákat hoz a terembe!', 5, 'aktív', 11, 4),
('', 3, 'aktív', 11, 1),

-- Rich Piana (12)
('8 órás karezés után nem érzem a kezeim, 5% forever!', 5, 'aktív', 12, 2),
('Whatever it takes! Brutális volumen, pontosan ezt kerestem.', 5, 'aktív', 12, 4),
('Többet eszem, mint valaha, és jönnek az eredmények.', 5, 'aktív', 12, 6),
('', 5, 'aktív', 12, 3),

-- Annabel Lucinda (13)
('Precíz étrend, látványos fejlődés pár hét alatt.', 5, 'aktív', 13, 4),
('Szuperül felépített program, minden kérdésemre azonnal válaszol.', 5, 'aktív', 13, 6),
('Nagyon odafigyel a gyakorlatok helyes kivitelezésére.', 5, 'aktív', 13, 1),
('', 4, 'aktív', 13, 5),

-- Keiani (14)
('Szuper hangulatú funkcionális edzések!', 5, 'aktív', 14, 6),
('Soha nem gondoltam volna, hogy ennyit számít a törzsizom erősítése.', 5, 'aktív', 14, 1),
('Kiváló mobilitási tippeket kaptam.', 4, 'aktív', 14, 3),
('', 5, 'aktív', 14, 7),

-- Krissy Cela (15)
('A közösség és a program is zseniális.', 5, 'aktív', 15, 1),
('Imádom az appot és az edzéseket is, nagyon inspiráló személyiség.', 5, 'aktív', 15, 3),
('Az otthoni edzéstervei mentették meg a formámat.', 5, 'aktív', 15, 5),
('', 4, 'aktív', 15, 2),

-- LeanBeefPatty (16)
('A mobilitási gyakorlatok megváltoztatták az életem.', 5, 'aktív', 16, 3),
('Végre megtanultam rendesen hidazni és guggolni fájdalom nélkül.', 5, 'aktív', 16, 5),
('Iszonyat jó a vibe, a zene és az egész edzés!', 5, 'aktív', 16, 7),
('', 5, 'aktív', 16, 4),

-- Alex Eubank (17)
('Esztétika mindenek felett, remek tanácsok.', 5, 'aktív', 17, 5),
('A pózolási tanácsok sokat segítettek az önbizalmamon.', 4, 'aktív', 17, 7),
('A vágásmentes edzésvideói nagyon motiválóak.', 5, 'aktív', 17, 2),
('', 4, 'aktív', 17, 6),

-- Sam Sulek (18)
('Rövid, tömör, intenzív. Pont ahogy szeretem.', 5, 'aktív', 18, 7),
('Nincs duma, csak munka. A pumpa valami eszeveszett a végére.', 5, 'aktív', 18, 2),
('A csokis tej csodákra képes edzés után!', 5, 'aktív', 18, 4),
('', 5, 'aktív', 18, 1),

-- David Laid (19)
('Nagyon következetes edzéstervet kaptam.', 5, 'aktív', 19, 2),
('A világítási tippek és az erőemelő alapok is top kategóriásak.', 5, 'aktív', 19, 4),
('A PR-jaim heteken belül javultak a tanácsaival.', 5, 'aktív', 19, 6),
('', 4, 'aktív', 19, 3),

-- Whitney Simmons (20)
('Sugárzik belőle a pozitivitás, öröm vele az edzés.', 5, 'aktív', 20, 4),
('Mindig jobb kedvvel jövök ki a teremből, mint ahogy bementem.', 5, 'aktív', 20, 6),
('A legjobb edzőtárs, hihetetlenül aranyos!', 5, 'aktív', 20, 1),
('', 5, 'aktív', 20, 5),

-- Pamela Reif (21)
('A HIIT edzései kinyírtak, de imádom!', 5, 'aktív', 21, 6),
('A 10 perces videói után is napokig izomlázam van, hihetetlen hatékony.', 5, 'aktív', 21, 1),
('Nincs pihenő, csak folyamatos pörgés. Pont ez kellett.', 5, 'aktív', 21, 3),
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

-- 15. gyakorlat_izomcsoport tábla:
INSERT INTO gyakorlat_izomcsoport (gyakorlat_id, izom_id) VALUES 
-- Mell (1)
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), 
(6, 1), (7, 1), (8, 1), (9, 1), (10, 1), 
(11, 1), (12, 1), (13, 1), (14, 1), (15, 1),

-- Váll (2)
(31, 2), (32, 2), (33, 2), (34, 2), (35, 2), 
(36, 2), (37, 2), (38, 2), (39, 2), (40, 2), (41, 2), (42, 2),

-- Tricepsz (3)
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
-- 16 felhasznalo_edzesi_napok
INSERT INTO felhasznalo_edzesi_napok(felhasznalo_id, nap_sorszam) VALUES
(1,1),(1,3),(1,5),
(2,2),(2,4),(2,6),
(3,1),(3,4),
(4,2),
(5,2),(5,4),(5,6),
(6,2),(6,4),(6,6),
(7,2),(7,4),(7,6);
