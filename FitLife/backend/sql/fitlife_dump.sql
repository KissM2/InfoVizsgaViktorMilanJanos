-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Máj 04. 23:11
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `fitlife`
--
CREATE DATABASE IF NOT EXISTS `fitlife` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `fitlife`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `allergen`
--

CREATE TABLE `allergen` (
  `allergen_id` int(11) NOT NULL,
  `nev` varchar(150) NOT NULL,
  `tipus` enum('a','p') NOT NULL DEFAULT 'p'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `allergen`
--

INSERT INTO `allergen` (`allergen_id`, `nev`, `tipus`) VALUES
(1, 'búza', 'a'),
(2, 'rozs', 'a'),
(3, 'árpa', 'a'),
(4, 'zab', 'a'),
(5, 'rákfélék', 'a'),
(6, 'tojás', 'a'),
(7, 'hal', 'a'),
(8, 'földimogyoró', 'a'),
(9, 'szójabab', 'a'),
(10, 'tej', 'a'),
(11, 'laktóz', 'a'),
(12, 'mandula', 'a'),
(13, 'mogyoró', 'a'),
(14, 'dió', 'a'),
(15, 'kesudió', 'a'),
(16, 'pekándió', 'a'),
(17, 'brazil dió', 'a'),
(18, 'pisztácia', 'a'),
(19, 'makadámdió', 'a'),
(20, 'zeller', 'a'),
(21, 'mustár', 'a'),
(22, 'szezámmag', 'a'),
(23, 'kén-dioxid és szulfitok', 'a'),
(24, 'csillagfürt', 'a'),
(25, 'puhatestűek', 'a'),
(26, 'kagyló', 'a'),
(27, 'osztriga', 'a'),
(28, 'csiga', 'a'),
(29, 'tintahal', 'a'),
(30, 'gomba', 'p'),
(31, 'tök', 'p'),
(32, 'cukkini', 'p'),
(33, 'padlizsán', 'p'),
(34, 'kelbimbó', 'p'),
(35, 'brokkoli', 'p'),
(36, 'karfiol', 'p'),
(37, 'káposzta', 'p'),
(38, 'vöröskáposzta', 'p'),
(39, 'savanyú káposzta', 'p'),
(40, 'spenót', 'p'),
(41, 'sóska', 'p'),
(42, 'cékla', 'p'),
(43, 'retek', 'p'),
(44, 'torma', 'p'),
(45, 'hagyma', 'p'),
(46, 'fokhagyma', 'p'),
(47, 'póréhagyma', 'p'),
(48, 'petrezselyemgyökér', 'p'),
(49, 'kapor', 'p'),
(50, 'koriander', 'p'),
(51, 'olívabogyó', 'p'),
(52, 'articsóka', 'p'),
(53, 'spárga', 'p'),
(54, 'zöldbab', 'p'),
(55, 'lencse', 'p'),
(56, 'csicseriborsó', 'p'),
(57, 'babfélék', 'p'),
(58, 'tofu', 'p'),
(59, 'máj', 'p'),
(60, 'véres hurka', 'p'),
(61, 'disznósajt', 'p'),
(62, 'pacal', 'p'),
(63, 'velő', 'p'),
(64, 'kocsonya', 'p'),
(65, 'szalonna (zsíros része)', 'p'),
(66, 'tonhal', 'p'),
(67, 'szardínia', 'p'),
(68, 'hering', 'p'),
(69, 'makréla', 'p'),
(70, 'polip', 'p'),
(71, 'tojás (főtt)', 'p'),
(72, 'tojás (lágytojás)', 'p'),
(73, 'ananasz', 'p'),
(74, 'mazsola', 'p'),
(75, 'aszalt gyümölcsök', 'p'),
(76, 'grépfrút', 'p'),
(77, 'avokádó', 'p'),
(78, 'csípős paprika', 'p'),
(79, 'chili', 'p'),
(80, 'ecetes ételek', 'p'),
(81, 'zselatinos édességek', 'p'),
(82, 'marcipán', 'p'),
(83, 'édesgyökér', 'p'),
(84, 'lakritz', 'p');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `allergias_ra`
--

CREATE TABLE `allergias_ra` (
  `felhasznalo_id` int(11) NOT NULL,
  `allergen_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `allergias_ra`
--

INSERT INTO `allergias_ra` (`felhasznalo_id`, `allergen_id`) VALUES
(1, 5),
(1, 12),
(1, 28),
(1, 45),
(1, 62),
(3, 2),
(3, 19),
(3, 33),
(3, 50),
(3, 68),
(4, 7),
(4, 15),
(4, 22),
(4, 39),
(4, 55);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `allergiat_okoz`
--

CREATE TABLE `allergiat_okoz` (
  `recept_id` int(11) NOT NULL,
  `allergen_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `allergiat_okoz`
--

INSERT INTO `allergiat_okoz` (`recept_id`, `allergen_id`) VALUES
(1, 35),
(2, 4),
(2, 8),
(4, 1),
(4, 6),
(4, 76),
(5, 65),
(7, 4),
(7, 6),
(7, 10),
(8, 7),
(8, 35),
(9, 1),
(9, 10),
(10, 6),
(10, 40),
(10, 45),
(11, 1),
(12, 1),
(13, 4),
(13, 10),
(14, 36),
(15, 68),
(16, 57),
(17, 76),
(18, 1),
(18, 65),
(19, 10),
(20, 20),
(21, 45),
(22, 9),
(22, 35),
(22, 58),
(23, 4),
(23, 6),
(25, 7),
(25, 53),
(26, 1),
(27, 6),
(27, 9),
(28, 4),
(28, 12),
(29, 35),
(30, 4),
(30, 8),
(32, 4),
(32, 10),
(34, 4),
(34, 6),
(34, 10),
(35, 1),
(35, 65),
(36, 32),
(36, 46),
(37, 10),
(39, 35),
(40, 9),
(40, 35),
(40, 58),
(41, 10),
(42, 1),
(43, 6),
(43, 40),
(43, 45),
(44, 1),
(45, 7),
(45, 76),
(46, 57),
(46, 80),
(47, 4),
(47, 6),
(48, 65),
(50, 4),
(50, 12),
(51, 9),
(51, 36),
(52, 6),
(52, 35),
(53, 10),
(54, 55),
(55, 68),
(56, 4),
(56, 10),
(58, 46),
(58, 54),
(59, 65),
(60, 6),
(60, 76),
(61, 35),
(62, 4),
(64, 6),
(64, 76),
(65, 65),
(66, 4),
(66, 10),
(67, 1),
(68, 7),
(68, 53),
(69, 4),
(69, 6),
(71, 36),
(71, 46),
(72, 10),
(73, 1),
(74, 57),
(75, 9),
(75, 35),
(75, 58),
(76, 4),
(76, 12),
(77, 68),
(79, 4),
(79, 6),
(80, 65),
(81, 6),
(81, 40),
(81, 45),
(82, 46),
(82, 54),
(83, 45),
(84, 10),
(85, 7),
(86, 4),
(86, 8),
(87, 1),
(88, 76),
(89, 57),
(89, 80),
(90, 4),
(90, 10),
(91, 1),
(92, 6),
(92, 9),
(93, 1),
(94, 66),
(95, 40),
(96, 35),
(97, 9),
(97, 58),
(98, 68),
(99, 10),
(99, 12),
(100, 4),
(100, 6);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `cel_alak`
--

CREATE TABLE `cel_alak` (
  `id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `cel_alak`
--

INSERT INTO `cel_alak` (`id`, `nev`) VALUES
(1, 'Izomépítés'),
(2, 'Fogyás'),
(3, 'Erőemelés'),
(4, 'Állóképesség');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `edzesen_kivuli_mozgas`
--

CREATE TABLE `edzesen_kivuli_mozgas` (
  `id` int(11) NOT NULL,
  `intenzitas` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `edzesen_kivuli_mozgas`
--

INSERT INTO `edzesen_kivuli_mozgas` (`id`, `intenzitas`) VALUES
(1, 'Ülőmunka (kevés mozgás)'),
(2, 'Séta / Könnyű mozgás'),
(3, 'Aktív fizikai munka'),
(4, 'Rendszeres sport naponta');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `edzesterv`
--

CREATE TABLE `edzesterv` (
  `edzesterv_id` int(11) NOT NULL,
  `terv_csoport_id` varchar(50) NOT NULL,
  `weekday_sorszam` int(11) NOT NULL,
  `gyakorlat_id` int(11) NOT NULL,
  `sorrend` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `edzo`
--

CREATE TABLE `edzo` (
  `edzo_id` int(11) NOT NULL,
  `edzoterem_cim` point DEFAULT NULL,
  `kep` text DEFAULT NULL,
  `idezet` text DEFAULT NULL,
  `leiras` text DEFAULT NULL,
  `kompetenciak` text DEFAULT NULL,
  `statusz` enum('jelentkezett','elfogadva') NOT NULL DEFAULT 'jelentkezett'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `edzo`
--

INSERT INTO `edzo` (`edzo_id`, `edzoterem_cim`, `kep`, `idezet`, `leiras`, `kompetenciak`, `statusz`) VALUES
(8, 0x000000000101000000c81c700278243340819d51a9c8ba4740, 'togi.jpg', '\"Minden nap tökéletes, ha szteroidozól.\"', 'Extra kalóriabevitel, agresszív fejlődés, Kebab-diéta szakértő.', 'Tömegnövelés, extrém kalóriabevitel, motiváció', 'elfogadva'),
(9, 0x000000000101000000c81c700278243340819d51a9c8ba4740, 'chris.jpg', '\"PR vagy ER.\"', 'Brutális súlyok, üvöltve edzés, a Tren-ikrek egyik fele.', 'Erőemelés, nehézatlétika, mentális állóképesség', 'elfogadva'),
(10, 0x000000000101000000c81c700278243340819d51a9c8ba4740, 'mike.jpg', '\"Ha még tudsz beszélni, nem raktál rá elég súlyt.\"', 'Káosz-menedzsment a teremben, nehéz vasak.', 'Erőemelés, intenzív súlyzós edzés, formajavítás', 'elfogadva'),
(11, 0x000000000101000000c81c700278243340819d51a9c8ba4740, 'sara.jpg', '\"Várj, ezt le kell videóznom!\"', 'Influenszer tréning, tartalomgyártás edzés közben.', 'Esztétikus testalkat, social media fitnesz, könnyed erősítés', 'elfogadva'),
(12, 0x0000000001010000005b0641ecf117334003c9e0cdbfb84740, 'rich.jpg', '\"Mi lenne, ha több kaját ennél?\"', 'Napi 10 étkezés, 8 órás karezés szakértő, 5% legenda.', 'Extrém testépítés, pózolás, szigorú étrend tervezés', 'elfogadva'),
(13, 0x0000000001010000005b0641ecf117334003c9e0cdbfb84740, 'annabel.jpg', '\"A forma nem vár, dolgozz meg érte!\"', 'Esztétikus testalkat, precíz étrendtervezés, intenzív alsótest edzés.', 'Alsótest fókuszú edzés, precíz étrend, szálkásítás', 'elfogadva'),
(14, 0x00000000010100000031e24c5d430633409b7c694073bf4740, 'keiani.jpg', '\"Erősebb vagy, mint gondolnád.\"', 'Súlyemelés és funkcionális fitness Hawaii-ról.', 'Olimpiai súlyemelés, CrossFit alapok, funkcionális erőfejlesztés', 'elfogadva'),
(15, 0x000000000101000000c81c700278243340819d51a9c8ba4740, 'krissy.jpg', '\"Ne csak csináld, értsd is meg!\"', 'Női közösségépítés, otthoni és edzőtermi komplex programok.', 'Otthoni edzés, női fitnesz, komplex programtervezés', 'elfogadva'),
(16, 0x000000000101000000d619df1797123340be056dcdb1bf4740, 'patty.jpg', '\"Ez csak egy kis mozgás, nyugi.\"', 'Zseniális mobilitás, testépítés és egy kis humor.', 'Mobilitás, calisthenics, prevenció és rehabilitáció', 'elfogadva'),
(17, 0x000000000101000000da8b683ba60e33402539605793c34740, 'alex.jpg', '\"Görög isten forma.\"', 'Természetes testépítés és esztétika.', 'Természetes testépítés, szálkásítás, pózolás és esztétika', 'elfogadva'),
(18, 0x000000000101000000da8b683ba60e33402539605793c34740, 'sam.jpg', '\"Érezd a bedurranást.\"', 'Intenzív edzés, klasszikus testépítő stílus.', 'Klasszikus testépítés, magas intenzitású tréning (HIT), tömegnövelés', 'elfogadva'),
(19, 0x000000000101000000ef20d15f430d3340376e313f37bf4740, 'david.jpg', '\"Maradj következetes.\"', 'Transzformáció és erőnléti edzés.', 'Testkompozíció megváltoztatása, erőnlét, fotózásra felkészítés', 'elfogadva'),
(20, 0x000000000101000000ef20d15f430d3340376e313f37bf4740, 'whitney.jpg', '\"Csodás nap élni!\"', 'Pozitivitás és funkcionális női tréning.', 'Funkcionális női edzés, mentális jóllét, kezdők mentorálása', 'elfogadva'),
(21, 0x000000000101000000ef20d15f430d3340376e313f37bf4740, 'pamela.jpg', '\"Érezd az égetést!\"', 'Eszköz nélküli otthoni edzések és HIIT.', 'HIIT, eszköz nélküli otthoni edzés, állóképesség fejlesztés', 'elfogadva'),
(200, NULL, NULL, NULL, NULL, NULL, 'jelentkezett'),
(201, NULL, NULL, NULL, NULL, NULL, 'jelentkezett'),
(202, NULL, NULL, NULL, NULL, NULL, 'jelentkezett');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `etrend`
--

CREATE TABLE `etrend` (
  `etrend_id` int(11) NOT NULL,
  `csoport_id` int(11) NOT NULL,
  `weekday` varchar(20) NOT NULL,
  `etkezes_sorszama` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `recept_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalo`
--

CREATE TABLE `felhasznalo` (
  `felhasznalo_id` int(11) NOT NULL,
  `testsuly` float NOT NULL,
  `magassag` float NOT NULL,
  `edzesre_forditott_ido` int(11) NOT NULL,
  `napi_kaloria_bevitel` int(11) DEFAULT NULL,
  `cel_alak_id` int(11) NOT NULL,
  `cel_testsuly` float DEFAULT NULL,
  `EKM_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalo`
--

INSERT INTO `felhasznalo` (`felhasznalo_id`, `testsuly`, `magassag`, `edzesre_forditott_ido`, `napi_kaloria_bevitel`, `cel_alak_id`, `cel_testsuly`, `EKM_id`) VALUES
(1, 85, 180, 60, 2500, 1, 80, 2),
(2, 95, 185, 45, 3000, 2, 85, 1),
(3, 60, 165, 90, 1800, 3, 58, 2),
(4, 78, 175, 120, 2800, 4, 85, 3),
(5, 68, 170, 30, 2000, 2, 62, 2),
(6, 110, 190, 60, 3500, 4, 95, 4),
(7, 55, 160, 45, 1600, 1, 55, 2);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalo_edzesi_napok`
--

CREATE TABLE `felhasznalo_edzesi_napok` (
  `felhasznalo_id` int(11) NOT NULL,
  `nap_sorszam` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalo_edzesi_napok`
--

INSERT INTO `felhasznalo_edzesi_napok` (`felhasznalo_id`, `nap_sorszam`) VALUES
(1, 1),
(1, 3),
(1, 5),
(2, 2),
(2, 4),
(2, 6),
(3, 1),
(3, 4),
(4, 2),
(5, 2),
(5, 4),
(5, 6),
(6, 2),
(6, 4),
(6, 6),
(7, 2),
(7, 4),
(7, 6);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalas`
--

CREATE TABLE `foglalas` (
  `foglalas_id` int(11) NOT NULL,
  `datum` date NOT NULL,
  `ido` time NOT NULL,
  `statusz` enum('aktiv','inaktiv','torolt') NOT NULL DEFAULT 'aktiv',
  `edzo_id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `aktiv_flag` tinyint(4) GENERATED ALWAYS AS (`statusz` = 'aktiv') STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `foglalas`
--

INSERT INTO `foglalas` (`foglalas_id`, `datum`, `ido`, `statusz`, `edzo_id`, `felhasznalo_id`) VALUES
(1, '2026-05-05', '10:00:00', 'aktiv', 8, 1),
(2, '2026-05-05', '10:30:00', 'aktiv', 8, 1),
(3, '2026-05-06', '14:00:00', 'aktiv', 8, 2),
(4, '2026-05-05', '10:00:00', 'aktiv', 9, 2),
(5, '2026-05-05', '10:30:00', 'aktiv', 9, 2),
(6, '2026-05-06', '14:00:00', 'aktiv', 9, 3),
(7, '2026-05-05', '10:00:00', 'aktiv', 10, 3),
(8, '2026-05-05', '10:30:00', 'aktiv', 10, 3),
(9, '2026-05-06', '14:00:00', 'aktiv', 10, 4),
(10, '2026-05-05', '10:00:00', 'aktiv', 11, 4),
(11, '2026-05-05', '10:30:00', 'aktiv', 11, 4),
(12, '2026-05-06', '14:00:00', 'aktiv', 11, 5),
(13, '2026-05-05', '10:00:00', 'aktiv', 12, 5),
(14, '2026-05-05', '10:30:00', 'aktiv', 12, 5),
(15, '2026-05-06', '14:00:00', 'aktiv', 12, 6),
(16, '2026-05-05', '10:00:00', 'aktiv', 13, 6),
(17, '2026-05-05', '10:30:00', 'aktiv', 13, 6),
(18, '2026-05-06', '14:00:00', 'aktiv', 13, 7);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `gyakorlat`
--

CREATE TABLE `gyakorlat` (
  `gyakorlat_id` int(11) NOT NULL,
  `nev` varchar(150) NOT NULL,
  `leiras` text DEFAULT NULL,
  `kor` int(11) NOT NULL,
  `ismetles` int(11) NOT NULL,
  `tipus` enum('sulyzós','saját_testsúlyos','kardió') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `gyakorlat`
--

INSERT INTO `gyakorlat` (`gyakorlat_id`, `nev`, `leiras`, `kor`, `ismetles`, `tipus`) VALUES
(1, 'Fekvenyomás rúddal', 'Klasszikus nyomás vízszintes padon.', 4, 10, 'sulyzós'),
(2, 'Fekvenyomás kézisúlyzóval', 'Vízszintes nyomás egykezes súlyzókkal.', 4, 10, 'sulyzós'),
(3, 'Fekvenyomás ferdepadon rúddal', 'Felső mellizom fókuszú nyomás.', 4, 10, 'sulyzós'),
(4, 'Fekvenyomás ferdepadon kézisúlyzóval', 'Felső mellizom egykezes súlyzókkal.', 4, 10, 'sulyzós'),
(5, 'Fekvenyomás negatív padon', 'Alsó mellizom fókuszú nyomás.', 3, 12, 'sulyzós'),
(6, 'Tárogatás egyenes padon', 'Íves mozdulat vízszintes padon.', 3, 12, 'sulyzós'),
(7, 'Tárogatás ferdepadon', 'Íves mozdulat ferdepadon.', 3, 12, 'sulyzós'),
(8, 'Tárogatás gépen (Pec Deck)', 'Izolációs mellgyakorlat gépen.', 4, 12, 'sulyzós'),
(9, 'Kábel keresztezés fentről', 'Alsó és belső mellizom fókusz.', 4, 15, 'sulyzós'),
(10, 'Kábel keresztezés alulról', 'Felső mellizom fókusz csigán.', 4, 15, 'sulyzós'),
(11, 'Tolódzkodás mellre', 'Saját testsúlyos gyakorlat előredőlve.', 3, 10, 'sulyzós'),
(12, 'Áthúzás kézisúlyzóval', 'Mellkas tágító gyakorlat.', 3, 12, 'sulyzós'),
(13, 'Fekvőtámasz', 'Klasszikus saját testsúlyos gyakorlat.', 4, 20, 'sulyzós'),
(14, 'Széles fekvőtámasz', 'Szélesebb fogású fekvőtámasz.', 3, 15, 'sulyzós'),
(15, 'Súlytárcsa nyomás (Svend Press)', 'Tárcsa préselése és nyomása előre.', 3, 15, 'sulyzós'),
(16, 'Húzódzkodás széles fogással', 'Saját testsúlyos széleshát fókusz.', 4, 8, 'sulyzós'),
(17, 'Húzódzkodás szűk fogással', 'Alsó hát és bicepsz fókusz.', 4, 8, 'sulyzós'),
(18, 'Lehúzás csigán széles fogással', 'Széleshátizom gépgyakorlat.', 4, 10, 'sulyzós'),
(19, 'Lehúzás csigán szűk fogással', 'V-fogantyús lehúzás.', 4, 10, 'sulyzós'),
(20, 'Evezés rúddal döntött törzzsel', 'Vastagító hátgyakorlat rúddal.', 4, 10, 'sulyzós'),
(21, 'Evezés egykezes súlyzóval', 'Fűrészelés padon támaszkodva.', 4, 10, 'sulyzós'),
(22, 'T-rudas evezés', 'Döntött törzsű evezés T-rúddal.', 4, 10, 'sulyzós'),
(23, 'Evezés alsó csigán', 'Ülő evezés szűk fogással.', 4, 12, 'sulyzós'),
(24, 'Evezés melltámasszal', 'Kíméli a derekat, izolált evezés.', 4, 12, 'sulyzós'),
(25, 'Felhúzás (Deadlift)', 'Összetett erőgyakorlat hátra és lábra.', 4, 5, 'sulyzós'),
(26, 'Hiperhajlítás', 'Alsóhát (merevítő) gyakorlat padon.', 4, 15, 'sulyzós'),
(27, 'Áthúzás csigán egyenes karral', 'Széleshátizom izoláció csigán.', 4, 15, 'sulyzós'),
(28, 'Fordított tárogatás gépen', 'Hátsó delták és lapocka környéke.', 4, 12, 'sulyzós'),
(29, 'Evezés padon (Seal Row)', 'Vízszintes padon fekve végzett evezés.', 4, 10, 'sulyzós'),
(30, 'Jóreggelt gyakorlat', 'Alsóhát rúd a nyakban.', 3, 12, 'sulyzós'),
(31, 'Mellből nyomás rúddal', 'Klasszikus vállnyomás állva vagy ülve.', 4, 10, 'sulyzós'),
(32, 'Vállnyomás egykezes súlyzóval', 'Ülő nyomás egykezesekkel.', 4, 10, 'sulyzós'),
(33, 'Oldalemelés', 'Oldalsó delta izolálása egykezesekkel.', 4, 12, 'sulyzós'),
(34, 'Előreemelés', 'Elülső delta fókusz súlyzóval vagy tárcsával.', 3, 12, 'sulyzós'),
(35, 'Döntött törzsű oldalemelés', 'Hátsó delta gyakorlat egykezesekkel.', 4, 12, 'sulyzós'),
(36, 'Arnold nyomás', 'Csavaró mozdulatos vállnyomás.', 4, 10, 'sulyzós'),
(37, 'Archoz húzás (Face pull)', 'Hátsó delta és rotátorköpeny csigán.', 4, 15, 'sulyzós'),
(38, 'Oldalemelés csigán', 'Folyamatos feszülést biztosító oldalemelés.', 4, 12, 'sulyzós'),
(39, 'Evezés állhoz rúddal', 'Széles váll fókuszú húzó mozdulat.', 4, 10, 'sulyzós'),
(40, 'Vállvonogatás rúddal', 'Csuklyásizom gyakorlat.', 4, 15, 'sulyzós'),
(41, 'Vállvonogatás egykezesekkel', 'Csuklyásizom izolációja.', 4, 15, 'sulyzós'),
(42, 'Fordított pec-deck', 'Hátsó delta gépen.', 4, 12, 'sulyzós'),
(43, 'Bicepsz állva rúddal', 'Alap tömegnövelő bicepsz gyakorlat.', 4, 10, 'sulyzós'),
(44, 'Váltott karú bicepsz', 'Álló vagy ülő hajlítás egykezesekkel.', 4, 10, 'sulyzós'),
(45, 'Kalapács bicepsz', 'Kétfejű karizom és brachialis fókusz.', 4, 12, 'sulyzós'),
(46, 'Koncentrált bicepsz', 'Izolációs gyakorlat combon támasztva.', 3, 12, 'sulyzós'),
(47, 'Scott-pados hajlítás', 'Bicepsz alsó tapadási pontjának terhelése.', 4, 10, 'sulyzós'),
(48, 'Bicepsz alsó csigán', 'Folyamatos feszülésű hajlítás rúddal.', 4, 12, 'sulyzós'),
(49, 'Francia rudas bicepsz', 'Csuklókímélő álló bicepsz.', 4, 10, 'sulyzós'),
(50, 'Bicepsz pók padon', 'Előredőlve végzett izolációs hajlítás.', 3, 12, 'sulyzós'),
(51, '21-es bicepsz', 'Részismétléses intenzitásnövelő módszer.', 3, 21, 'sulyzós'),
(52, 'Keresztező kalapács', 'Test előtt vezetett kalapács hajlítás.', 3, 12, 'sulyzós'),
(53, 'Letolás csigán kötéllel', 'Tricepsz külső fejének izolációja.', 4, 12, 'sulyzós'),
(54, 'Letolás csigán egyenes rúddal', 'Nagyobb súlyos tricepsz gyakorlat.', 4, 10, 'sulyzós'),
(55, 'Homlokzatra engedés (Koponyazúzó)', 'Fekve végzett hajlítás francia rúddal.', 4, 10, 'sulyzós'),
(56, 'Lórugás egykezes súlyzóval', 'Döntött törzsű tricepsz extenzió.', 3, 12, 'sulyzós'),
(57, 'Tricepsz nyomás fej felett egykezessel', 'Tricepsz hosszú fejének nyújtása.', 4, 10, 'sulyzós'),
(58, 'Szűk nyomás padon', 'Tömegnövelő tricepsz alapgyakorlat.', 4, 8, 'sulyzós'),
(59, 'Tolódzkodás padon', 'Saját testsúlyos tricepsz gyakorlat.', 4, 15, 'sulyzós'),
(60, 'Köteles nyomás fej felett csigán', 'Hosszú fej fókusz kábelen.', 4, 12, 'sulyzós'),
(61, 'Egykezes fordított letolás', 'Alsó fogásos izoláció csigán.', 3, 15, 'sulyzós'),
(62, 'Tricepsz fekvőtámasz (Gyémánt)', 'Szűk kéztartásos fekvőtámasz.', 3, 15, 'sulyzós'),
(63, 'Csuklóbehúzás rúddal', 'Alkar hajlító izmai padon támasztva.', 4, 15, 'sulyzós'),
(64, 'Csuklófeszítés rúddal', 'Alkar feszítő izmai padon támasztva.', 4, 15, 'sulyzós'),
(65, 'Fordított fogású bicepsz', 'Brachioradialis (alkar) és bicepsz.', 4, 12, 'sulyzós'),
(66, 'Zottman hajlítás', 'Fel- és lefelé más fogással végzett hajlítás.', 3, 12, 'sulyzós'),
(67, 'Farmer séta', 'Nehéz súlyok cipelése a szorítás javításáért.', 4, 1, 'sulyzós'),
(68, 'Tárcsa csípés (Pinch Grip)', 'Tárcsák ujjheggyel tartása.', 3, 1, 'sulyzós'),
(69, 'Csuklóbehúzás egykezesekkel', 'Egykezes izoláció padon.', 3, 15, 'sulyzós'),
(70, 'Csavarás rúddal (Wrist roller)', 'Súly feltekerése rúdra.', 3, 1, 'sulyzós'),
(71, 'Guggolás rúddal', 'Összetett alapgyakorlat a teljes combra.', 4, 8, 'sulyzós'),
(72, 'Elölguggolás', 'Rúd a kulcscsonton, domináns Quadriceps terhelés.', 4, 10, 'sulyzós'),
(73, 'Lábtolás gépen', 'Nagy súlyos nyomás háttámasszal.', 4, 12, 'sulyzós'),
(74, 'Lábnyújtás gépen', 'Izolációs gyakorlat a Quadriceps fejeire.', 4, 15, 'sulyzós'),
(75, 'Hack-guggolás', 'Gépen végzett guggolás, stabil törzzsel.', 4, 10, 'sulyzós'),
(76, 'Sissy guggolás', 'Saját testsúlyos feszítés a comb elülső részére.', 3, 12, 'sulyzós'),
(77, 'Bolgár guggolás', 'Egy lábas guggolás, intenzív feszítő munka.', 3, 10, 'sulyzós'),
(78, 'Kehely guggolás', 'Súlyzóval végzett mély guggolás.', 4, 12, 'sulyzós'),
(79, 'Kitörés előre', 'Dinamikus lábgyakorlat a combfeszítőnek.', 3, 12, 'sulyzós'),
(80, 'Lépcsőzés súllyal', 'Funkcionális Quadriceps és állóképesség.', 3, 15, 'sulyzós'),
(81, 'Merevlábas felhúzás', 'Hamstring nyújtása és terhelése rúddal.', 4, 10, 'sulyzós'),
(82, 'Lábhajlítás fekve', 'Gépi izoláció a comb hátsó részére.', 4, 12, 'sulyzós'),
(83, 'Lábhajlítás ülve', 'Koncentrált Hamstring gyakorlat gépen.', 4, 12, 'sulyzós'),
(84, 'Jóreggelt gyakorlat', 'Csípőhajlítás rúddal a nyakban.', 3, 12, 'sulyzós'),
(85, 'Római székes hajlítás', 'Saját testsúlyos Hamstring izoláció.', 3, 10, 'sulyzós'),
(86, 'Sumo felhúzás', 'Széles terpeszű emelés Hamstring fókusszal.', 4, 8, 'sulyzós'),
(87, 'Lábhajlítás állva', 'Egy lábas gépi hajlítás.', 3, 12, 'sulyzós'),
(88, 'Nordic hajlítás', 'Excentrikus Hamstring erősítés.', 3, 8, 'sulyzós'),
(89, 'Csípőfeltolás (Hip Thrust)', 'A leghatékonyabb farizom építő mozgás.', 4, 10, 'sulyzós'),
(90, 'Kábeles hátrarúgás', 'Izolált farizom edzés csigán.', 3, 15, 'sulyzós'),
(91, 'Combtávolítás gépen', 'A külső farizmok (abduktorok) edzése.', 3, 15, 'sulyzós'),
(92, 'Fellépés padra', 'Magasra lépés farizom fókusszal.', 3, 12, 'sulyzós'),
(93, 'Kagyló gyakorlat', 'Rehabilitációs és aktivációs farizom munka.', 3, 20, 'sulyzós'),
(94, 'Széles guggolás (Plié)', 'Belső comb és farizom fókusz.', 3, 15, 'sulyzós'),
(95, 'Vádli állva gépen', 'Teljes lábszár izomzat terhelése.', 4, 15, 'sulyzós'),
(96, 'Vádli ülve gépen', 'A mélyen fekvő gázlóizom edzése.', 4, 20, 'sulyzós'),
(97, 'Szamárvádli', 'Döntött törzsű vádli gyakorlat.', 3, 15, 'sulyzós'),
(98, 'Vádli lábtológépen', 'Bokahajlítás lábtoló gépen.', 4, 15, 'sulyzós'),
(99, 'Vádli állva egy lábon', 'Saját testsúlyos egyensúly és vádli.', 3, 20, 'sulyzós'),
(100, 'Fordított vádli', 'A sípcsonti izom erősítése.', 3, 15, 'sulyzós');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `gyakorlat_izomcsoport`
--

CREATE TABLE `gyakorlat_izomcsoport` (
  `gyakorlat_id` int(11) NOT NULL,
  `izom_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `gyakorlat_izomcsoport`
--

INSERT INTO `gyakorlat_izomcsoport` (`gyakorlat_id`, `izom_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 4),
(17, 4),
(18, 4),
(19, 4),
(20, 4),
(21, 4),
(22, 4),
(23, 4),
(24, 4),
(25, 4),
(26, 4),
(27, 4),
(28, 4),
(29, 4),
(30, 4),
(31, 2),
(32, 2),
(33, 2),
(34, 2),
(35, 2),
(36, 2),
(37, 2),
(38, 2),
(39, 2),
(40, 2),
(41, 2),
(42, 2),
(43, 5),
(44, 5),
(45, 5),
(46, 5),
(47, 5),
(48, 5),
(49, 5),
(50, 5),
(51, 5),
(52, 5),
(53, 3),
(54, 3),
(55, 3),
(56, 3),
(57, 3),
(58, 3),
(59, 3),
(60, 3),
(61, 3),
(62, 3),
(71, 6),
(72, 6),
(73, 6),
(74, 6),
(75, 6),
(76, 6),
(77, 6),
(78, 6),
(79, 6),
(80, 6),
(81, 6),
(82, 6),
(83, 6),
(84, 6),
(85, 6),
(86, 6),
(87, 6),
(88, 6),
(89, 6),
(90, 6),
(91, 6),
(92, 6),
(93, 6),
(94, 6),
(95, 6),
(96, 6),
(97, 6),
(98, 6),
(99, 6),
(100, 6);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `heti_beosztas`
--

CREATE TABLE `heti_beosztas` (
  `beo_id` int(11) NOT NULL,
  `weekday` int(11) NOT NULL,
  `start` time NOT NULL,
  `end` time NOT NULL,
  `statusz` enum('aktiv','torolt') NOT NULL DEFAULT 'aktiv',
  `mettol_ervenyes` date NOT NULL,
  `edzo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `heti_beosztas`
--

INSERT INTO `heti_beosztas` (`beo_id`, `weekday`, `start`, `end`, `statusz`, `mettol_ervenyes`, `edzo_id`) VALUES
(1, 0, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 8),
(2, 1, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 8),
(3, 2, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 8),
(4, 3, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 8),
(5, 4, '09:00:00', '11:00:00', 'aktiv', '2026-05-04', 8),
(6, 0, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 9),
(7, 1, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 9),
(8, 2, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 9),
(9, 3, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 9),
(10, 4, '09:00:00', '11:00:00', 'aktiv', '2026-05-04', 9),
(11, 0, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 10),
(12, 1, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 10),
(13, 2, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 10),
(14, 3, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 10),
(15, 4, '09:00:00', '11:00:00', 'aktiv', '2026-05-04', 10),
(16, 0, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 11),
(17, 1, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 11),
(18, 2, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 11),
(19, 3, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 11),
(20, 4, '09:00:00', '11:00:00', 'aktiv', '2026-05-04', 11),
(21, 0, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 12),
(22, 1, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 12),
(23, 2, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 12),
(24, 3, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 12),
(25, 4, '09:00:00', '11:00:00', 'aktiv', '2026-05-04', 12),
(26, 0, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 13),
(27, 1, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 13),
(28, 2, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 13),
(29, 3, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 13),
(30, 4, '09:00:00', '11:00:00', 'aktiv', '2026-05-04', 13),
(31, 0, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 14),
(32, 1, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 14),
(33, 2, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 14),
(34, 3, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 14),
(35, 4, '09:00:00', '11:00:00', 'aktiv', '2026-05-04', 14),
(36, 0, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 15),
(37, 1, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 15),
(38, 2, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 15),
(39, 3, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 15),
(40, 4, '09:00:00', '11:00:00', 'aktiv', '2026-05-04', 15),
(41, 0, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 16),
(42, 1, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 16),
(43, 2, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 16),
(44, 3, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 16),
(45, 4, '09:00:00', '11:00:00', 'aktiv', '2026-05-04', 16),
(46, 0, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 17),
(47, 1, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 17),
(48, 2, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 17),
(49, 3, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 17),
(50, 4, '09:00:00', '11:00:00', 'aktiv', '2026-05-04', 17),
(51, 0, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 18),
(52, 1, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 18),
(53, 2, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 18),
(54, 3, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 18),
(55, 4, '09:00:00', '11:00:00', 'aktiv', '2026-05-04', 18),
(56, 0, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 19),
(57, 1, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 19),
(58, 2, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 19),
(59, 3, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 19),
(60, 4, '09:00:00', '11:00:00', 'aktiv', '2026-05-04', 19),
(61, 0, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 20),
(62, 1, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 20),
(63, 2, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 20),
(64, 3, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 20),
(65, 4, '09:00:00', '11:00:00', 'aktiv', '2026-05-04', 20),
(66, 0, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 21),
(67, 1, '10:00:00', '12:00:00', 'aktiv', '2026-05-04', 21),
(68, 2, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 21),
(69, 3, '14:00:00', '16:00:00', 'aktiv', '2026-05-04', 21),
(70, 4, '09:00:00', '11:00:00', 'aktiv', '2026-05-04', 21);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `izomcsoport`
--

CREATE TABLE `izomcsoport` (
  `izom_id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `izomcsoport`
--

INSERT INTO `izomcsoport` (`izom_id`, `nev`) VALUES
(5, 'Bicepsz'),
(7, 'Has'),
(4, 'Hát'),
(6, 'Láb'),
(1, 'Mell'),
(3, 'Tricepsz'),
(2, 'Váll');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `komment`
--

CREATE TABLE `komment` (
  `komment_id` int(11) NOT NULL,
  `szoveg` text NOT NULL,
  `ertekeles` int(11) NOT NULL,
  `statusz` enum('aktiv','inaktiv') NOT NULL DEFAULT 'aktiv',
  `edzo_id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `komment`
--

INSERT INTO `komment` (`komment_id`, `szoveg`, `ertekeles`, `statusz`, `edzo_id`, `felhasznalo_id`) VALUES
(1, 'A Kebab-diéta tényleg működik, köszi!', 5, 'aktiv', 8, 1),
(2, 'A görögdinnye mellé most már a csirke-rizs is alap, köszi a motivációt!', 5, 'aktiv', 8, 3),
(3, 'Nagyon jó a hangulat az edzéseken, csak ajánlani tudom!', 4, 'aktiv', 8, 5),
(4, '', 4, 'aktiv', 8, 2),
(5, 'Brutális edzések, azóta csak üvöltve nyomok fekve.', 5, 'aktiv', 9, 3),
(6, 'A pulzusom az egekben, de a fejlődés megkérdőjelezhetetlen.', 5, 'aktiv', 9, 5),
(7, 'Soha nem gondoltam volna, hogy ennyit bírok.', 5, 'aktiv', 9, 7),
(8, '', 5, 'aktiv', 9, 4),
(9, 'Szigorú de igazságos, kemények a súlyok.', 4, 'aktiv', 10, 5),
(10, 'Végre valaki, aki nem csak a gépeket mutogatja, hanem tényleg edzünk.', 5, 'aktiv', 10, 7),
(11, 'Minden edzés egy kihívás, de megéri a szenvedést.', 5, 'aktiv', 10, 2),
(12, '', 5, 'aktiv', 10, 6),
(13, 'Nagyon kedves, és segített beállítani a fényeket is a videómhoz!', 5, 'aktiv', 11, 7),
(14, 'Nagyon jó fejek az edzések, és a tippek is hasznosak a mindennapokra.', 4, 'aktiv', 11, 2),
(15, 'Szuper energiákat hoz a terembe!', 5, 'aktiv', 11, 4),
(16, '', 3, 'aktiv', 11, 1),
(17, '8 órás karezés után nem érzem a kezeim, 5% forever!', 5, 'aktiv', 12, 2),
(18, 'Whatever it takes! Brutális volumen, pontosan ezt kerestem.', 5, 'aktiv', 12, 4),
(19, 'Többet eszem, mint valaha, és jönnek az eredmények.', 5, 'aktiv', 12, 6),
(20, '', 5, 'aktiv', 12, 3),
(21, 'Precíz étrend, látványos fejlődés pár hét alatt.', 5, 'aktiv', 13, 4),
(22, 'Szuperül felépített program, minden kérdésemre azonnal válaszol.', 5, 'aktiv', 13, 6),
(23, 'Nagyon odafigyel a gyakorlatok helyes kivitelezésére.', 5, 'aktiv', 13, 1),
(24, '', 4, 'aktiv', 13, 5),
(25, 'Szuper hangulatú funkcionális edzések!', 5, 'aktiv', 14, 6),
(26, 'Soha nem gondoltam volna, hogy ennyit számít a törzsizom erősítése.', 5, 'aktiv', 14, 1),
(27, 'Kiváló mobilitási tippeket kaptam.', 4, 'aktiv', 14, 3),
(28, '', 5, 'aktiv', 14, 7),
(29, 'A közösség és a program is zseniális.', 5, 'aktiv', 15, 1),
(30, 'Imádom az appot és az edzéseket is, nagyon inspiráló személyiség.', 5, 'aktiv', 15, 3),
(31, 'Az otthoni edzéstervei mentették meg a formámat.', 5, 'aktiv', 15, 5),
(32, '', 4, 'aktiv', 15, 2),
(33, 'A mobilitási gyakorlatok megváltoztatták az életem.', 5, 'aktiv', 16, 3),
(34, 'Végre megtanultam rendesen hidazni és guggolni fájdalom nélkül.', 5, 'aktiv', 16, 5),
(35, 'Iszonyat jó a vibe, a zene és az egész edzés!', 5, 'aktiv', 16, 7),
(36, '', 5, 'aktiv', 16, 4),
(37, 'Esztétika mindenek felett, remek tanácsok.', 5, 'aktiv', 17, 5),
(38, 'A pózolási tanácsok sokat segítettek az önbizalmamon.', 4, 'aktiv', 17, 7),
(39, 'A vágásmentes edzésvideói nagyon motiválóak.', 5, 'aktiv', 17, 2),
(40, '', 4, 'aktiv', 17, 6),
(41, 'Rövid, tömör, intenzív. Pont ahogy szeretem.', 5, 'aktiv', 18, 7),
(42, 'Nincs duma, csak munka. A pumpa valami eszeveszett a végére.', 5, 'aktiv', 18, 2),
(43, 'A csokis tej csodákra képes edzés után!', 5, 'aktiv', 18, 4),
(44, '', 5, 'aktiv', 18, 1),
(45, 'Nagyon következetes edzéstervet kaptam.', 5, 'aktiv', 19, 2),
(46, 'A világítási tippek és az erőemelő alapok is top kategóriásak.', 5, 'aktiv', 19, 4),
(47, 'A PR-jaim heteken belül javultak a tanácsaival.', 5, 'aktiv', 19, 6),
(48, '', 4, 'aktiv', 19, 3),
(49, 'Sugárzik belőle a pozitivitás, öröm vele az edzés.', 5, 'aktiv', 20, 4),
(50, 'Mindig jobb kedvvel jövök ki a teremből, mint ahogy bementem.', 5, 'aktiv', 20, 6),
(51, 'A legjobb edzőtárs, hihetetlenül aranyos!', 5, 'aktiv', 20, 1),
(52, '', 5, 'aktiv', 20, 5),
(53, 'A HIIT edzései kinyírtak, de imádom!', 5, 'aktiv', 21, 6),
(54, 'A 10 perces videói után is napokig izomlázam van, hihetetlen hatékony.', 5, 'aktiv', 21, 1),
(55, 'Nincs pihenő, csak folyamatos pörgés. Pont ez kellett.', 5, 'aktiv', 21, 3),
(56, '', 4, 'aktiv', 21, 7);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kulonleges_alkalom`
--

CREATE TABLE `kulonleges_alkalom` (
  `ka_id` int(11) NOT NULL,
  `datum` date NOT NULL,
  `ido` time NOT NULL,
  `statusz` enum('aktiv','inaktiv','torolt') NOT NULL DEFAULT 'aktiv',
  `edzo_id` int(11) NOT NULL,
  `aktiv_flag` tinyint(4) GENERATED ALWAYS AS (`statusz` = 'aktiv') STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `kulonleges_alkalom`
--

INSERT INTO `kulonleges_alkalom` (`ka_id`, `datum`, `ido`, `statusz`, `edzo_id`) VALUES
(1, '2026-05-05', '11:00:00', 'aktiv', 8),
(2, '2026-05-05', '11:30:00', 'aktiv', 8),
(3, '2026-05-06', '15:00:00', 'aktiv', 8),
(4, '2026-05-05', '11:00:00', 'aktiv', 9),
(5, '2026-05-05', '11:30:00', 'aktiv', 9),
(6, '2026-05-06', '15:00:00', 'aktiv', 9),
(7, '2026-05-05', '11:00:00', 'aktiv', 10),
(8, '2026-05-05', '11:30:00', 'aktiv', 10),
(9, '2026-05-06', '15:00:00', 'aktiv', 10),
(10, '2026-05-05', '11:00:00', 'aktiv', 11),
(11, '2026-05-05', '11:30:00', 'aktiv', 11),
(12, '2026-05-06', '15:00:00', 'aktiv', 11),
(13, '2026-05-05', '11:00:00', 'aktiv', 12),
(14, '2026-05-05', '11:30:00', 'aktiv', 12),
(15, '2026-05-06', '15:00:00', 'aktiv', 12),
(16, '2026-05-05', '11:00:00', 'aktiv', 13),
(17, '2026-05-05', '11:30:00', 'aktiv', 13),
(18, '2026-05-06', '15:00:00', 'aktiv', 13),
(19, '2026-05-05', '11:00:00', 'aktiv', 14),
(20, '2026-05-05', '11:30:00', 'aktiv', 14),
(21, '2026-05-06', '15:00:00', 'aktiv', 14),
(22, '2026-05-05', '11:00:00', 'aktiv', 15),
(23, '2026-05-05', '11:30:00', 'aktiv', 15),
(24, '2026-05-06', '15:00:00', 'aktiv', 15),
(25, '2026-05-05', '11:00:00', 'aktiv', 16),
(26, '2026-05-05', '11:30:00', 'aktiv', 16),
(27, '2026-05-06', '15:00:00', 'aktiv', 16),
(28, '2026-05-05', '11:00:00', 'aktiv', 17),
(29, '2026-05-05', '11:30:00', 'aktiv', 17),
(30, '2026-05-06', '15:00:00', 'aktiv', 17),
(31, '2026-05-05', '11:00:00', 'aktiv', 18),
(32, '2026-05-05', '11:30:00', 'aktiv', 18),
(33, '2026-05-06', '15:00:00', 'aktiv', 18),
(34, '2026-05-05', '11:00:00', 'aktiv', 19),
(35, '2026-05-05', '11:30:00', 'aktiv', 19),
(36, '2026-05-06', '15:00:00', 'aktiv', 19),
(37, '2026-05-05', '11:00:00', 'aktiv', 20),
(38, '2026-05-05', '11:30:00', 'aktiv', 20),
(39, '2026-05-06', '15:00:00', 'aktiv', 20),
(40, '2026-05-05', '11:00:00', 'aktiv', 21),
(41, '2026-05-05', '11:30:00', 'aktiv', 21),
(42, '2026-05-06', '15:00:00', 'aktiv', 21);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `felh_nev` varchar(100) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telszam` varchar(30) DEFAULT NULL,
  `nem` enum('férfi','nő') DEFAULT NULL,
  `role` enum('felhasznalo','edzo','admin') NOT NULL DEFAULT 'felhasznalo',
  `szul_datum` date DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expires` datetime DEFAULT NULL,
  `deleted_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `login`
--

INSERT INTO `login` (`id`, `felh_nev`, `jelszo`, `email`, `telszam`, `nem`, `role`, `szul_datum`, `reset_token`, `reset_expires`, `deleted_at`) VALUES
(1, 'teszt_elek', '$2b$10$85wY6ThuC9.OkKaXnkoK4ezXmmluG0v3fIkK7AYRYBUHguDGsDM5O', 'elek@gmail.com', '+36201112233', 'férfi', 'felhasznalo', '1995-05-10', NULL, NULL, NULL),
(2, 'kovacs_bela', '$2b$10$z5TWZ0KF1ulKMLV/XCH0vOfOOcbGD47RUfpJ6JOLphs0wU.lLPM5G', 'fitlife123123@gmail.com', '+36202223344', 'férfi', 'felhasznalo', '1988-11-20', NULL, NULL, NULL),
(3, 'nagy_anna', '$2b$10$GdvOHW2kXCrNeo5Bozby1OZHkjjtr20J0yClzi9Az8BwcIDTezf5u', 'anna@gmail.com', '+36203334455', 'nő', 'felhasznalo', '2000-01-15', NULL, NULL, NULL),
(4, 'szabo_peti', '$2b$10$kz/bxutu/RMIKsD4ou2rre1.Y.zj2jYgn3N4F79dSq1YyqTEsBYtC', 'peti@gmail.com', '+36204445566', 'férfi', 'felhasznalo', '1992-07-30', NULL, NULL, NULL),
(5, 'horvath_kata', '$2b$10$eb8zzmXS8E0Kv9NGr4XPDelWWfguIOZ3BexnNkosblOjt/AXlHmgi', 'kata@gmail.com', '+36205556677', 'nő', 'felhasznalo', '1998-03-22', NULL, NULL, NULL),
(6, 'kiss_gergo', '$2b$10$NAxxRxqe0NhdMaA8VC6hhOPS9fWn8AP6e94a65T/AiswynIE7XDaO', 'gergo@gmail.com', '+36206667788', 'férfi', 'felhasznalo', '1990-09-05', NULL, NULL, NULL),
(7, 'molnar_zsofia', '$2b$10$JSVc8ofgkhE9LA5BvtIXaefNunM/xoxp6SuDJpiXEiVt.S8TrOjJu', 'zsofia@gmail.com', '+36207778899', 'nő', 'felhasznalo', '2002-12-10', NULL, NULL, NULL),
(8, 'Togi', '$2b$10$7P1Jd4/xLmCpz.y2syZPxubyxrPUhdrxkgXydQw0LvHZPX3RvemnO', 'togi@fitlife.hu', '+36301112233', 'férfi', 'edzo', '1998-05-12', NULL, NULL, NULL),
(9, 'Chris Tren', '$2b$10$NCNMNwhBaM7tAs7ga1rsyOQdfjt0gnJCn1UTf4IGNZtOe9KKSQgyO', 'chris@fitlife.hu', '+36302223344', 'férfi', 'edzo', '2001-08-20', NULL, NULL, NULL),
(10, 'Mike Tren', '$2b$10$T8tb9l0D/tx0EsHNP1kbzeaKG1rI5rTU7GLCg0PISFuvSZ4uYz0t.', 'mike@fitlife.hu', '+36303334455', 'férfi', 'edzo', '2001-08-20', NULL, NULL, NULL),
(11, 'Sara Saffari', '$2b$10$TF8piZtTMXchk8pdakgQreoS8fdfSupRztoCyh4JVZBnyqVrwJQAK', 'sara@fitlife.hu', '+36304445566', 'nő', 'edzo', '2001-02-28', NULL, NULL, NULL),
(12, 'Rich Piana', '$2b$10$bBjGJwfBibiZykx0QTirN.GSamM6bDCWccbXYAwpr.UvoRAk.W9Ia', 'rich@fitlife.hu', '+36305556677', 'férfi', 'edzo', '1970-02-21', NULL, NULL, NULL),
(13, 'Annabel Lucinda', '$2b$10$MwfyU50O47dVq8esK.Y5oOQ/8Eav4J/8qNKTR/JcCFZr2WETgddPq', 'annabel@fitlife.hu', '+36306667788', 'nő', 'edzo', '1999-11-15', NULL, NULL, NULL),
(14, 'Keiani', '$2b$10$.Dd2HJ9ZNZWU1Cld6fNrnOgyvLosovy51a9J0X.2Tpo6xj59BziCC', 'keiani@fitlife.hu', '+36307778899', 'nő', 'edzo', '2000-03-10', NULL, NULL, NULL),
(15, 'Krissy Cela', '$2b$10$xCgnJrNazlKK6aa5hI0Qde9lAi6SBFOF0ofNHAgMKu9dw.sSXRauu', 'krissy@fitlife.hu', '+36308889900', 'nő', 'edzo', '1994-10-07', NULL, NULL, NULL),
(16, 'LeanBeefPatty', '$2b$10$jv80VhgQKqSWomukNnpZS.PCP3cgcW6cSXQxqwj.ckq0aDUr271J.', 'patty@fitlife.hu', '+36309990011', 'nő', 'edzo', '1997-01-21', NULL, NULL, NULL),
(17, 'Alex Eubank', '$2b$10$aZZaO8zQpU/UhCWN5lK9.ueSZDWByA8HTHt3JU4Cb51vFHxN0s3KS', 'alex@fitlife.hu', '+36300001122', 'férfi', 'edzo', '2000-05-23', NULL, NULL, NULL),
(18, 'Sam Sulek', '$2b$10$lJAZ3uel0KEm1lIaxflNhOP1Qyr401JoncdXqmpPIrrmBPloSLxsK', 'sam@fitlife.hu', '+36300002233', 'férfi', 'edzo', '2002-02-07', NULL, NULL, NULL),
(19, 'David Laid', '$2b$10$9UqffWtV6z0Yy057l2SPyOu/qzr1QLGKUT40NazWTXpFfJE2XVZqK', 'david@fitlife.hu', '+36300003344', 'férfi', 'edzo', '1998-01-29', NULL, NULL, NULL),
(20, 'Whitney Simmons', '$2b$10$XpnQTUH6j2A0WekJjlCt3uwwc3rAdBeXpJTOI9UaKlqZuo/Km4M96', 'whitney@fitlife.hu', '+36300004455', 'nő', 'edzo', '1993-02-27', NULL, NULL, NULL),
(21, 'Pamela Reif', '$2b$10$9MyhOgI2tacQQlQOv/UH7.je1fouxwIwZs37n115fnVvbnESfP8ce', 'pamela@fitlife.hu', '+36300005566', 'nő', 'edzo', '1996-07-09', NULL, NULL, NULL),
(200, 'KovacsT', 'titkosjelszo', 'kovacs.tamas@fitlife.hu', '+36301234567', 'férfi', 'edzo', '1990-05-15', NULL, NULL, NULL),
(201, 'NagyA', 'titkosjelszo', 'nagy.anna@fitlife.hu', '+36209876543', 'nő', 'edzo', '1993-08-22', NULL, NULL, NULL),
(202, 'SzaboP', 'titkosjelszo', 'szabo.peter@fitlife.hu', '+36701112233', 'férfi', 'edzo', '1988-11-05', NULL, NULL, NULL),
(203, 'Admin János', '$2b$10$0HCK1iiFSfA1viP8LT4G.eF6Wlf0wWtCsQJJhbpxQP88Awsa43zCi', 'admin.janos@fitlife.hu', NULL, NULL, 'admin', NULL, NULL, NULL, NULL),
(204, 'Admin Anna', '$2b$10$krPgMJVf3uN.qfII6pJlHehtQ9lK5W9OeJiUp0lUaHd4nyoguo6F6', 'admin.anna@fitlife.hu', NULL, NULL, 'admin', NULL, NULL, NULL, NULL),
(205, 'Admin Milán', '$2b$10$SaGyx1ZnFFhXLCq0QXtlxeRplNMqp0oFm./q6EuQ2Co48uR6b5gEG', 'admin.milan@fitlife.hu', NULL, NULL, 'admin', NULL, NULL, NULL, NULL),
(206, 'Admin Bálint', '$2b$10$ayGcbvMeSaZa2w.V2zpnGePY.xNqOzSN32itMvueuZHgwriwhgbri', 'admin.balint@fitlife.hu', NULL, NULL, 'admin', NULL, NULL, NULL, NULL),
(207, 'Admin Gergely', '$2b$10$w8VGjHxXECKIQXQjmJkk4O2ArMg1JqGTnlfYz.k47fHK/IC/DDH02', 'admin.gergely@fitlife.hu', NULL, NULL, 'admin', NULL, NULL, NULL, NULL),
(208, 'Admin Béla', '$2b$10$5bFSgJGtJh4L7g96Q82qqOeL1s4MHm5679HL47pdE.LW6RvR52BQG', 'admin.bela@fitlife.hu', NULL, NULL, 'admin', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `recept`
--

CREATE TABLE `recept` (
  `recept_id` int(11) NOT NULL,
  `nev` varchar(150) NOT NULL,
  `leiras` text NOT NULL,
  `etkezes_tipus` varchar(100) NOT NULL,
  `zsir` float NOT NULL,
  `protein` float NOT NULL,
  `szenhidrat` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `recept`
--

INSERT INTO `recept` (`recept_id`, `nev`, `leiras`, `etkezes_tipus`, `zsir`, `protein`, `szenhidrat`) VALUES
(1, 'Csirkés rizstál', 'Hozzávalók: csirkemell 150 g, rizs (száraz) 70 g, brokkoli 120 g, só 2 g, bors 1 g. Elkészítés: a rizst főzd meg, a csirkemellet kockázva süsd meg serpenyőben, párold a brokkolit majd keverd össze.', 'ebed', 6, 36, 58),
(2, 'Zabkása mogyoróvajjal', 'Hozzávalók: zabpehely 60 g, tej 200 ml, mogyoróvaj 20 g, banán 100 g. Elkészítés: a zabot főzd krémesre, keverd bele a mogyoróvajat és a felszeletelt banánt.', 'reggeli', 15, 20, 73),
(3, 'Pulykamell saláta', 'Hozzávalók: pulykamell 150 g, salátakeverék 80 g, paradicsom 120 g, olívaolaj 10 g. Elkészítés: grillezd a pulykát, majd szeleteld és keverd a salátához.', 'vacsora', 12, 35, 8),
(4, 'Tojásos avokádó toast', 'Hozzávalók: teljes kiőrlésű kenyér 70 g, tojás 2 db (100 g), avokádó 80 g. Elkészítés: pirítsd meg a kenyeret, főzz tojást, az avokádót villával törd össze és kend a kenyérre.', 'reggeli', 21, 20, 35),
(5, 'Tonhalas rizs', 'Hozzávalók: tonhalkonzerv saját lében (lecsepegtetve) 120 g, főtt rizs 200 g, kukorica 60 g, citromlé 10 ml. Elkészítés: keverd össze az összetevőket egy tálban.', 'ebed', 3, 33, 64),
(6, 'Csirkés quinoa saláta', 'Hozzávalók: quinoa (száraz) 65 g, csirkemell 140 g, uborka 100 g, paradicsom 100 g. Elkészítés: főzd meg a quinoát, süsd meg a csirkét és keverd össze a zöldségekkel.', 'ebed', 7, 38, 45),
(7, 'Protein palacsinta', 'Hozzávalók: tojás 2 db (100 g), fehérjepor 30 g, zabpehely 40 g. Elkészítés: turmixold össze, majd süsd ki palacsintaként.', 'reggeli', 10, 36, 29),
(8, 'Lazac brokkolival', 'Hozzávalók: lazacfilé 150 g, brokkoli 180 g, citrom 20 g. Elkészítés: süsd meg a lazacot sütőben, párold a brokkolit.', 'vacsora', 20, 36, 13),
(9, 'Csirkés wrap', 'Hozzávalók: tortilla 65 g, csirkemell 130 g, saláta 50 g, joghurtos öntet 50 g. Elkészítés: süsd meg a csirkét, töltsd a tortillába a salátával együtt.', 'ebed', 9, 36, 43),
(10, 'Zöldséges omlett', 'Hozzávalók: tojás 3 db (150 g), spenót 60 g, hagyma 50 g. Elkészítés: a tojásokat felverve süsd meg a zöldségekkel együtt.', 'reggeli', 15, 22, 7),
(11, 'Csirkés bulgur', 'Hozzávalók: bulgur (száraz) 70 g, csirkemell 140 g, paprika 100 g. Elkészítés: főzd meg a bulgurt, a csirkét kockázva pirítsd meg és keverd össze.', 'ebed', 5, 38, 57),
(12, 'Pulyka burger', 'Hozzávalók: darált pulykahús 140 g, teljes kiőrlésű zsemle 75 g, saláta 40 g. Elkészítés: süsd meg a húspogácsát, majd rakd össze a burgert.', 'ebed', 14, 35, 40),
(13, 'Túrós zabkása', 'Hozzávalók: zabpehely 60 g, sovány túró 150 g, méz 15 g. Elkészítés: főzd meg a zabkását, majd keverd bele a túrót.', 'reggeli', 6, 32, 58),
(14, 'Csirkés karfiolrizs', 'Hozzávalók: csirkemell 160 g, karfiol 250 g, fűszerek 3 g, olívaolaj 5 g. Elkészítés: reszeld le a karfiolt rizs állagúra, pirítsd csirkével.', 'vacsora', 8, 40, 14),
(15, 'Makréla saláta', 'Hozzávalók: makréla 120 g, saláta 80 g, paradicsom 120 g. Elkészítés: a makrélát keverd a salátával.', 'vacsora', 17, 25, 7),
(16, 'Babos csirketál', 'Hozzávalók: csirkemell 140 g, vörösbab (főtt) 130 g, rizs (száraz) 60 g. Elkészítés: főzd meg a rizst, süsd a csirkét és keverd össze a babbal.', 'ebed', 5, 45, 73),
(17, 'Avokádós csirke saláta', 'Hozzávalók: csirkemell 150 g, avokádó 100 g, saláta 80 g. Elkészítés: grillezd a csirkét és keverd össze az avokádóval.', 'vacsora', 18, 37, 11),
(18, 'Tonhalas tészta', 'Hozzávalók: teljes kiőrlésű tészta (száraz) 80 g, tonhal saját lében (lecsepegtetve) 120 g, paradicsom 120 g. Elkészítés: főzd meg a tésztát és keverd össze tonhallal.', 'ebed', 5, 41, 61),
(19, 'Protein joghurt gyümölccsel', 'Hozzávalók: natúr joghurt 200 g, fehérjepor 25 g, bogyós gyümölcs 100 g. Elkészítés: keverd össze egy tálban.', 'csemege', 6, 32, 24),
(20, 'Csirkés zöldségleves', 'Hozzávalók: csirkemell 120 g, sárgarépa 100 g, zeller 60 g, alaplé 400 ml. Elkészítés: főzd össze alaplében.', 'vacsora', 3, 28, 14),
(21, 'Pulykás rizottó', 'Hozzávalók: rizs (száraz) 75 g, pulykamell 140 g, hagyma 60 g. Elkészítés: pirítsd meg a húst, add hozzá a rizst és főzd puhára.', 'ebed', 5, 37, 65),
(22, 'Tofu stir fry', 'Hozzávalók: tofu 180 g, brokkoli 150 g, szójaszósz 15 ml, olívaolaj 5 g. Elkészítés: pirítsd össze wokban.', 'ebed', 18, 25, 16),
(23, 'Zab muffin', 'Hozzávalók: zabpehely 50 g, tojás 1 db (50 g), banán 100 g. Elkészítés: keverd össze és süsd muffin formában.', 'csemege', 8, 13, 53),
(24, 'Grillezett csirke saláta', 'Hozzávalók: csirkemell 160 g, uborka 120 g, paradicsom 120 g, olívaolaj 5 g. Elkészítés: grillezd a csirkét és keverd a zöldségekkel.', 'vacsora', 8, 39, 8),
(25, 'Lazac quinoa bowl', 'Hozzávalók: lazac 140 g, quinoa (száraz) 55 g, spárga 120 g. Elkészítés: süsd meg a lazacot és tálald quinoával.', 'vacsora', 21, 39, 38),
(26, 'Csirkés kuszkusz', 'Hozzávalók: kuszkusz (száraz) 75 g, csirkemell 130 g, paprika 100 g. Elkészítés: főzd meg a kuszkuszt és keverd a csirkével.', 'ebed', 4, 36, 63),
(27, 'Tojásos rizs', 'Hozzávalók: rizs (száraz) 65 g, tojás 2 db (100 g), szójaszósz 15 ml. Elkészítés: pirítsd össze serpenyőben.', 'ebed', 12, 19, 53),
(28, 'Mandulás zabkása', 'Hozzávalók: zabpehely 60 g, mandula 20 g, méz 15 g, víz 200 ml. Elkészítés: főzd meg a zabot és szórd meg mandulával.', 'reggeli', 15, 15, 56),
(29, 'Csirkés brokkoli rizs', 'Hozzávalók: csirkemell 150 g, rizs (száraz) 70 g, brokkoli 150 g. Elkészítés: párold a brokkolit és keverd a csirkével.', 'ebed', 6, 38, 60),
(30, 'Protein zabgolyó', 'Hozzávalók: zabpehely 45 g, fehérjepor 25 g, mogyoróvaj 15 g. Elkészítés: keverd össze és formázz golyókat.', 'csemege', 12, 30, 34),
(31, 'Csirkés édesburgonya tál', 'Hozzávalók: csirkemell 150 g, édesburgonya 250 g, olívaolaj 8 g, só 2 g, bors 1 g. Elkészítés: az édesburgonyát kockázd fel és süsd meg sütőben, a csirkemellet serpenyőben süsd aranybarnára, majd tálald együtt.', 'ebed', 11, 38, 52),
(32, 'Protein zabturmix', 'Hozzávalók: zabpehely 50 g, fehérjepor 30 g, tej 250 ml, banán 100 g. Elkészítés: turmixold össze az összes hozzávalót krémes állagúra.', 'reggeli', 8, 39, 69),
(33, 'Pulykás saláta', 'Hozzávalók: pulykamell 160 g, saláta 80 g, paradicsom 100 g, uborka 100 g. Elkészítés: grillezd a pulykamellet, majd szeleteld fel és keverd a salátával.', 'vacsora', 3, 37, 8),
(34, 'Tojásos zabpalacsinta', 'Hozzávalók: zabpehely 55 g, tojás 2 db (100 g), tej 150 ml. Elkészítés: turmixold össze, majd serpenyőben süsd ki palacsinta formában.', 'reggeli', 16, 23, 45),
(35, 'Tonhalas kuszkusz', 'Hozzávalók: tonhal saját lében (lecsepegtetve) 120 g, kuszkusz (száraz) 70 g, citromlé 10 ml, paradicsom 100 g. Elkészítés: készítsd el a kuszkuszt, majd keverd össze tonhallal.', 'ebed', 3, 37, 57),
(36, 'Grillezett csirke cukkínivel', 'Hozzávalók: csirkemell 160 g, cukkini 200 g, fokhagyma 5 g, olívaolaj 5 g. Elkészítés: süsd meg a csirkét grillen, a cukkinit serpenyőben pirítsd.', 'vacsora', 8, 40, 10),
(37, 'Protein túrókrém', 'Hozzávalók: sovány túró 200 g, fehérjepor 20 g, méz 15 g. Elkészítés: keverd össze egy tálban krémesre.', 'csemege', 3, 42, 21),
(38, 'Marhahúsos rizstál', 'Hozzávalók: sovány darált marhahús 150 g, rizs (száraz) 70 g, paprika 100 g. Elkészítés: pirítsd meg a húst, főzd meg a rizst és keverd össze.', 'ebed', 16, 38, 61),
(39, 'Csirkés brokkoli quinoa', 'Hozzávalók: csirkemell 145 g, quinoa (száraz) 60 g, brokkoli 150 g. Elkészítés: főzd meg a quinoát, párold a brokkolit, majd keverd össze a csirkével.', 'ebed', 7, 40, 45),
(40, 'Zöldséges tofu tál', 'Hozzávalók: tofu 200 g, paprika 100 g, brokkoli 120 g, szójaszósz 15 ml. Elkészítés: pirítsd össze wokban.', 'ebed', 17, 28, 18),
(41, 'Protein chia puding', 'Hozzávalók: chia mag 25 g, tej 200 ml, fehérjepor 25 g. Elkészítés: keverd össze és hagyd állni hűtőben.', 'reggeli', 14, 33, 20),
(42, 'Pulykás wrap', 'Hozzávalók: tortilla 65 g, pulykamell 130 g, saláta 50 g. Elkészítés: grillezd a húst, majd töltsd tortillába.', 'ebed', 7, 34, 41),
(43, 'Tojásos spenótos omlett', 'Hozzávalók: tojás 3 db (150 g), spenót 80 g, hagyma 40 g. Elkészítés: a tojásokat felverve süsd meg a zöldségekkel.', 'reggeli', 15, 23, 7),
(44, 'Csirkés bulgur saláta', 'Hozzávalók: bulgur (száraz) 65 g, csirkemell 140 g, paradicsom 120 g. Elkészítés: főzd meg a bulgurt, keverd össze csirkével és zöldségekkel.', 'ebed', 5, 38, 54),
(45, 'Lazacos avokádó saláta', 'Hozzávalók: lazac 130 g, avokádó 90 g, saláta 80 g. Elkészítés: süsd meg a lazacot és keverd össze az avokádóval.', 'vacsora', 29, 31, 9),
(46, 'Babos csirke chili', 'Hozzávalók: csirkemell 140 g, bab (főtt) 150 g, paradicsomszósz 120 g, chili 3 g. Elkészítés: főzd össze az összetevőket egy lábasban.', 'ebed', 5, 43, 41),
(47, 'Zabos protein muffin', 'Hozzávalók: zabpehely 45 g, tojás 1 db (50 g), fehérjepor 25 g. Elkészítés: keverd össze és süsd muffin formában.', 'csemege', 8, 31, 33),
(48, 'Grillezett tonhal steak', 'Hozzávalók: tonhal steak 160 g, citrom 20 g, olívaolaj 8 g. Elkészítés: süsd meg grillen oldalanként pár percig.', 'vacsora', 10, 38, 2),
(49, 'Pulykás rizs tál', 'Hozzávalók: pulykamell 150 g, rizs (száraz) 70 g, paprika 100 g. Elkészítés: süsd meg a húst, majd keverd össze a főtt rizzsel.', 'ebed', 5, 39, 61),
(50, 'Mandulás zabkása', 'Hozzávalók: zabpehely 55 g, mandula 25 g, méz 10 g, tej 150 ml. Elkészítés: főzd meg a zabot és szórd meg mandulával.', 'reggeli', 20, 20, 53),
(51, 'Csirkés karfiol stir fry', 'Hozzávalók: csirkemell 155 g, karfiol 250 g, szójaszósz 15 ml, olívaolaj 5 g. Elkészítés: pirítsd össze wokban.', 'vacsora', 8, 39, 14),
(52, 'Tojásos rizs zöldségekkel', 'Hozzávalók: rizs (száraz) 60 g, tojás 2 db (100 g), brokkoli 100 g, répa 70 g. Elkészítés: pirítsd össze serpenyőben.', 'ebed', 12, 22, 57),
(53, 'Protein smoothie bogyós gyümölccsel', 'Hozzávalók: fehérjepor 30 g, tej 250 ml, bogyós gyümölcs 120 g. Elkészítés: turmixold össze.', 'csemege', 6, 36, 28),
(54, 'Csirkés lencsesaláta', 'Hozzávalók: csirkemell 140 g, főtt lencse 150 g, paradicsom 120 g. Elkészítés: keverd össze egy tálban.', 'ebed', 5, 44, 35),
(55, 'Makréla quinoa tál', 'Hozzávalók: makréla 120 g, quinoa (száraz) 60 g, uborka 100 g. Elkészítés: főzd meg a quinoát, majd keverd a makrélával.', 'vacsora', 19, 32, 41),
(56, 'Protein zabkása', 'Hozzávalók: zabpehely 60 g, fehérjepor 30 g, tej 200 ml. Elkészítés: főzd össze krémes állagúra.', 'reggeli', 9, 39, 49),
(57, 'Pulyka burger salátával', 'Hozzávalók: pulykahús pogácsa 160 g, saláta 80 g, paradicsom 120 g. Elkészítés: süsd meg a pogácsát és tálald salátával.', 'ebed', 14, 35, 8),
(58, 'Csirkés zöldbab', 'Hozzávalók: csirkemell 160 g, zöldbab 200 g, fokhagyma 5 g, olívaolaj 5 g. Elkészítés: pirítsd össze serpenyőben.', 'vacsora', 8, 41, 15),
(59, 'Tonhalas rizssaláta', 'Hozzávalók: tonhal saját lében (lecsepegtetve) 120 g, rizs (száraz) 65 g, kukorica 60 g. Elkészítés: keverd össze hidegen.', 'ebed', 3, 36, 64),
(60, 'Avokádós tojás saláta', 'Hozzávalók: tojás 2 db (100 g), avokádó 100 g, saláta 80 g. Elkészítés: főzd meg a tojást, majd keverd az avokádóval.', 'reggeli', 25, 15, 12),
(61, 'Csirkés rizs brokkolival', 'Hozzávalók: csirkemell 155 g, rizs (száraz) 75 g, brokkoli 130 g, só 2 g, bors 1 g. Elkészítés: a rizst főzd meg, a csirkét serpenyőben süsd meg, a brokkolit párold, majd keverd össze.', 'ebed', 6, 39, 64),
(62, 'Zabkása almával', 'Hozzávalók: zabpehely 60 g, tej 200 ml, alma 150 g, fahéj 2 g. Elkészítés: a zabot főzd krémesre, add hozzá a reszelt almát és a fahéjat.', 'reggeli', 8, 17, 72),
(63, 'Pulykás quinoa tál', 'Hozzávalók: pulykamell 145 g, quinoa (száraz) 65 g, paprika 100 g. Elkészítés: főzd meg a quinoát, a pulykát pirítsd meg, majd tálald együtt.', 'ebed', 6, 40, 47),
(64, 'Tojásos avokádó saláta', 'Hozzávalók: tojás 2 db (100 g), avokádó 90 g, saláta 100 g. Elkészítés: főzd meg a tojást, szeleteld fel, majd keverd össze az avokádóval és salátával.', 'reggeli', 24, 15, 11),
(65, 'Tonhalas salátatál', 'Hozzávalók: tonhal saját lében (lecsepegtetve) 140 g, salátakeverék 100 g, paradicsom 120 g, citromlé 10 ml. Elkészítés: keverd össze egy tálban és locsold meg citromlével.', 'vacsora', 3, 35, 8),
(66, 'Protein zabturmix', 'Hozzávalók: zabpehely 45 g, fehérjepor 30 g, tej 200 ml, banán 120 g. Elkészítés: turmixold össze krémes állagúra.', 'reggeli', 7, 37, 65),
(67, 'Csirkés bulgur', 'Hozzávalók: bulgur (száraz) 75 g, csirkemell 150 g, paprika 80 g. Elkészítés: főzd meg a bulgurt, süsd meg a csirkét és keverd össze.', 'ebed', 5, 41, 61),
(68, 'Lazac spárgával', 'Hozzávalók: lazacfilé 150 g, spárga 180 g, citrom 20 g. Elkészítés: a lazacot süsd meg sütőben, a spárgát párold.', 'vacsora', 20, 35, 8),
(69, 'Zabpalacsinta banánnal', 'Hozzávalók: zabpehely 50 g, tojás 2 db (100 g), banán 100 g. Elkészítés: turmixold össze és süsd palacsintának.', 'reggeli', 13, 20, 55),
(70, 'Pulykás saláta', 'Hozzávalók: pulykamell 150 g, saláta 90 g, uborka 120 g, paradicsom 120 g. Elkészítés: grillezd a pulykát és keverd a zöldségekhez.', 'vacsora', 3, 35, 9),
(71, 'Csirkés karfiolrizs', 'Hozzávalók: csirkemell 150 g, karfiol 260 g, fokhagyma 5 g, olívaolaj 5 g. Elkészítés: reszeld a karfiolt rizs állagúra, majd pirítsd össze csirkével.', 'vacsora', 8, 39, 15),
(72, 'Protein joghurt', 'Hozzávalók: natúr joghurt 200 g, fehérjepor 25 g, méz 15 g. Elkészítés: keverd össze egy tálban.', 'csemege', 6, 31, 25),
(73, 'Csirkés tészta', 'Hozzávalók: teljes kiőrlésű tészta (száraz) 80 g, csirkemell 130 g, paradicsomszósz 120 g. Elkészítés: főzd meg a tésztát, majd keverd össze csirkével és szósszal.', 'ebed', 6, 41, 68),
(74, 'Babos pulykatál', 'Hozzávalók: pulykamell 140 g, vörösbab (főtt) 130 g, rizs (száraz) 55 g. Elkészítés: főzd meg a rizst, a pulykát süsd meg és keverd a babbal.', 'ebed', 5, 43, 68),
(75, 'Zöldséges tofu wok', 'Hozzávalók: tofu 180 g, brokkoli 150 g, paprika 100 g, szójaszósz 15 ml. Elkészítés: pirítsd össze wokban.', 'ebed', 15, 26, 19),
(76, 'Mandulás zabkása', 'Hozzávalók: zabpehely 65 g, mandula 18 g, méz 12 g, víz 200 ml. Elkészítés: főzd meg a zabot és szórd meg mandulával.', 'reggeli', 14, 16, 60),
(77, 'Makréla saláta', 'Hozzávalók: makréla 110 g, saláta 90 g, paradicsom 120 g. Elkészítés: keverd össze hidegen.', 'vacsora', 16, 24, 7),
(78, 'Csirkés quinoa', 'Hozzávalók: quinoa (száraz) 70 g, csirkemell 140 g, uborka 120 g. Elkészítés: főzd meg a quinoát, majd keverd össze a csirkével.', 'ebed', 7, 38, 48),
(79, 'Protein muffin', 'Hozzávalók: zabpehely 40 g, tojás 1 db (50 g), fehérjepor 30 g. Elkészítés: keverd össze és süsd muffin formában.', 'csemege', 8, 34, 30),
(80, 'Tonhalas rizs', 'Hozzávalók: tonhal saját lében (lecsepegtetve) 130 g, rizs (száraz) 70 g, citromlé 10 ml. Elkészítés: keverd össze egy tálban.', 'ebed', 3, 37, 56),
(81, 'Tojásos omlett spenóttal', 'Hozzávalók: tojás 3 db (150 g), spenót 70 g, hagyma 50 g. Elkészítés: a tojást felverve süsd meg a zöldségekkel.', 'reggeli', 15, 23, 7),
(82, 'Csirkés zöldbab', 'Hozzávalók: csirkemell 150 g, zöldbab 220 g, fokhagyma 5 g, olívaolaj 6 g. Elkészítés: pirítsd össze serpenyőben.', 'vacsora', 9, 39, 16),
(83, 'Pulykás rizottó', 'Hozzávalók: rizs (száraz) 70 g, pulykamell 150 g, hagyma 70 g. Elkészítés: pirítsd meg a húst, add hozzá a rizst és főzd puhára.', 'ebed', 5, 40, 62),
(84, 'Protein turmix', 'Hozzávalók: fehérjepor 30 g, tej 250 ml, banán 120 g. Elkészítés: turmixold össze.', 'csemege', 6, 36, 43),
(85, 'Lazacos quinoa bowl', 'Hozzávalók: lazac 130 g, quinoa (száraz) 60 g, uborka 100 g. Elkészítés: süsd meg a lazacot és tálald quinoával.', 'vacsora', 20, 37, 41),
(86, 'Zabos energiaszelet', 'Hozzávalók: zabpehely 45 g, mogyoróvaj 20 g, méz 15 g. Elkészítés: keverd össze és préseld formába.', 'csemege', 14, 12, 44),
(87, 'Csirkés tortilla', 'Hozzávalók: tortilla 60 g, csirkemell 130 g, saláta 60 g. Elkészítés: süsd meg a csirkét és töltsd tortillába.', 'ebed', 7, 35, 38),
(88, 'Avokádós csirke saláta', 'Hozzávalók: csirkemell 140 g, avokádó 120 g, saláta 80 g. Elkészítés: grillezd a csirkét és keverd össze az avokádóval.', 'vacsora', 21, 35, 12),
(89, 'Babos csirke chili', 'Hozzávalók: csirkemell 150 g, bab (főtt) 130 g, paradicsomszósz 150 g, chili 3 g. Elkészítés: főzd össze egy lábasban.', 'ebed', 5, 45, 40),
(90, 'Protein zabkása', 'Hozzávalók: zabpehely 55 g, fehérjepor 30 g, tej 250 ml. Elkészítés: főzd össze krémesre.', 'reggeli', 10, 41, 48),
(91, 'Csirkés kuszkusz', 'Hozzávalók: kuszkusz (száraz) 70 g, csirkemell 150 g, paprika 100 g. Elkészítés: készítsd el a kuszkuszt és keverd csirkével.', 'ebed', 5, 41, 60),
(92, 'Tojásos rizs', 'Hozzávalók: rizs (száraz) 70 g, tojás 2 db (100 g), szójaszósz 15 ml. Elkészítés: pirítsd össze serpenyőben.', 'ebed', 12, 20, 57),
(93, 'Pulyka burger', 'Hozzávalók: pulykahús pogácsa 150 g, teljes kiőrlésű zsemle 65 g. Elkészítés: süsd meg a pogácsát és tálald zsemlében.', 'ebed', 13, 35, 34),
(94, 'Sardínia saláta', 'Hozzávalók: szardínia 120 g, saláta 90 g, paradicsom 120 g. Elkészítés: keverd össze egy tálban.', 'vacsora', 14, 30, 7),
(95, 'Zöld smoothie', 'Hozzávalók: spenót 60 g, banán 120 g, víz 250 ml. Elkészítés: turmixold össze.', 'csemege', 1, 4, 31),
(96, 'Csirkés brokkoli rizs', 'Hozzávalók: csirkemell 145 g, rizs (száraz) 75 g, brokkoli 160 g. Elkészítés: párold a brokkolit és keverd csirkével és rizzsel.', 'ebed', 6, 38, 65),
(97, 'Tofu saláta', 'Hozzávalók: tofu 180 g, saláta 90 g, uborka 120 g. Elkészítés: keverd össze hidegen.', 'vacsora', 14, 25, 9),
(98, 'Makréla quinoa', 'Hozzávalók: makréla 120 g, quinoa (száraz) 60 g. Elkészítés: főzd meg a quinoát és keverd össze makrélával.', 'vacsora', 19, 32, 40),
(99, 'Mandulás joghurt', 'Hozzávalók: natúr joghurt 200 g, mandula 20 g, méz 10 g. Elkészítés: keverd össze.', 'csemege', 16, 16, 23),
(100, 'Zabpalacsinta áfonyával', 'Hozzávalók: zabpehely 55 g, tojás 2 db (100 g), áfonya 100 g. Elkészítés: turmixold össze és süsd ki.', 'reggeli', 13, 20, 51);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `allergen`
--
ALTER TABLE `allergen`
  ADD PRIMARY KEY (`allergen_id`);

--
-- A tábla indexei `allergias_ra`
--
ALTER TABLE `allergias_ra`
  ADD PRIMARY KEY (`felhasznalo_id`,`allergen_id`),
  ADD KEY `allergen_id` (`allergen_id`);

--
-- A tábla indexei `allergiat_okoz`
--
ALTER TABLE `allergiat_okoz`
  ADD PRIMARY KEY (`recept_id`,`allergen_id`),
  ADD KEY `allergen_id` (`allergen_id`);

--
-- A tábla indexei `cel_alak`
--
ALTER TABLE `cel_alak`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `edzesen_kivuli_mozgas`
--
ALTER TABLE `edzesen_kivuli_mozgas`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `edzesterv`
--
ALTER TABLE `edzesterv`
  ADD PRIMARY KEY (`edzesterv_id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `gyakorlat_id` (`gyakorlat_id`);

--
-- A tábla indexei `edzo`
--
ALTER TABLE `edzo`
  ADD PRIMARY KEY (`edzo_id`);

--
-- A tábla indexei `etrend`
--
ALTER TABLE `etrend`
  ADD PRIMARY KEY (`etrend_id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `recept_id` (`recept_id`);

--
-- A tábla indexei `felhasznalo`
--
ALTER TABLE `felhasznalo`
  ADD PRIMARY KEY (`felhasznalo_id`),
  ADD KEY `cel_alak_id` (`cel_alak_id`),
  ADD KEY `EKM_id` (`EKM_id`);

--
-- A tábla indexei `felhasznalo_edzesi_napok`
--
ALTER TABLE `felhasznalo_edzesi_napok`
  ADD PRIMARY KEY (`felhasznalo_id`,`nap_sorszam`);

--
-- A tábla indexei `foglalas`
--
ALTER TABLE `foglalas`
  ADD PRIMARY KEY (`foglalas_id`),
  ADD UNIQUE KEY `unique_foglalas_slot` (`edzo_id`,`datum`,`ido`,`aktiv_flag`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`);

--
-- A tábla indexei `gyakorlat`
--
ALTER TABLE `gyakorlat`
  ADD PRIMARY KEY (`gyakorlat_id`);

--
-- A tábla indexei `gyakorlat_izomcsoport`
--
ALTER TABLE `gyakorlat_izomcsoport`
  ADD PRIMARY KEY (`gyakorlat_id`,`izom_id`),
  ADD KEY `izom_id` (`izom_id`);

--
-- A tábla indexei `heti_beosztas`
--
ALTER TABLE `heti_beosztas`
  ADD PRIMARY KEY (`beo_id`),
  ADD KEY `edzo_id` (`edzo_id`);

--
-- A tábla indexei `izomcsoport`
--
ALTER TABLE `izomcsoport`
  ADD PRIMARY KEY (`izom_id`),
  ADD UNIQUE KEY `nev` (`nev`);

--
-- A tábla indexei `komment`
--
ALTER TABLE `komment`
  ADD PRIMARY KEY (`komment_id`),
  ADD KEY `edzo_id` (`edzo_id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`);

--
-- A tábla indexei `kulonleges_alkalom`
--
ALTER TABLE `kulonleges_alkalom`
  ADD PRIMARY KEY (`ka_id`),
  ADD UNIQUE KEY `unique_ka_slot` (`edzo_id`,`datum`,`ido`,`aktiv_flag`);

--
-- A tábla indexei `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `felh_nev` (`felh_nev`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A tábla indexei `recept`
--
ALTER TABLE `recept`
  ADD PRIMARY KEY (`recept_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `allergen`
--
ALTER TABLE `allergen`
  MODIFY `allergen_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT a táblához `cel_alak`
--
ALTER TABLE `cel_alak`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `edzesen_kivuli_mozgas`
--
ALTER TABLE `edzesen_kivuli_mozgas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `edzesterv`
--
ALTER TABLE `edzesterv`
  MODIFY `edzesterv_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `etrend`
--
ALTER TABLE `etrend`
  MODIFY `etrend_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `foglalas`
--
ALTER TABLE `foglalas`
  MODIFY `foglalas_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT a táblához `gyakorlat`
--
ALTER TABLE `gyakorlat`
  MODIFY `gyakorlat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT a táblához `heti_beosztas`
--
ALTER TABLE `heti_beosztas`
  MODIFY `beo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT a táblához `izomcsoport`
--
ALTER TABLE `izomcsoport`
  MODIFY `izom_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `komment`
--
ALTER TABLE `komment`
  MODIFY `komment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT a táblához `kulonleges_alkalom`
--
ALTER TABLE `kulonleges_alkalom`
  MODIFY `ka_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT a táblához `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

--
-- AUTO_INCREMENT a táblához `recept`
--
ALTER TABLE `recept`
  MODIFY `recept_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `allergias_ra`
--
ALTER TABLE `allergias_ra`
  ADD CONSTRAINT `allergias_ra_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`),
  ADD CONSTRAINT `allergias_ra_ibfk_2` FOREIGN KEY (`allergen_id`) REFERENCES `allergen` (`allergen_id`);

--
-- Megkötések a táblához `allergiat_okoz`
--
ALTER TABLE `allergiat_okoz`
  ADD CONSTRAINT `allergiat_okoz_ibfk_1` FOREIGN KEY (`recept_id`) REFERENCES `recept` (`recept_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `allergiat_okoz_ibfk_2` FOREIGN KEY (`allergen_id`) REFERENCES `allergen` (`allergen_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `edzesterv`
--
ALTER TABLE `edzesterv`
  ADD CONSTRAINT `edzesterv_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`),
  ADD CONSTRAINT `edzesterv_ibfk_2` FOREIGN KEY (`gyakorlat_id`) REFERENCES `gyakorlat` (`gyakorlat_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `edzo`
--
ALTER TABLE `edzo`
  ADD CONSTRAINT `edzo_ibfk_1` FOREIGN KEY (`edzo_id`) REFERENCES `login` (`id`);

--
-- Megkötések a táblához `etrend`
--
ALTER TABLE `etrend`
  ADD CONSTRAINT `etrend_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`),
  ADD CONSTRAINT `etrend_ibfk_2` FOREIGN KEY (`recept_id`) REFERENCES `recept` (`recept_id`);

--
-- Megkötések a táblához `felhasznalo`
--
ALTER TABLE `felhasznalo`
  ADD CONSTRAINT `felhasznalo_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `login` (`id`),
  ADD CONSTRAINT `felhasznalo_ibfk_2` FOREIGN KEY (`cel_alak_id`) REFERENCES `cel_alak` (`id`),
  ADD CONSTRAINT `felhasznalo_ibfk_3` FOREIGN KEY (`EKM_id`) REFERENCES `edzesen_kivuli_mozgas` (`id`);

--
-- Megkötések a táblához `felhasznalo_edzesi_napok`
--
ALTER TABLE `felhasznalo_edzesi_napok`
  ADD CONSTRAINT `felhasznalo_edzesi_napok_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`);

--
-- Megkötések a táblához `foglalas`
--
ALTER TABLE `foglalas`
  ADD CONSTRAINT `foglalas_ibfk_1` FOREIGN KEY (`edzo_id`) REFERENCES `edzo` (`edzo_id`),
  ADD CONSTRAINT `foglalas_ibfk_2` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`);

--
-- Megkötések a táblához `gyakorlat_izomcsoport`
--
ALTER TABLE `gyakorlat_izomcsoport`
  ADD CONSTRAINT `gyakorlat_izomcsoport_ibfk_1` FOREIGN KEY (`gyakorlat_id`) REFERENCES `gyakorlat` (`gyakorlat_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `gyakorlat_izomcsoport_ibfk_2` FOREIGN KEY (`izom_id`) REFERENCES `izomcsoport` (`izom_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `heti_beosztas`
--
ALTER TABLE `heti_beosztas`
  ADD CONSTRAINT `heti_beosztas_ibfk_1` FOREIGN KEY (`edzo_id`) REFERENCES `edzo` (`edzo_id`);

--
-- Megkötések a táblához `komment`
--
ALTER TABLE `komment`
  ADD CONSTRAINT `komment_ibfk_1` FOREIGN KEY (`edzo_id`) REFERENCES `edzo` (`edzo_id`),
  ADD CONSTRAINT `komment_ibfk_2` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`);

--
-- Megkötések a táblához `kulonleges_alkalom`
--
ALTER TABLE `kulonleges_alkalom`
  ADD CONSTRAINT `kulonleges_alkalom_ibfk_1` FOREIGN KEY (`edzo_id`) REFERENCES `edzo` (`edzo_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
