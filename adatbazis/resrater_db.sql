-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Ápr 16. 21:30
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `resrater_db`
--
CREATE DATABASE IF NOT EXISTS `resrater_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `resrater_db`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ertekelesek`
--

DROP TABLE IF EXISTS `ertekelesek`;
CREATE TABLE `ertekelesek` (
  `ertekeles_id` int(11) NOT NULL,
  `etterem_id` int(11) NOT NULL,
  `felhasznalo_id` int(11) DEFAULT NULL,
  `atlag` decimal(4,2) DEFAULT NULL,
  `datum` datetime NOT NULL,
  `etelminoseg` int(5) NOT NULL,
  `kiszolgalas` int(5) NOT NULL,
  `hangulat` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `ertekelesek`
--

INSERT INTO `ertekelesek` (`ertekeles_id`, `etterem_id`, `felhasznalo_id`, `atlag`, `datum`, `etelminoseg`, `kiszolgalas`, `hangulat`) VALUES
(1, 1, 35, 3.33, '2025-11-01 12:00:00', 5, 3, 2),
(2, 2, 32, 2.33, '2025-11-02 13:00:00', 4, 2, 1),
(3, 3, 27, 3.00, '2025-11-03 14:00:00', 1, 5, 3),
(4, 4, 34, 3.67, '2025-11-04 15:00:00', 4, 2, 5),
(5, 5, 36, 4.00, '2025-11-05 16:00:00', 4, 5, 3),
(6, 6, 27, 3.00, '2025-11-06 17:00:00', 1, 3, 5),
(7, 7, 31, 4.00, '2025-11-07 18:00:00', 5, 4, 3),
(8, 8, 30, 3.33, '2025-11-08 19:00:00', 2, 4, 4),
(9, 9, 28, 4.33, '2025-11-09 20:00:00', 3, 5, 5),
(10, 10, 28, 4.67, '2025-11-10 21:00:00', 5, 4, 5),
(11, 4, 34, 4.00, '2026-03-05 11:15:58', 5, 2, 5),
(12, 1, 32, 4.00, '2026-03-05 11:58:30', 5, 4, 3),
(13, 1, 30, 4.00, '2026-03-05 11:59:22', 5, 4, 3),
(14, 1, 16, 4.00, '2026-03-05 12:02:49', 5, 4, 4),
(15, 8, 28, 4.33, '2026-03-05 12:04:09', 5, 4, 4),
(16, 7, 16, 4.00, '2026-03-05 12:05:42', 5, 4, 4),
(17, 8, 27, 4.33, '2026-03-05 12:08:22', 5, 4, 4),
(18, 7, 32, 4.33, '2026-03-05 12:10:44', 5, 4, 4),
(19, 1, 18, 3.33, '2026-03-05 12:11:44', 2, 4, 4);

--
-- Eseményindítók `ertekelesek`
--
DROP TRIGGER IF EXISTS `trig_atlagszamitas`;
DELIMITER $$
CREATE TRIGGER `trig_atlagszamitas` BEFORE UPDATE ON `ertekelesek` FOR EACH ROW BEGIN
    SET NEW.atlag = ROUND(
        (NEW.etelminoseg + NEW.kiszolgalas + NEW.hangulat) / 3,2
    );
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `trig_ertekeles_atlag_insert`;
DELIMITER $$
CREATE TRIGGER `trig_ertekeles_atlag_insert` BEFORE INSERT ON `ertekelesek` FOR EACH ROW BEGIN
    SET NEW.atlag = ROUND(
        (NEW.etelminoseg + NEW.kiszolgalas + NEW.hangulat) / 3,
        2
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ettermek`
--

DROP TABLE IF EXISTS `ettermek`;
CREATE TABLE `ettermek` (
  `etterem_id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `telefon` varchar(20) NOT NULL,
  `leiras` text NOT NULL,
  `kategoria_id` int(5) NOT NULL,
  `iranyitoszam` int(4) NOT NULL,
  `utca` varchar(100) NOT NULL,
  `hazszam` varchar(10) NOT NULL,
  `jovahagyott` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `ettermek`
--

INSERT INTO `ettermek` (`etterem_id`, `nev`, `telefon`, `leiras`, `kategoria_id`, `iranyitoszam`, `utca`, `hazszam`, `jovahagyott`) VALUES
(1, 'BurgerPart', '+365148769', 'Kézműves burgerek, ropogós krumpli és jó hangulat – ez a BurgerPart receptje. Tökéletes hely egy gyors falatra a barátokkal vagy egy laza ebédszünetre.', 3, 1117, 'Fehérvári út', '47', 1),
(2, 'Legjobb csárda', '+3642069', 'A Legjobb Csárda a hagyományos magyar vendégszeretet otthona, ahol az igazi falusi ízek és a jókedv kéz a kézben járnak. Frissen készült, házias ételeink – a gőzölgő gulyástól a ropogós rántott húsig – a nagymama konyhájának hangulatát idézik. A barátságos kiszolgálás, a rusztikus berendezés és a vidám zene gondoskodik róla, hogy minden vendég úgy érezze: itt tényleg otthon van.', 1, 6720, 'Fő utca', '12', 1),
(3, 'Deák Ferenc Falatozó', '+3655877', 'A Deák Ferenc Falatozó egy hangulatos, családias étterem, ahol a hagyományos magyar ízek találkoznak a modern konyha könnyedségével. Éttermünk szívében a vendég a legfontosabb: friss, helyi alapanyagokból készült ételeinket barátságos kiszolgálással és otthonos környezetben kínáljuk. Legyen szó egy gyors ebédről, baráti vacsoráról vagy hétvégi lakomáról, nálunk mindig jóllakottan és mosollyal az arcán távozik minden vendég.', 2, 9022, 'Baross Gábor út', '18', 1),
(4, 'Kacsa a Ködben', '+36598742', 'A Kacsa a Ködben egy hangulatos, kissé titokzatos étterem, ahol a gasztronómia és a művészet találkozik. Rejtett utcában, lágy fények és kellemes zene kíséretében várjuk vendégeinket, hogy felfedezzék a magyar és nemzetközi konyha különleges fúzióját. Éttermünk védjegye a kreatív kacsás fogások sora – a klasszikus sült kacsától a modern, gyümölcsös variációkig.', 4, 6720, 'Széchenyi tér', '5', 1),
(5, 'Lángoszóna', '+36548798', 'A Lángoszóna a magyar street food lelke. Klasszikus és felturbózott lángosok, fokhagymás illat és friss tejföl – hagyomány, ami belefér a kezedbe.', 5, 1117, 'Bartók Béla út', '93', 1),
(6, 'Piros Paprika Vendéglő', '+36985678', 'A Piros Paprika Vendéglő a magyar ízek színes otthona, ahol minden falatban ott van a tradíció és a szenvedély. Friss, hazai alapanyagokból készült ételeinket gazdagon fűszerezzük – természetesen jó adag szeretettel és egy csipetnyi paprikával. Barátságos hangulat, házias ízek és bőséges adagok várják mindazokat, akik szeretik a klasszikus magyar konyhát.', 6, 9022, 'Király utca', '21', 1),
(7, 'Aranykanál Bisztró', '+3696554432', 'Az Aranykanál Bisztró elegáns, mégis otthonos hely, ahol a modern magyar konyha kifinomult ízei várják a vendégeket.', 2, 6720, 'Szent István út', '30', 1),
(8, 'Bors & Lélek', '+3662314875', 'A Bors & Lélek modern hangulatú étterem, ahol a bor és a fűszer találkozik – magyaros ételek újragondolva.', 3, 1117, 'Petőfi Sándor utca', '8', 1),
(9, 'Hot & Go', '+3652478215', 'A Hot & Go fűszeres gyorsételeket kínál lendületes, fiatalos környezetben – tökéletes útközben is.', 6, 6720, 'Rákóczi út', '54', 1),
(10, 'ZabálÓra', '+3672611998', 'A ZabálÓra a rohanó vendégek kedvence: friss, bőséges és gyors ételek barátságos hangulatban.', 2, 1117, 'Váci út', '112', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

DROP TABLE IF EXISTS `felhasznalok`;
CREATE TABLE `felhasznalok` (
  `felhasznalo_id` int(10) NOT NULL,
  `felhasznev` varchar(25) NOT NULL,
  `jelszo` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `reg_datum` date NOT NULL DEFAULT current_timestamp(),
  `szerep` enum('felhasznalo','admin') NOT NULL DEFAULT 'felhasznalo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalok`
--

INSERT INTO `felhasznalok` (`felhasznalo_id`, `felhasznev`, `jelszo`, `email`, `reg_datum`, `szerep`) VALUES
(16, 'Petyaa', '$2b$10$wa16UpW8GpWtAxGdda/vLeG/5JVM/Z8RZNfY.T/uzCtnJN53fIEVK', 'palpet478@hengersor.', '2026-02-24', 'admin'),
(18, 'tamas', '$2b$10$FANkhssMlN4L.m66nnR7xO16G3PwOjuZxNrzJp6RIbJfF5xiiJPxK', 'valami@example.com', '2026-02-26', 'admin'),
(27, 'KissBalint', '$2b$10$DM8e3IvR09g42PhcN.UAMOBsGaLnq6MW0beKVjMp1MsgtoQI.FXCa', 'kiss.balint@gmail.com', '2026-04-16', 'felhasznalo'),
(28, 'NagyEszter', '$2b$10$DM8e3IvR09g42PhcN.UAMOBsGaLnq6MW0beKVjMp1MsgtoQI.FXCa', 'nagy.eszter@gmail.com', '2026-04-16', 'felhasznalo'),
(29, 'TothAdam', '$2b$10$DM8e3IvR09g42PhcN.UAMOBsGaLnq6MW0beKVjMp1MsgtoQI.FXCa', 'toth.adam@gmail.com', '2026-04-16', 'felhasznalo'),
(30, 'VargaLili', '$2b$10$DM8e3IvR09g42PhcN.UAMOBsGaLnq6MW0beKVjMp1MsgtoQI.FXCa', 'varga.lili@gmail.com', '2026-04-16', 'felhasznalo'),
(31, 'SzaboDaniel', '$2b$10$DM8e3IvR09g42PhcN.UAMOBsGaLnq6MW0beKVjMp1MsgtoQI.FXCa', 'szabo.daniel@gmail.com', '2026-04-16', 'felhasznalo'),
(32, 'FeketeMark', '$2b$10$DM8e3IvR09g42PhcN.UAMOBsGaLnq6MW0beKVjMp1MsgtoQI.FXCa', 'fekete.mark@gmail.com', '2026-04-16', 'felhasznalo'),
(33, 'KovacsNoemi', '$2b$10$DM8e3IvR09g42PhcN.UAMOBsGaLnq6MW0beKVjMp1MsgtoQI.FXCa', 'kovacs.noemi@gmail.com', '2026-04-16', 'felhasznalo'),
(34, 'HorvathPeter', '$2b$10$DM8e3IvR09g42PhcN.UAMOBsGaLnq6MW0beKVjMp1MsgtoQI.FXCa', 'horvath.peter@gmail.com', '2026-04-16', 'felhasznalo'),
(35, 'BaloghAnna', '$2b$10$DM8e3IvR09g42PhcN.UAMOBsGaLnq6MW0beKVjMp1MsgtoQI.FXCa', 'balogh.anna@gmail.com', '2026-04-16', 'felhasznalo'),
(36, 'MolnarGabor', '$2b$10$DM8e3IvR09g42PhcN.UAMOBsGaLnq6MW0beKVjMp1MsgtoQI.FXCa', 'molnar.gabor@gmail.com', '2026-04-16', 'felhasznalo');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoriak`
--

DROP TABLE IF EXISTS `kategoriak`;
CREATE TABLE `kategoriak` (
  `kategoria_id` int(5) NOT NULL,
  `kategoria_nev` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `kategoriak`
--

INSERT INTO `kategoriak` (`kategoria_id`, `kategoria_nev`) VALUES
(1, 'Prémium'),
(2, 'Gyors'),
(3, 'Kávézó'),
(4, 'Bisztró'),
(5, 'Csárda'),
(6, 'Ázsiai');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kedvencek`
--

DROP TABLE IF EXISTS `kedvencek`;
CREATE TABLE `kedvencek` (
  `id` int(11) NOT NULL,
  `felhasznalo_id` int(10) NOT NULL,
  `etterem_id` int(11) NOT NULL,
  `letrehozva` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `kedvencek`
--

INSERT INTO `kedvencek` (`id`, `felhasznalo_id`, `etterem_id`, `letrehozva`) VALUES
(2, 18, 4, '2026-04-11 17:56:49'),
(7, 18, 1, '2026-04-16 19:24:51');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kepek`
--

DROP TABLE IF EXISTS `kepek`;
CREATE TABLE `kepek` (
  `kep_id` int(11) NOT NULL,
  `etterem_id` int(11) NOT NULL,
  `fajl_nev` varchar(255) NOT NULL,
  `leiras` varchar(100) NOT NULL,
  `feltoltes_datum` datetime NOT NULL,
  `eredeti_nev` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `kepek`
--

INSERT INTO `kepek` (`kep_id`, `etterem_id`, `fajl_nev`, `leiras`, `feltoltes_datum`, `eredeti_nev`) VALUES
(1, 9, 'Hot&Go.png', 'ez egy étterem', '2026-01-22 12:44:39', ''),
(2, 10, 'Zabalora.png', 'Belső éttermi hangulat, teríték és gyertyák', '2026-02-01 17:02:22', ''),
(3, 8, 'Bors&Lelek.png', 'Vacsora két főre – elegáns szervírozás', '2026-02-01 17:02:22', ''),
(4, 7, 'AranyKanal.png', 'Fine dining tálalás közelről', '2026-02-01 17:02:22', ''),
(5, 6, 'PirosPaprika.png', 'Séf munka közben a konyhában', '2026-02-01 17:02:22', ''),
(6, 5, 'Langoszona.png', 'Modern étterem enteriőr', '2026-02-01 17:02:22', ''),
(7, 4, 'KacsaAKodben.png', 'Asztalterítés borospoharakkal', '2026-02-01 17:02:22', ''),
(8, 3, 'DeakFalatozo.png', 'Ínyenc fogás – kreatív tálalás', '2026-02-01 17:02:22', ''),
(9, 2, 'LegjobbCsarda.png', 'Forró főétel felszolgálva', '2026-02-01 17:02:22', ''),
(10, 1, 'BurgerPart.png', 'Felszolgáló italokat hoz az asztalhoz', '2026-02-01 17:02:22', '');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kommentek`
--

DROP TABLE IF EXISTS `kommentek`;
CREATE TABLE `kommentek` (
  `komment_id` int(5) NOT NULL,
  `felhasznalo_id` int(11) DEFAULT NULL,
  `etterem_id` int(5) NOT NULL,
  `megjegyzes` varchar(255) NOT NULL,
  `letrehoz_ido` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `kommentek`
--

INSERT INTO `kommentek` (`komment_id`, `felhasznalo_id`, `etterem_id`, `megjegyzes`, `letrehoz_ido`) VALUES
(1, 27, 1, 'Kiváló ízek és barátságos kiszolgálás.', '2026-02-23 10:13:38'),
(2, 28, 3, 'Túl sokat kellett várni, de az étel finom volt.', '2026-02-23 10:13:38'),
(3, 31, 5, 'Hangulatos hely, visszatérünk még.', '2026-02-23 10:13:38'),
(4, 30, 2, 'Az adagok kicsik voltak, de ízletesek.', '2026-02-23 10:13:38'),
(10, 29, 1, 'Nagyon finom hamburgerek, gyors kiszolgálás.', '2026-04-16 21:08:02'),
(11, 31, 1, 'Jó ár-érték arány, biztosan visszajövök.', '2026-04-16 21:08:02'),
(12, 32, 2, 'Igazi házias ízek, bőséges adagok.', '2026-04-16 21:08:02'),
(13, 35, 2, 'A gulyás kiváló volt, a hangulat családias.', '2026-04-16 21:08:02'),
(14, 27, 3, 'Finom ebédmenü, korrekt árakkal.', '2026-04-16 21:08:02'),
(15, 35, 3, 'Kicsit sokat kellett várni, de megérte.', '2026-04-16 21:08:02'),
(16, 34, 4, 'Különleges ízek, nagyon hangulatos hely.', '2026-04-16 21:08:02'),
(17, 33, 4, 'A kacsás ételek zseniálisak voltak.', '2026-04-16 21:08:02'),
(18, 33, 5, 'Ropogós, friss lángos, ahogy kell.', '2026-04-16 21:08:02'),
(19, 29, 5, 'Gyors kiszolgálás, klasszikus ízek.', '2026-04-16 21:08:02'),
(20, 35, 6, 'Hagyományos magyar konyha, nagy adagok.', '2026-04-16 21:08:02'),
(21, 34, 6, 'A pörkölt nagyon ízletes volt.', '2026-04-16 21:08:02'),
(22, 36, 7, 'Elegáns környezet, finom ételek.', '2026-04-16 21:08:02'),
(23, 34, 7, 'Kicsit drágább, de a minőség kiváló.', '2026-04-16 21:08:02'),
(24, 27, 8, 'Modern ízek, szép tálalás.', '2026-04-16 21:08:02'),
(25, 28, 8, 'A borválaszték különösen jó.', '2026-04-16 21:08:02'),
(26, 34, 9, 'Gyors és csípős, pont amire számítottam.', '2026-04-16 21:08:02'),
(27, 34, 9, 'Jó hely egy gyors ebédhez.', '2026-04-16 21:08:02'),
(28, 33, 10, 'Nagy adagok, gyors kiszolgálás.', '2026-04-16 21:08:02'),
(29, 28, 10, 'Rohanós napokra tökéletes választás.', '2026-04-16 21:08:02');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `varosok`
--

DROP TABLE IF EXISTS `varosok`;
CREATE TABLE `varosok` (
  `iranyitoszam` int(4) NOT NULL,
  `varos` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `varosok`
--

INSERT INTO `varosok` (`iranyitoszam`, `varos`) VALUES
(1011, 'Budapest I.'),
(1012, 'Budapest I.'),
(1013, 'Budapest I.'),
(1014, 'Budapest I.'),
(1021, 'Budapest II.'),
(1022, 'Budapest II.'),
(1023, 'Budapest II.'),
(1024, 'Budapest II.'),
(1025, 'Budapest II.'),
(1026, 'Budapest II.'),
(1031, 'Budapest III.'),
(1032, 'Budapest III.'),
(1033, 'Budapest III.'),
(1034, 'Budapest III.'),
(1035, 'Budapest III.'),
(1036, 'Budapest III.'),
(1037, 'Budapest III.'),
(1038, 'Budapest III.'),
(1039, 'Budapest III.'),
(1041, 'Budapest IV.'),
(1042, 'Budapest IV.'),
(1043, 'Budapest IV.'),
(1044, 'Budapest IV.'),
(1045, 'Budapest IV.'),
(1046, 'Budapest IV.'),
(1047, 'Budapest IV.'),
(1048, 'Budapest IV.'),
(1051, 'Budapest V.'),
(1052, 'Budapest V.'),
(1053, 'Budapest V.'),
(1054, 'Budapest V.'),
(1055, 'Budapest V.'),
(1056, 'Budapest V.'),
(1061, 'Budapest VI.'),
(1062, 'Budapest VI.'),
(1063, 'Budapest VI.'),
(1064, 'Budapest VI.'),
(1065, 'Budapest VI.'),
(1066, 'Budapest VI.'),
(1067, 'Budapest VI.'),
(1071, 'Budapest VII.'),
(1072, 'Budapest VII.'),
(1073, 'Budapest VII.'),
(1074, 'Budapest VII.'),
(1075, 'Budapest VII.'),
(1076, 'Budapest VII.'),
(1077, 'Budapest VII.'),
(1078, 'Budapest VII.'),
(1081, 'Budapest VIII.'),
(1082, 'Budapest VIII.'),
(1083, 'Budapest VIII.'),
(1084, 'Budapest VIII.'),
(1085, 'Budapest VIII.'),
(1086, 'Budapest VIII.'),
(1087, 'Budapest VIII.'),
(1088, 'Budapest VIII.'),
(1089, 'Budapest VIII.'),
(1091, 'Budapest IX.'),
(1092, 'Budapest IX.'),
(1093, 'Budapest IX.'),
(1094, 'Budapest IX.'),
(1095, 'Budapest IX.'),
(1096, 'Budapest IX.'),
(1097, 'Budapest IX.'),
(1101, 'Budapest X.'),
(1102, 'Budapest X.'),
(1103, 'Budapest X.'),
(1104, 'Budapest X.'),
(1105, 'Budapest X.'),
(1106, 'Budapest X.'),
(1107, 'Budapest X.'),
(1108, 'Budapest X.'),
(1111, 'Budapest XI.'),
(1112, 'Budapest XI.'),
(1113, 'Budapest XI.'),
(1114, 'Budapest XI.'),
(1115, 'Budapest XI.'),
(1116, 'Budapest XI.'),
(1117, 'Budapest'),
(1118, 'Budapest XI.'),
(1119, 'Budapest XI.'),
(1121, 'Budapest XII.'),
(1122, 'Budapest XII.'),
(1123, 'Budapest XII.'),
(1124, 'Budapest XII.'),
(1125, 'Budapest XII.'),
(1126, 'Budapest XII.'),
(1131, 'Budapest XIII.'),
(1132, 'Budapest XIII.'),
(1133, 'Budapest XIII.'),
(1134, 'Budapest XIII.'),
(1135, 'Budapest XIII.'),
(1136, 'Budapest XIII.'),
(1137, 'Budapest XIII.'),
(1138, 'Budapest XIII.'),
(1141, 'Budapest XIV.'),
(1142, 'Budapest XIV.'),
(1143, 'Budapest XIV.'),
(1144, 'Budapest XIV.'),
(1145, 'Budapest XIV.'),
(1146, 'Budapest XIV.'),
(1151, 'Budapest XV.'),
(1152, 'Budapest XV.'),
(1153, 'Budapest XV.'),
(1154, 'Budapest XV.'),
(1155, 'Budapest XV.'),
(1156, 'Budapest XV.'),
(1157, 'Budapest XV.'),
(1158, 'Budapest XV.'),
(1161, 'Budapest XVI.'),
(1162, 'Budapest XVI.'),
(1163, 'Budapest XVI.'),
(1164, 'Budapest XVI.'),
(1165, 'Budapest XVI.'),
(1171, 'Budapest XVII.'),
(1172, 'Budapest XVII.'),
(1173, 'Budapest XVII.'),
(1174, 'Budapest XVII.'),
(1181, 'Budapest XVIII.'),
(1182, 'Budapest XVIII.'),
(1183, 'Budapest XVIII.'),
(1184, 'Budapest XVIII.'),
(1185, 'Budapest XVIII.'),
(1186, 'Budapest XVIII.'),
(1191, 'Budapest XIX.'),
(1192, 'Budapest XIX.'),
(1193, 'Budapest XIX.'),
(1194, 'Budapest XIX.'),
(1195, 'Budapest XIX.'),
(1201, 'Budapest XX.'),
(1202, 'Budapest XX.'),
(1203, 'Budapest XX.'),
(1204, 'Budapest XX.'),
(1211, 'Budapest XXI.'),
(1212, 'Budapest XXI.'),
(1213, 'Budapest XXI.'),
(1214, 'Budapest XXI.'),
(1215, 'Budapest XXI.'),
(1221, 'Budapest XXII.'),
(1222, 'Budapest XXII.'),
(1223, 'Budapest XXII.'),
(1224, 'Budapest XXII.'),
(1225, 'Budapest XXII.'),
(1231, 'Budapest XXIII.'),
(1232, 'Budapest XXIII.'),
(1233, 'Budapest XXIII.'),
(1234, 'Budapest XXIII.'),
(1235, 'Budapest XXIII.'),
(1236, 'Budapest XXIII.'),
(1237, 'Budapest XXIII.'),
(1238, 'Budapest XXIII.'),
(1239, 'Budapest XXIII.'),
(3500, 'Miskolc'),
(3501, 'Miskolc'),
(3515, 'Miskolc'),
(3516, 'Miskolc'),
(3517, 'Miskolc'),
(3521, 'Miskolc'),
(3525, 'Miskolc'),
(3530, 'Miskolc'),
(4000, 'Debrecen'),
(4001, 'Debrecen'),
(4002, 'Debrecen'),
(4024, 'Debrecen'),
(4025, 'Debrecen'),
(4026, 'Debrecen'),
(4027, 'Debrecen'),
(4028, 'Debrecen'),
(4029, 'Debrecen'),
(4030, 'Debrecen'),
(4031, 'Debrecen'),
(4400, 'Nyíregyháza'),
(4401, 'Nyíregyháza'),
(4405, 'Nyíregyháza'),
(4431, 'Nyíregyháza'),
(6000, 'Kecskemét'),
(6001, 'Kecskemét'),
(6002, 'Kecskemét'),
(6003, 'Kecskemét'),
(6700, 'Szeged'),
(6710, 'Szeged'),
(6720, 'Miskolc'),
(6721, 'Szeged'),
(6722, 'Szeged'),
(6723, 'Szeged'),
(6724, 'Szeged'),
(6725, 'Szeged'),
(6726, 'Szeged'),
(6727, 'Szeged'),
(6728, 'Szeged'),
(6729, 'Szeged'),
(7600, 'Pécs'),
(7601, 'Pécs'),
(7621, 'Pécs'),
(7622, 'Pécs'),
(7623, 'Pécs'),
(7624, 'Pécs'),
(7625, 'Pécs'),
(7626, 'Pécs'),
(7627, 'Pécs'),
(7628, 'Pécs'),
(8000, 'Székesfehérvár'),
(8001, 'Székesfehérvár'),
(8002, 'Székesfehérvár'),
(8019, 'Székesfehérvár'),
(9000, 'Győr'),
(9001, 'Győr'),
(9021, 'Győr'),
(9022, 'Győr'),
(9023, 'Győr'),
(9024, 'Győr'),
(9025, 'Győr'),
(9026, 'Győr'),
(9027, 'Győr');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `ertekelesek`
--
ALTER TABLE `ertekelesek`
  ADD PRIMARY KEY (`ertekeles_id`),
  ADD KEY `fk_felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `etterem_id` (`etterem_id`);

--
-- A tábla indexei `ettermek`
--
ALTER TABLE `ettermek`
  ADD PRIMARY KEY (`etterem_id`),
  ADD KEY `iranyitoszam` (`iranyitoszam`),
  ADD KEY `FK_katgoria` (`kategoria_id`);

--
-- A tábla indexei `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD PRIMARY KEY (`felhasznalo_id`);

--
-- A tábla indexei `kategoriak`
--
ALTER TABLE `kategoriak`
  ADD PRIMARY KEY (`kategoria_id`);

--
-- A tábla indexei `kedvencek`
--
ALTER TABLE `kedvencek`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `felhasznalo_id` (`felhasznalo_id`,`etterem_id`),
  ADD KEY `fk_kedvenc_etterem` (`etterem_id`);

--
-- A tábla indexei `kepek`
--
ALTER TABLE `kepek`
  ADD PRIMARY KEY (`kep_id`),
  ADD KEY `fk_kepek_id` (`etterem_id`);

--
-- A tábla indexei `kommentek`
--
ALTER TABLE `kommentek`
  ADD PRIMARY KEY (`komment_id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `etterem_id` (`etterem_id`);

--
-- A tábla indexei `varosok`
--
ALTER TABLE `varosok`
  ADD PRIMARY KEY (`iranyitoszam`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `ertekelesek`
--
ALTER TABLE `ertekelesek`
  MODIFY `ertekeles_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT a táblához `ettermek`
--
ALTER TABLE `ettermek`
  MODIFY `etterem_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  MODIFY `felhasznalo_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT a táblához `kategoriak`
--
ALTER TABLE `kategoriak`
  MODIFY `kategoria_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `kedvencek`
--
ALTER TABLE `kedvencek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `kepek`
--
ALTER TABLE `kepek`
  MODIFY `kep_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT a táblához `kommentek`
--
ALTER TABLE `kommentek`
  MODIFY `komment_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `ertekelesek`
--
ALTER TABLE `ertekelesek`
  ADD CONSTRAINT `ertekelesek_ibfk_1` FOREIGN KEY (`etterem_id`) REFERENCES `ettermek` (`etterem_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_felhasznalo_id` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE SET NULL;

--
-- Megkötések a táblához `ettermek`
--
ALTER TABLE `ettermek`
  ADD CONSTRAINT `FK_katgoria` FOREIGN KEY (`kategoria_id`) REFERENCES `kategoriak` (`kategoria_id`),
  ADD CONSTRAINT `fk_varos` FOREIGN KEY (`iranyitoszam`) REFERENCES `varosok` (`iranyitoszam`);

--
-- Megkötések a táblához `kedvencek`
--
ALTER TABLE `kedvencek`
  ADD CONSTRAINT `fk_kedvenc_etterem` FOREIGN KEY (`etterem_id`) REFERENCES `ettermek` (`etterem_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_kedvenc_user` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `kepek`
--
ALTER TABLE `kepek`
  ADD CONSTRAINT `fk_kepek_id` FOREIGN KEY (`etterem_id`) REFERENCES `ettermek` (`etterem_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `kommentek`
--
ALTER TABLE `kommentek`
  ADD CONSTRAINT `kommentek_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `kommentek_ibfk_2` FOREIGN KEY (`etterem_id`) REFERENCES `ettermek` (`etterem_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
