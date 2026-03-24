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
email VARCHAR(150) UNIQUE,
telszam VARCHAR(30),
nem VARCHAR(20),
role ENUM('felhasznalo','edzo','admin') DEFAULT 'felhasznalo',
szul_datum DATE
);

-- FELHASZNALO
CREATE TABLE IF NOT EXISTS felhasznalo (
felhasznalo_id INT PRIMARY KEY,
testsuly FLOAT,
magassag FLOAT,
edzesre_forditott_ido INT,
napi_kaloria_bevitel INT,
cel_alak VARCHAR(100),
cel_testsuly FLOAT,
uzott_sport VARCHAR(100),
edzesen_kivuli_mozgas VARCHAR(100),
FOREIGN KEY (felhasznalo_id) REFERENCES login(id)
);

-- EDZO
CREATE TABLE IF NOT EXISTS edzo (
edzo_id INT PRIMARY KEY,
edzoterm_cim VARCHAR(255),
kep TEXT,
idezet TEXT,
leiras TEXT,
FOREIGN KEY (edzo_id) REFERENCES login(id)
);

-- EDZESTERV
CREATE TABLE IF NOT EXISTS edzesterv (
edzesterv_id INT AUTO_INCREMENT PRIMARY KEY,
weekday VARCHAR(20),
felhasznalo_id INT,
FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id)
);

-- GYAKORLAT
CREATE TABLE IF NOT EXISTS gyakorlat (
gyakorlat_id INT AUTO_INCREMENT PRIMARY KEY,
nev VARCHAR(150),
leiras TEXT,
kor INT,
ismetles INT
);
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
-- KELLEK
CREATE TABLE IF NOT EXISTS kellek (
kellek_id INT AUTO_INCREMENT PRIMARY KEY,
nev VARCHAR(150)
);
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
-- EDZESTERV - GYAKORLAT
CREATE TABLE IF NOT EXISTS gyakorlatok_kivalasztasa (
edzesterv_id INT,
gyakorlat_id INT,
PRIMARY KEY (edzesterv_id, gyakorlat_id),
FOREIGN KEY (edzesterv_id) REFERENCES edzesterv(edzesterv_id),
FOREIGN KEY (gyakorlat_id) REFERENCES gyakorlat(gyakorlat_id)
);

-- GYAKORLAT - KELLEK
CREATE TABLE IF NOT EXISTS kellekek_kivalasztasa (
gyakorlat_id INT,
kellek_id INT,
PRIMARY KEY (gyakorlat_id, kellek_id),
FOREIGN KEY (gyakorlat_id) REFERENCES gyakorlat(gyakorlat_id),
FOREIGN KEY (kellek_id) REFERENCES kellek(kellek_id)
);
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


-- ALLERGEN
CREATE TABLE IF NOT EXISTS allergen (
allergen_id INT AUTO_INCREMENT PRIMARY KEY,
nev VARCHAR(150)
);
INSERT INTO allergen(nev) VALUES
('búza'),
('rozs'),
('árpa'),
('zab'),
('rákfélék'),
('tojás'),
('hal'),
('földimogyoró'),
('szójabab'),
('tej'),
('laktóz'),
('mandula'),
('mogyoró'),
('dió'),
('kesudió'),
('pekándió'),
('brazil dió'),
('pisztácia'),
('makadámdió'),
('zeller'),
('mustár'),
('szezámmag'),
('kén-dioxid és szulfitok'),
('csillagfürt'),
('puhatestűek'),
('kagyló'),
('osztriga'),
('csiga'),
('tintahal'),
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

-- FELHASZNALO - ALLERGEN
CREATE TABLE IF NOT EXISTS allergias_ra (
felhasznalo_id INT,
allergen_id INT,
PRIMARY KEY (felhasznalo_id, allergen_id),
FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id),
FOREIGN KEY (allergen_id) REFERENCES allergen(allergen_id)
);

-- RECEPT
CREATE TABLE IF NOT EXISTS recept (
recept_id INT AUTO_INCREMENT PRIMARY KEY,
nev VARCHAR(150),
leiras TEXT,
etkezes_tipus VARCHAR(100),
zsir FLOAT,
protein FLOAT,
szenhidrat FLOAT
);
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

-- RECEPT - ALLERGEN
CREATE TABLE IF NOT EXISTS allergiat_okoz (
recept_id INT,
allergen_id INT,
PRIMARY KEY (recept_id, allergen_id),
FOREIGN KEY (recept_id) REFERENCES recept(recept_id),
FOREIGN KEY (allergen_id) REFERENCES allergen(allergen_id)
);
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

-- ETREND
CREATE TABLE IF NOT EXISTS etrend (
etrend_id INT AUTO_INCREMENT PRIMARY KEY,
weekday VARCHAR(20),
etkezes_sorszama INT,
felhasznalo_id INT,
recept_id INT,
FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id),
FOREIGN KEY (recept_id) REFERENCES recept(recept_id)
);

-- KOMPETENCIA
CREATE TABLE IF NOT EXISTS kompetencia (
kompetencia_id INT AUTO_INCREMENT PRIMARY KEY,
nev VARCHAR(150)
);

-- EDZO - KOMPETENCIA
CREATE TABLE IF NOT EXISTS kompetenciak_kivalasztasa (
edzo_id INT,
kompetencia_id INT,
PRIMARY KEY (edzo_id, kompetencia_id),
FOREIGN KEY (edzo_id) REFERENCES edzo(edzo_id),
FOREIGN KEY (kompetencia_id) REFERENCES kompetencia(kompetencia_id)
);

-- KOMMENT
CREATE TABLE IF NOT EXISTS komment (
komment_id INT AUTO_INCREMENT PRIMARY KEY,
szoveg TEXT,
ertekeles INT,
statusz VARCHAR(50),
edzo_id INT,
felhasznalo_id INT,
FOREIGN KEY (edzo_id) REFERENCES edzo(edzo_id),
FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id)
);

-- FOGLALAS
CREATE TABLE IF NOT EXISTS foglalas (
foglalas_id INT AUTO_INCREMENT PRIMARY KEY,
datum DATE,
start TIME,
end TIME,
statusz VARCHAR(50),
edzo_id INT,
felhasznalo_id INT,
FOREIGN KEY (edzo_id) REFERENCES edzo(edzo_id),
FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalo(felhasznalo_id)
);

-- HETI_BEOSZTAS
CREATE TABLE IF NOT EXISTS heti_beosztas (
beo_id INT AUTO_INCREMENT PRIMARY KEY,
weekday VARCHAR(20),
start TIME,
end TIME,
mettol_ervenyes DATE,
edzo_id INT,
FOREIGN KEY (edzo_id) REFERENCES edzo(edzo_id)
);

-- KULONLEGES_ALKALOM
CREATE TABLE IF NOT EXISTS kulonleges_alkalom (
ka_id INT AUTO_INCREMENT PRIMARY KEY,
datum DATE,
weekday VARCHAR(20),
start TIME,
end TIME,
statusz VARCHAR(50),
edzo_id INT,
FOREIGN KEY (edzo_id) REFERENCES edzo(edzo_id)
);
-- IZOMCSOPORT TÖRZZSTÁBLA
CREATE TABLE IF NOT EXISTS izomcsoport (
    izom_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(100) NOT NULL UNIQUE
);
INSERT INTO izomcsoport ( nev) VALUES 
('Mellizom'), 
('Hátizom'),
('Vállizom'), 
('Bicepsz (Felkar)'),
('Tricepsz (Felkar)'),
('Alkar'),
('Quadriceps (Négyfejű combizom)'), 
('Hamstring (Combhajlító)'),
('Farizom (Gluteus)'),
('Vádli');

-- KAPCSOLÓTÁBLA 
CREATE TABLE IF NOT EXISTS gyakorlat_izomcsoport (
    gyakorlat_id INT,
    izom_id INT,
    PRIMARY KEY (gyakorlat_id, izom_id),
    FOREIGN KEY (gyakorlat_id) REFERENCES gyakorlat(gyakorlat_id) ON DELETE CASCADE,
    FOREIGN KEY (izom_id) REFERENCES izomcsoport(izom_id) ON DELETE CASCADE
);
-- KAPCSOLATOK (GYAKORLAT_IZOMCSOPORT)
INSERT INTO gyakorlat_izomcsoport (gyakorlat_id, izom_id) VALUES 
-- Mell gyakorlatok összekötése a Mellizommal (1-es ID)
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), 
(6, 1), (7, 1), (8, 1), (9, 1), (10, 1), 
(11, 1), (12, 1), (13, 1), (14, 1), (15, 1),
-- Hát gyakorlatok összekötése a Hátizommal (2-es ID)
(16, 2), (17, 2), (18, 2), (19, 2), (20, 2), 
(21, 2), (22, 2), (23, 2), (24, 2), (25, 2), 
(26, 2), (27, 2), (28, 2), (29, 2), (30, 2),
-- Váll (3)
(31, 3), (32, 3), (33, 3), (34, 3), (35, 3), 
(36, 3), (37, 3), (38, 3), (39, 3), (40, 3), (41, 3), (42, 3),
-- Bicepsz (4)
(43, 4), (44, 4), (45, 4), (46, 4), (47, 4), 
(48, 4), (49, 4), (50, 4), (51, 4), (52, 4),
-- Tricepsz (5)
(53, 5), (54, 5), (55, 5), (56, 5), (57, 5), 
(58, 5), (59, 5), (60, 5), (61, 5), (62, 5),
-- Alkar (6)
(63, 6), (64, 6), (65, 6), (66, 6), (67, 6), 
(68, 6), (69, 6), (70, 6),
-- Quadriceps (7)
(71, 7), (72, 7), (73, 7), (74, 7), (75, 7), (76, 7), (77, 7), (78, 7), (79, 7), (80, 7),
-- Hamstring (8)
(81, 8), (82, 8), (83, 8), (84, 8), (85, 8), (86, 8), (87, 8), (88, 8),
-- Farizom (9)
(89, 9), (90, 9), (91, 9), (92, 9), (93, 9), (94, 9),
-- Vádli (10)
(95, 10), (96, 10), (97, 10), (98, 10), (99, 10), (100, 10);
