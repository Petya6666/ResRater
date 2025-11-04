-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1:3307
-- Létrehozás ideje: 2025. Nov 03. 10:07
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

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ertekelesek`
--

CREATE TABLE `ertekelesek` (
  `ertekeles_id` int(11) NOT NULL,
  `etterem_id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `pontszam` tinyint(4) NOT NULL,
  `megjegyzes` text NOT NULL,
  `datum` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ettermek`
--

CREATE TABLE `ettermek` (
  `etterem_id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `varos` varchar(100) NOT NULL,
  `iranyitoszam` varchar(10) NOT NULL,
  `telefon` varchar(20) NOT NULL,
  `weboldal` varchar(150) NOT NULL,
  `leiras` text NOT NULL,
  `kategoria_id` int(11) NOT NULL,
  `atlag_ertekeles` decimal(3,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `ettermek`
--

INSERT INTO `ettermek` (`etterem_id`, `nev`, `varos`, `iranyitoszam`, `telefon`, `weboldal`, `leiras`, `kategoria_id`, `atlag_ertekeles`) VALUES
(1, 'KFC', 'Budapest', '1188', '+365148769', 'https://valami', 'jkdfghudsgfidsufmlsdjngjvdf', 2, 4.00),
(2, 'csárda', 'Inárcs', '2365', '+3642069', 'nincs', 'van', 1, 2.00);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

CREATE TABLE `felhasznalok` (
  `felhasznalo_id` int(10) NOT NULL,
  `felhasznev` varchar(25) NOT NULL,
  `jelszo` int(50) NOT NULL,
  `e-mail` varchar(20) NOT NULL,
  `reg_datum` date NOT NULL,
  `szerep` enum('felhasznalo','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoriak`
--

CREATE TABLE `kategoriak` (
  `kategoria_id` int(11) NOT NULL,
  `nev` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `kategoriak`
--

INSERT INTO `kategoriak` (`kategoria_id`, `nev`) VALUES
(1, 'lassúétterem'),
(2, 'gyorsétterem');

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

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `velemenyek`
--

CREATE TABLE `velemenyek` (
  `velemeny_id` int(5) NOT NULL DEFAULT 5,
  `velemeny_datum` date NOT NULL,
  `velemeny_nev` varchar(2) NOT NULL DEFAULT '2',
  `velemeny_str` varchar(10) CHARACTER SET utf16 COLLATE utf16_hungarian_ci NOT NULL DEFAULT '10'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `ettermek`
--
ALTER TABLE `ettermek`
  ADD PRIMARY KEY (`etterem_id`);

--
-- A tábla indexei `kategoriak`
--
ALTER TABLE `kategoriak`
  ADD PRIMARY KEY (`kategoria_id`);

--
-- A tábla indexei `kepek`
--
ALTER TABLE `kepek`
  ADD PRIMARY KEY (`kep_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
