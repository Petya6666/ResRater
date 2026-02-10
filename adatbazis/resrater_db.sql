-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1:3307
-- Létrehozás ideje: 2026. Feb 10. 08:43
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
-- Adatbázis: `resrater_db`
--
CREATE DATABASE IF NOT EXISTS `resrater_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `resrater_db`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ertekelesek`
--

CREATE TABLE `ertekelesek` (
  `ertekeles_id` int(11) NOT NULL,
  `etterem_id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `atlag` tinyint(4) NOT NULL,
  `megjegyzes` text NOT NULL,
  `datum` datetime NOT NULL,
  `etelminoseg` int(5) NOT NULL,
  `kiszolgalas` int(5) NOT NULL,
  `hangulat` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `ertekelesek`
--

INSERT INTO `ertekelesek` (`ertekeles_id`, `etterem_id`, `felhasznalo_id`, `atlag`, `megjegyzes`, `datum`, `etelminoseg`, `kiszolgalas`, `hangulat`) VALUES
(1, 1, 3, 5, 'Kiváló ízek és barátságos kiszolgálás.', '2025-11-01 12:00:00', 1, 1, 1),
(2, 2, 7, 2, 'Túl sokat kellett várni, de az étel finom volt.', '2025-11-02 13:00:00', 2, 2, 2),
(3, 3, 5, 4, 'Hangulatos hely, visszatérünk még.', '2025-11-03 14:00:00', 3, 3, 3),
(4, 4, 1, 3, 'Az adagok kicsik voltak, de ízletesek.', '2025-11-04 15:00:00', 4, 4, 4),
(5, 5, 9, 5, 'A pincér nagyon segítőkész volt.', '2025-11-05 16:00:00', 5, 5, 5),
(6, 6, 2, 1, 'Nem volt friss az étel, csalódás.', '2025-11-06 17:00:00', 6, 6, 6),
(7, 7, 10, 4, 'Remek ár-érték arány.', '2025-11-07 18:00:00', 7, 7, 7),
(8, 8, 4, 2, 'Zajos környezet, de jó hangulat.', '2025-11-08 19:00:00', 8, 8, 8),
(9, 9, 6, 5, 'A desszert különösen finom volt.', '2025-11-09 20:00:00', 9, 9, 9),
(10, 10, 8, 3, 'Kedves személyzet és gyors kiszolgálás.', '2025-11-10 21:00:00', 10, 10, 10);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ettermek`
--

CREATE TABLE `ettermek` (
  `etterem_id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `telefon` varchar(20) NOT NULL,
  `leiras` text NOT NULL,
  `kategoria` varchar(50) NOT NULL,
  `iranyitoszam` int(4) NOT NULL,
  `jovahagyott` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `ettermek`
--

INSERT INTO `ettermek` (`etterem_id`, `nev`, `telefon`, `leiras`, `kategoria`, `iranyitoszam`, `jovahagyott`) VALUES
(1, 'BurgerPart', '+365148769', 'Kézműves burgerek, ropogós krumpli és jó hangulat – ez a BurgerPart receptje. Tökéletes hely egy gyors falatra a barátokkal vagy egy laza ebédszünetre.', '2', 1117, 1),
(2, 'Legjobb csárda', '+3642069', 'A Legjobb Csárda a hagyományos magyar vendégszeretet otthona, ahol az igazi falusi ízek és a jókedv kéz a kézben járnak. Frissen készült, házias ételeink – a gőzölgő gulyástól a ropogós rántott húsig – a nagymama konyhájának hangulatát idézik. A barátságos kiszolgálás, a rusztikus berendezés és a vidám zene gondoskodik róla, hogy minden vendég úgy érezze: itt tényleg otthon van.', '1', 6720, 1),
(3, 'Deák Ferenc Falatozó', '+3655877', 'A Deák Ferenc Falatozó egy hangulatos, családias étterem, ahol a hagyományos magyar ízek találkoznak a modern konyha könnyedségével. Éttermünk szívében a vendég a legfontosabb: friss, helyi alapanyagokból készült ételeinket barátságos kiszolgálással és otthonos környezetben kínáljuk. Legyen szó egy gyors ebédről, baráti vacsoráról vagy hétvégi lakomáról, nálunk mindig jóllakottan és mosollyal az arcán távozik minden vendég.', '2', 9022, 0),
(4, 'Kacsa a Ködben', '+36598742', 'A Kacsa a Ködben egy hangulatos, kissé titokzatos étterem, ahol a gasztronómia és a művészet találkozik. Rejtett utcában, lágy fények és kellemes zene kíséretében várjuk vendégeinket, hogy felfedezzék a magyar és nemzetközi konyha különleges fúzióját. Éttermünk védjegye a kreatív kacsás fogások sora – a klasszikus sült kacsától a modern, gyümölcsös variációkig.', '2', 6720, 1),
(5, 'Lángoszóna', '+36548798', 'A Lángoszóna a magyar street food lelke. Klasszikus és felturbózott lángosok, fokhagymás illat és friss tejföl – hagyomány, ami belefér a kezedbe.', '1', 1117, 0),
(6, 'Piros Paprika Vendéglő', '+36985678', 'A Piros Paprika Vendéglő a magyar ízek színes otthona, ahol minden falatban ott van a tradíció és a szenvedély. Friss, hazai alapanyagokból készült ételeinket gazdagon fűszerezzük – természetesen jó adag szeretettel és egy csipetnyi paprikával. Barátságos hangulat, házias ízek és bőséges adagok várják mindazokat, akik szeretik a klasszikus magyar konyhát.', '2', 9022, 0),
(7, 'Aranykanál Bisztró', '+3696554432', 'Az Aranykanál Bisztró elegáns, mégis otthonos hely, ahol a modern magyar konyha kifinomult ízei várják a vendégeket.', '2', 6720, 1),
(8, 'Bors & Lélek', '+3662314875', 'A Bors & Lélek modern hangulatú étterem, ahol a bor és a fűszer találkozik – magyaros ételek újragondolva.', '1', 1117, 1),
(9, 'Hot & Go', '+3652478215', 'A Hot & Go fűszeres gyorsételeket kínál lendületes, fiatalos környezetben – tökéletes útközben is.', '1', 6720, 0),
(10, 'ZabálÓra', '+3672611998', 'A ZabálÓra a rohanó vendégek kedvence: friss, bőséges és gyors ételek barátságos hangulatban.', '2', 1117, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

CREATE TABLE `felhasznalok` (
  `felhasznalo_id` int(10) NOT NULL,
  `felhasznev` varchar(25) NOT NULL,
  `jelszo` varchar(100) NOT NULL,
  `email` varchar(20) NOT NULL,
  `reg_datum` date NOT NULL DEFAULT current_timestamp(),
  `szerep` enum('felhasznalo','admin') NOT NULL DEFAULT 'felhasznalo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalok`
--

INSERT INTO `felhasznalok` (`felhasznalo_id`, `felhasznev`, `jelszo`, `email`, `reg_datum`, `szerep`) VALUES
(1, 'kovacsistvan', '123456', 'istvan.kovacs@exampl', '2025-01-15', 'felhasznalo'),
(2, 'szabozsuzsa', '234567', 'zsuzsa.szabo@example', '2025-02-20', 'felhasznalo'),
(3, 'nagyadam', '345678', 'adam.nagy@example.co', '2025-03-10', 'felhasznalo'),
(4, 'kissmaria', '456789', 'maria.kiss@example.c', '2025-04-05', 'felhasznalo'),
(5, 'tothbela', '567890', 'bela.toth@example.co', '2025-05-12', 'felhasznalo'),
(6, 'pektamas', '678901', 'tamas.pek@example.co', '2025-06-10', 'felhasznalo'),
(7, 'baloghanita', '789012', 'anita.balogh@example', '2025-07-08', 'felhasznalo'),
(8, 'farkasgergo', '890123', 'gergo.farkas@example', '2025-08-15', 'felhasznalo'),
(9, 'molnarnora', '901234', 'nora.molnar@example.', '2025-09-03', 'felhasznalo'),
(10, 'szilagyizoltan', '123789', 'zoltan.szilagyi@exam', '2025-10-22', 'admin'),
(13, 'asasaaf', '$2b$10$ddXFuO/dH0GL1BXV6URaJuBw.Oi.0dw/YhKrejpb92f', 'bahfbaf@nasdja.hu', '2026-01-21', 'felhasznalo'),
(14, 'ahahadb', '$2b$10$Qf2kEnZEet341Xy.aGxsW.LN8VHetj//AYb2EOa2aGY', 'jka@example.com', '2026-01-21', 'felhasznalo'),
(15, 'péter', '$2b$10$Xvl3Z1A09Acf6O1Z6eCJoOogB5c3V7zbrV.7nF50bb84rcBeJQ8IC', 'peti@example.com', '2026-02-10', 'felhasznalo');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kepek`
--

CREATE TABLE `kepek` (
  `kep_id` int(11) NOT NULL,
  `etterem_id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `leiras` varchar(100) NOT NULL,
  `feltoltes_datum` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `kepek`
--

INSERT INTO `kepek` (`kep_id`, `etterem_id`, `url`, `leiras`, `feltoltes_datum`) VALUES
(1, 9, 'https://unsplash.com/s/photos/restaurant', 'ez egy étterem', '2026-01-22 12:44:39'),
(2, 10, 'https://unsplash.com/s/photos/restaurant', 'Belső éttermi hangulat, teríték és gyertyák', '2026-02-01 17:02:22'),
(3, 8, 'https://stock.adobe.com/search?k=hotel+restaurant', 'Vacsora két főre – elegáns szervírozás', '2026-02-01 17:02:22'),
(4, 7, 'https://create.vista.com/photos/fine-restaurants/', 'Fine dining tálalás közelről', '2026-02-01 17:02:22'),
(5, 6, 'https://www.dreamstime.com/photos-images/modern-cozy-restaurant.html', 'Séf munka közben a konyhában', '2026-02-01 17:02:22'),
(6, 5, 'https://www.freepik.com/free-photos-vectors/restaurant', 'Modern étterem enteriőr', '2026-02-01 17:02:22'),
(7, 4, 'https://stock.adobe.com/search?k=empty+table+restaurant', 'Asztalterítés borospoharakkal', '2026-02-01 17:02:22'),
(8, 3, 'https://www.istockphoto.com/photos/fine-dining-restaurant-interior', 'Ínyenc fogás – kreatív tálalás', '2026-02-01 17:02:22'),
(9, 2, 'https://depositphotos.com/hu/photos/restaurant.html', 'Forró főétel felszolgálva', '2026-02-01 17:02:22'),
(10, 1, 'https://www.vecteezy.com/free-photos/fancy-restaurant', 'Felszolgáló italokat hoz az asztalhoz', '2026-02-01 17:02:22');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `varosok`
--

CREATE TABLE `varosok` (
  `iranyitoszam` int(4) NOT NULL,
  `varos` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `varosok`
--

INSERT INTO `varosok` (`iranyitoszam`, `varos`) VALUES
(1117, 'Budapest'),
(6720, 'Miskolc'),
(9022, 'Győr');

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
  ADD KEY `iranyitoszam` (`iranyitoszam`);

--
-- A tábla indexei `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD PRIMARY KEY (`felhasznalo_id`);

--
-- A tábla indexei `kepek`
--
ALTER TABLE `kepek`
  ADD PRIMARY KEY (`kep_id`),
  ADD KEY `fk_kepek_id` (`etterem_id`);

--
-- A tábla indexei `varosok`
--
ALTER TABLE `varosok`
  ADD PRIMARY KEY (`iranyitoszam`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  MODIFY `felhasznalo_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `ertekelesek`
--
ALTER TABLE `ertekelesek`
  ADD CONSTRAINT `ertekelesek_ibfk_1` FOREIGN KEY (`etterem_id`) REFERENCES `ettermek` (`etterem_id`),
  ADD CONSTRAINT `fk_felhasznalo_id` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`);

--
-- Megkötések a táblához `ettermek`
--
ALTER TABLE `ettermek`
  ADD CONSTRAINT `fk_varos` FOREIGN KEY (`iranyitoszam`) REFERENCES `varosok` (`iranyitoszam`);

--
-- Megkötések a táblához `kepek`
--
ALTER TABLE `kepek`
  ADD CONSTRAINT `fk_kepek_id` FOREIGN KEY (`etterem_id`) REFERENCES `ettermek` (`etterem_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
