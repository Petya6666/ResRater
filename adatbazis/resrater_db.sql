-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Apr 11, 2026 at 10:07 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `resrater_db`
--
CREATE DATABASE IF NOT EXISTS `resrater_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `resrater_db`;

-- --------------------------------------------------------

--
-- Table structure for table `ertekelesek`
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
-- Dumping data for table `ertekelesek`
--

INSERT INTO `ertekelesek` (`ertekeles_id`, `etterem_id`, `felhasznalo_id`, `atlag`, `datum`, `etelminoseg`, `kiszolgalas`, `hangulat`) VALUES
(1, 1, NULL, 3.00, '2025-11-01 12:00:00', 5, 3, 2),
(2, 2, NULL, 2.00, '2025-11-02 13:00:00', 4, 2, 1),
(3, 3, NULL, 3.00, '2025-11-03 14:00:00', 1, 5, 3),
(4, 4, NULL, 4.00, '2025-11-04 15:00:00', 4, 2, 5),
(5, 5, NULL, 4.00, '2025-11-05 16:00:00', 4, 5, 3),
(6, 6, NULL, 3.00, '2025-11-06 17:00:00', 1, 3, 5),
(7, 7, NULL, 4.00, '2025-11-07 18:00:00', 5, 4, 3),
(8, 8, NULL, 3.00, '2025-11-08 19:00:00', 2, 4, 4),
(9, 9, NULL, 4.00, '2025-11-09 20:00:00', 3, 5, 5),
(10, 10, NULL, 5.00, '2025-11-10 21:00:00', 5, 4, 5),
(11, 4, 15, 4.00, '2026-03-05 11:15:58', 5, 2, 5),
(12, 1, 13, 4.00, '2026-03-05 11:58:30', 5, 4, 3),
(13, 1, 15, 4.00, '2026-03-05 11:59:22', 5, 4, 3),
(14, 1, 16, 4.00, '2026-03-05 12:02:49', 5, 4, 4),
(15, 8, 14, 4.00, '2026-03-05 12:04:09', 5, 4, 4),
(16, 7, 16, 4.00, '2026-03-05 12:05:42', 5, 4, 4),
(17, 8, 14, 4.00, '2026-03-05 12:08:22', 5, 4, 4),
(18, 7, 17, 4.00, '2026-03-05 12:10:44', 5, 4, 4),
(19, 1, 16, 3.33, '2026-03-05 12:11:44', 2, 4, 4);

--
-- Triggers `ertekelesek`
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
-- Table structure for table `ettermek`
--

DROP TABLE IF EXISTS `ettermek`;
CREATE TABLE `ettermek` (
  `etterem_id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `telefon` varchar(20) NOT NULL,
  `leiras` text NOT NULL,
  `kategoria_id` int(5) NOT NULL,
  `iranyitoszam` int(4) NOT NULL,
  `jovahagyott` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Dumping data for table `ettermek`
--

INSERT INTO `ettermek` (`etterem_id`, `nev`, `telefon`, `leiras`, `kategoria_id`, `iranyitoszam`, `jovahagyott`) VALUES
(1, 'BurgerPart', '+365148769', 'Kézműves burgerek, ropogós krumpli és jó hangulat – ez a BurgerPart receptje. Tökéletes hely egy gyors falatra a barátokkal vagy egy laza ebédszünetre.', 2, 1117, 1),
(2, 'Legjobb csárda', '+3642069', 'A Legjobb Csárda a hagyományos magyar vendégszeretet otthona, ahol az igazi falusi ízek és a jókedv kéz a kézben járnak. Frissen készült, házias ételeink – a gőzölgő gulyástól a ropogós rántott húsig – a nagymama konyhájának hangulatát idézik. A barátságos kiszolgálás, a rusztikus berendezés és a vidám zene gondoskodik róla, hogy minden vendég úgy érezze: itt tényleg otthon van.', 1, 6720, 1),
(3, 'Deák Ferenc Falatozó', '+3655877', 'A Deák Ferenc Falatozó egy hangulatos, családias étterem, ahol a hagyományos magyar ízek találkoznak a modern konyha könnyedségével. Éttermünk szívében a vendég a legfontosabb: friss, helyi alapanyagokból készült ételeinket barátságos kiszolgálással és otthonos környezetben kínáljuk. Legyen szó egy gyors ebédről, baráti vacsoráról vagy hétvégi lakomáról, nálunk mindig jóllakottan és mosollyal az arcán távozik minden vendég.', 2, 9022, 1),
(4, 'Kacsa a Ködben', '+36598742', 'A Kacsa a Ködben egy hangulatos, kissé titokzatos étterem, ahol a gasztronómia és a művészet találkozik. Rejtett utcában, lágy fények és kellemes zene kíséretében várjuk vendégeinket, hogy felfedezzék a magyar és nemzetközi konyha különleges fúzióját. Éttermünk védjegye a kreatív kacsás fogások sora – a klasszikus sült kacsától a modern, gyümölcsös variációkig.', 2, 6720, 1),
(5, 'Lángoszóna', '+36548798', 'A Lángoszóna a magyar street food lelke. Klasszikus és felturbózott lángosok, fokhagymás illat és friss tejföl – hagyomány, ami belefér a kezedbe.', 1, 1117, 1),
(6, 'Piros Paprika Vendéglő', '+36985678', 'A Piros Paprika Vendéglő a magyar ízek színes otthona, ahol minden falatban ott van a tradíció és a szenvedély. Friss, hazai alapanyagokból készült ételeinket gazdagon fűszerezzük – természetesen jó adag szeretettel és egy csipetnyi paprikával. Barátságos hangulat, házias ízek és bőséges adagok várják mindazokat, akik szeretik a klasszikus magyar konyhát.', 2, 9022, 1),
(7, 'Aranykanál Bisztró', '+3696554432', 'Az Aranykanál Bisztró elegáns, mégis otthonos hely, ahol a modern magyar konyha kifinomult ízei várják a vendégeket.', 2, 6720, 1),
(8, 'Bors & Lélek', '+3662314875', 'A Bors & Lélek modern hangulatú étterem, ahol a bor és a fűszer találkozik – magyaros ételek újragondolva.', 1, 1117, 1),
(9, 'Hot & Go', '+3652478215', 'A Hot & Go fűszeres gyorsételeket kínál lendületes, fiatalos környezetben – tökéletes útközben is.', 1, 6720, 1),
(10, 'ZabálÓra', '+3672611998', 'A ZabálÓra a rohanó vendégek kedvence: friss, bőséges és gyors ételek barátságos hangulatban.', 2, 1117, 0);

-- --------------------------------------------------------

--
-- Table structure for table `felhasznalok`
--

DROP TABLE IF EXISTS `felhasznalok`;
CREATE TABLE `felhasznalok` (
  `felhasznalo_id` int(10) NOT NULL,
  `felhasznev` varchar(25) NOT NULL,
  `jelszo` varchar(100) NOT NULL,
  `email` varchar(20) NOT NULL,
  `reg_datum` date NOT NULL DEFAULT current_timestamp(),
  `szerep` enum('felhasznalo','admin') NOT NULL DEFAULT 'felhasznalo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Dumping data for table `felhasznalok`
--

INSERT INTO `felhasznalok` (`felhasznalo_id`, `felhasznev`, `jelszo`, `email`, `reg_datum`, `szerep`) VALUES
(13, 'asasaaf', '$2b$10$ddXFuO/dH0GL1BXV6URaJuBw.Oi.0dw/YhKrejpb92f', 'bahfbaf@nasdja.hu', '2026-01-21', 'felhasznalo'),
(14, 'ahahadb', '$2b$10$Qf2kEnZEet341Xy.aGxsW.LN8VHetj//AYb2EOa2aGY', 'jka@example.com', '2026-01-21', 'felhasznalo'),
(15, 'péter', '$2b$10$Xvl3Z1A09Acf6O1Z6eCJoOogB5c3V7zbrV.7nF50bb84rcBeJQ8IC', 'peti@example.com', '2026-02-10', 'felhasznalo'),
(16, 'Petyaa', '$2b$10$wa16UpW8GpWtAxGdda/vLeG/5JVM/Z8RZNfY.T/uzCtnJN53fIEVK', 'palpet478@hengersor.', '2026-02-24', 'felhasznalo'),
(17, 'Alma', '$2b$10$DM8e3IvR09g42PhcN.UAMOBsGaLnq6MW0beKVjMp1MsgtoQI.FXCa', 'alma@gmail.com', '2026-02-24', 'felhasznalo'),
(18, 'tamas', '$2b$10$FANkhssMlN4L.m66nnR7xO16G3PwOjuZxNrzJp6RIbJfF5xiiJPxK', 'valami@example.com', '2026-02-26', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `kategoriak`
--

DROP TABLE IF EXISTS `kategoriak`;
CREATE TABLE `kategoriak` (
  `kategoria_id` int(5) NOT NULL,
  `kategoria_nev` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategoriak`
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
-- Table structure for table `kedvencek`
--

DROP TABLE IF EXISTS `kedvencek`;
CREATE TABLE `kedvencek` (
  `id` int(11) NOT NULL,
  `felhasznalo_id` int(10) NOT NULL,
  `etterem_id` int(11) NOT NULL,
  `letrehozva` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kedvencek`
--

INSERT INTO `kedvencek` (`id`, `felhasznalo_id`, `etterem_id`, `letrehozva`) VALUES
(2, 18, 4, '2026-04-11 19:56:49'),
(3, 18, 5, '2026-04-11 19:56:49');

-- --------------------------------------------------------

--
-- Table structure for table `kepek`
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
-- Dumping data for table `kepek`
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
-- Table structure for table `kommentek`
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
-- Dumping data for table `kommentek`
--

INSERT INTO `kommentek` (`komment_id`, `felhasznalo_id`, `etterem_id`, `megjegyzes`, `letrehoz_ido`) VALUES
(1, NULL, 1, 'Kiváló ízek és barátságos kiszolgálás.', '2026-02-23 10:13:38'),
(2, NULL, 3, 'Túl sokat kellett várni, de az étel finom volt.', '2026-02-23 10:13:38'),
(3, NULL, 5, 'Hangulatos hely, visszatérünk még.', '2026-02-23 10:13:38'),
(4, NULL, 2, 'Az adagok kicsik voltak, de ízletesek.', '2026-02-23 10:13:38');

-- --------------------------------------------------------

--
-- Table structure for table `varosok`
--

DROP TABLE IF EXISTS `varosok`;
CREATE TABLE `varosok` (
  `iranyitoszam` int(4) NOT NULL,
  `varos` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `varosok`
--

INSERT INTO `varosok` (`iranyitoszam`, `varos`) VALUES
(1117, 'Budapest'),
(6720, 'Miskolc'),
(9022, 'Győr');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ertekelesek`
--
ALTER TABLE `ertekelesek`
  ADD PRIMARY KEY (`ertekeles_id`),
  ADD KEY `fk_felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `etterem_id` (`etterem_id`);

--
-- Indexes for table `ettermek`
--
ALTER TABLE `ettermek`
  ADD PRIMARY KEY (`etterem_id`),
  ADD KEY `iranyitoszam` (`iranyitoszam`),
  ADD KEY `FK_katgoria` (`kategoria_id`);

--
-- Indexes for table `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD PRIMARY KEY (`felhasznalo_id`);

--
-- Indexes for table `kategoriak`
--
ALTER TABLE `kategoriak`
  ADD PRIMARY KEY (`kategoria_id`);

--
-- Indexes for table `kedvencek`
--
ALTER TABLE `kedvencek`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `felhasznalo_id` (`felhasznalo_id`,`etterem_id`),
  ADD KEY `fk_kedvenc_etterem` (`etterem_id`);

--
-- Indexes for table `kepek`
--
ALTER TABLE `kepek`
  ADD PRIMARY KEY (`kep_id`),
  ADD KEY `fk_kepek_id` (`etterem_id`);

--
-- Indexes for table `kommentek`
--
ALTER TABLE `kommentek`
  ADD PRIMARY KEY (`komment_id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `etterem_id` (`etterem_id`);

--
-- Indexes for table `varosok`
--
ALTER TABLE `varosok`
  ADD PRIMARY KEY (`iranyitoszam`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ertekelesek`
--
ALTER TABLE `ertekelesek`
  MODIFY `ertekeles_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `ettermek`
--
ALTER TABLE `ettermek`
  MODIFY `etterem_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `felhasznalok`
--
ALTER TABLE `felhasznalok`
  MODIFY `felhasznalo_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `kategoriak`
--
ALTER TABLE `kategoriak`
  MODIFY `kategoria_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `kedvencek`
--
ALTER TABLE `kedvencek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `kepek`
--
ALTER TABLE `kepek`
  MODIFY `kep_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `kommentek`
--
ALTER TABLE `kommentek`
  MODIFY `komment_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ertekelesek`
--
ALTER TABLE `ertekelesek`
  ADD CONSTRAINT `ertekelesek_ibfk_1` FOREIGN KEY (`etterem_id`) REFERENCES `ettermek` (`etterem_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_felhasznalo_id` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE SET NULL;

--
-- Constraints for table `ettermek`
--
ALTER TABLE `ettermek`
  ADD CONSTRAINT `FK_katgoria` FOREIGN KEY (`kategoria_id`) REFERENCES `kategoriak` (`kategoria_id`),
  ADD CONSTRAINT `fk_varos` FOREIGN KEY (`iranyitoszam`) REFERENCES `varosok` (`iranyitoszam`);

--
-- Constraints for table `kedvencek`
--
ALTER TABLE `kedvencek`
  ADD CONSTRAINT `fk_kedvenc_etterem` FOREIGN KEY (`etterem_id`) REFERENCES `ettermek` (`etterem_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_kedvenc_user` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE CASCADE;

--
-- Constraints for table `kepek`
--
ALTER TABLE `kepek`
  ADD CONSTRAINT `fk_kepek_id` FOREIGN KEY (`etterem_id`) REFERENCES `ettermek` (`etterem_id`);

--
-- Constraints for table `kommentek`
--
ALTER TABLE `kommentek`
  ADD CONSTRAINT `kommentek_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `kommentek_ibfk_2` FOREIGN KEY (`etterem_id`) REFERENCES `ettermek` (`etterem_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
