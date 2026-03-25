using MySql.Data.MySqlClient;
using resrater_adminfelulet.Models;
using System;
using System.Collections.Generic;

// Adatbázis segédosztály - minden adatbázis műveletet ez a class végez
namespace resrater_adminfelulet
{
    public static class AdatbazisHelper
    {
        // Kapcsolati sztring - localhost, port 3307, resrater_db adatbázis
        private static string kapcsolatiSztring =
            "Server=localhost;Port=3307;Database=resrater_db;Uid=root;Pwd=;CharSet=utf8mb4;";

        // =====================
        // FELHASZNÁLÓK
        // =====================

        // Összes felhasználó lekérése, opcionálisan szűrve felhasználónévre
        public static List<Felhasznalo> FelhasznalokLekeres(string kereses = "")
        {
            var lista = new List<Felhasznalo>();

            try
            {
                using var kapcsolat = new MySqlConnection(kapcsolatiSztring);
                kapcsolat.Open();

                // SQL lekérdezés - ha van keresési szöveg, szűrünk
                string sql = "SELECT felhasznalo_id, felhasznev, email, szerep, reg_datum FROM felhasznalok";
                if (!string.IsNullOrEmpty(kereses))
                {
                    sql += " WHERE felhasznev LIKE @kereses";
                }

                using var parancs = new MySqlCommand(sql, kapcsolat);
                if (!string.IsNullOrEmpty(kereses))
                {
                    parancs.Parameters.AddWithValue("@kereses", "%" + kereses + "%");
                }

                using var olvaso = parancs.ExecuteReader();
                while (olvaso.Read())
                {
                    lista.Add(new Felhasznalo
                    {
                        FelhasznaloId = olvaso.GetInt32("felhasznalo_id"),
                        Felhasznev = olvaso.GetString("felhasznev"),
                        Email = olvaso.GetString("email"),
                        Szerep = olvaso.GetString("szerep"),
                        RegDatum = olvaso["reg_datum"].ToString() ?? ""
                    });
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Hiba a felhasználók lekérésekor: " + ex.Message);
            }

            return lista;
        }

        // Felhasználó törlése ID alapján
        public static void FelhasznaloTorles(int felhasznaloId)
        {
            try
            {
                using var kapcsolat = new MySqlConnection(kapcsolatiSztring);
                kapcsolat.Open();

                string sql = "DELETE FROM felhasznalok WHERE felhasznalo_id = @id";
                using var parancs = new MySqlCommand(sql, kapcsolat);
                parancs.Parameters.AddWithValue("@id", felhasznaloId);
                parancs.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception("Hiba a felhasználó törlésekor: " + ex.Message);
            }
        }

        // Felhasználó szerepkörének módosítása
        public static void FelhasznaloSzerepModositas(int felhasznaloId, string ujSzerep)
        {
            try
            {
                using var kapcsolat = new MySqlConnection(kapcsolatiSztring);
                kapcsolat.Open();

                string sql = "UPDATE felhasznalok SET szerep = @szerep WHERE felhasznalo_id = @id";
                using var parancs = new MySqlCommand(sql, kapcsolat);
                parancs.Parameters.AddWithValue("@szerep", ujSzerep);
                parancs.Parameters.AddWithValue("@id", felhasznaloId);
                parancs.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception("Hiba a szerepkör módosításakor: " + ex.Message);
            }
        }

        // =====================
        // ÉTTERMEK
        // =====================

        // Összes étterem lekérése
        public static List<Etterem> EttermekLekeres()
        {
            var lista = new List<Etterem>();

            try
            {
                using var kapcsolat = new MySqlConnection(kapcsolatiSztring);
                kapcsolat.Open();

                string sql = "SELECT etterem_id, nev, telefon, leiras, kategoria_id, iranyitoszam, jovahagyott FROM ettermek";
                using var parancs = new MySqlCommand(sql, kapcsolat);
                using var olvaso = parancs.ExecuteReader();

                while (olvaso.Read())
                {
                    lista.Add(new Etterem
                    {
                        EtteremId = olvaso.GetInt32("etterem_id"),
                        Nev = olvaso.GetString("nev"),
                        Telefon = olvaso.GetString("telefon"),
                        Leiras = olvaso.GetString("leiras"),
                        KategoriaId = olvaso.GetInt32("kategoria_id"),
                        Iranyitoszam = olvaso.GetInt32("iranyitoszam"),
                        Jovahagyott = olvaso.GetBoolean("jovahagyott")
                    });
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Hiba az éttermek lekérésekor: " + ex.Message);
            }

            return lista;
        }

        // Új étterem hozzáadása
        public static void EtteremHozzaadas(Etterem etterem)
        {
            try
            {
                using var kapcsolat = new MySqlConnection(kapcsolatiSztring);
                kapcsolat.Open();

                string sql = @"INSERT INTO ettermek (nev, telefon, leiras, kategoria_id, iranyitoszam, jovahagyott)
                               VALUES (@nev, @telefon, @leiras, @kategoria, @iranyitoszam, @jovahagyott)";
                using var parancs = new MySqlCommand(sql, kapcsolat);
                parancs.Parameters.AddWithValue("@nev", etterem.Nev);
                parancs.Parameters.AddWithValue("@telefon", etterem.Telefon);
                parancs.Parameters.AddWithValue("@leiras", etterem.Leiras);
                parancs.Parameters.AddWithValue("@kategoria", etterem.KategoriaId);
                parancs.Parameters.AddWithValue("@iranyitoszam", etterem.Iranyitoszam);
                parancs.Parameters.AddWithValue("@jovahagyott", etterem.Jovahagyott ? 1 : 0);
                parancs.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception("Hiba az étterem hozzáadásakor: " + ex.Message);
            }
        }

        // Étterem adatainak módosítása
        public static void EtteremModositas(Etterem etterem)
        {
            try
            {
                using var kapcsolat = new MySqlConnection(kapcsolatiSztring);
                kapcsolat.Open();

                string sql = @"UPDATE ettermek SET nev=@nev, telefon=@telefon, leiras=@leiras,
                               kategoria_id=@kategoria, iranyitoszam=@iranyitoszam, jovahagyott=@jovahagyott
                               WHERE etterem_id=@id";
                using var parancs = new MySqlCommand(sql, kapcsolat);
                parancs.Parameters.AddWithValue("@nev", etterem.Nev);
                parancs.Parameters.AddWithValue("@telefon", etterem.Telefon);
                parancs.Parameters.AddWithValue("@leiras", etterem.Leiras);
                parancs.Parameters.AddWithValue("@kategoria", etterem.KategoriaId);
                parancs.Parameters.AddWithValue("@iranyitoszam", etterem.Iranyitoszam);
                parancs.Parameters.AddWithValue("@jovahagyott", etterem.Jovahagyott ? 1 : 0);
                parancs.Parameters.AddWithValue("@id", etterem.EtteremId);
                parancs.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception("Hiba az étterem módosításakor: " + ex.Message);
            }
        }

        // Étterem törlése ID alapján
        public static void EtteremTorles(int etteremId)
        {
            try
            {
                using var kapcsolat = new MySqlConnection(kapcsolatiSztring);
                kapcsolat.Open();

                string sql = "DELETE FROM ettermek WHERE etterem_id = @id";
                using var parancs = new MySqlCommand(sql, kapcsolat);
                parancs.Parameters.AddWithValue("@id", etteremId);
                parancs.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception("Hiba az étterem törlésekor: " + ex.Message);
            }
        }

        // Étterem jóváhagyás állapotának megfordítása
        public static void EtteremJovahagyasValt(int etteremId, bool jelenlegiAllapot)
        {
            try
            {
                using var kapcsolat = new MySqlConnection(kapcsolatiSztring);
                kapcsolat.Open();

                int ujErtek = jelenlegiAllapot ? 0 : 1;
                string sql = "UPDATE ettermek SET jovahagyott = @jovahagyott WHERE etterem_id = @id";
                using var parancs = new MySqlCommand(sql, kapcsolat);
                parancs.Parameters.AddWithValue("@jovahagyott", ujErtek);
                parancs.Parameters.AddWithValue("@id", etteremId);
                parancs.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception("Hiba a jóváhagyás módosításakor: " + ex.Message);
            }
        }

        // =====================
        // DASHBOARD STATISZTIKÁK
        // =====================

        // Felhasználók száma
        public static int FelhasznalokSzama()
        {
            return EgyszamLekeres("SELECT COUNT(*) FROM felhasznalok");
        }

        // Éttermek száma
        public static int EttermekSzama()
        {
            return EgyszamLekeres("SELECT COUNT(*) FROM ettermek");
        }

        // Értékelések száma
        public static int ErtekelesekSzama()
        {
            return EgyszamLekeres("SELECT COUNT(*) FROM ertekelesek");
        }

        // Kommentek száma
        public static int KommentekSzama()
        {
            return EgyszamLekeres("SELECT COUNT(*) FROM kommentek");
        }

        // Segéd metódus: egyetlen szám lekérése SQL-ből
        private static int EgyszamLekeres(string sql)
        {
            try
            {
                using var kapcsolat = new MySqlConnection(kapcsolatiSztring);
                kapcsolat.Open();
                using var parancs = new MySqlCommand(sql, kapcsolat);
                return Convert.ToInt32(parancs.ExecuteScalar());
            }
            catch
            {
                return 0;
            }
        }
    }
}
