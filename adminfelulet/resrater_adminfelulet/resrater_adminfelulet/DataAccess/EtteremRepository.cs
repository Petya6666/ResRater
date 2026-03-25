using MySqlConnector;
using resrater_adminfelulet.Models;

namespace resrater_adminfelulet.DataAccess;

public class EtteremRepository
{
    public async Task<List<Etterem>> GetAllAsync(string? searchTerm = null)
    {
        var list = new List<Etterem>();
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();

        var sql = @"SELECT e.etterem_id, e.nev, e.telefon, e.leiras, e.kategoria_id,
                           k.kategoria_nev, e.iranyitoszam, COALESCE(v.varos,'') AS varos, e.jovahagyott
                    FROM ettermek e
                    LEFT JOIN kategoriak k ON e.kategoria_id = k.kategoria_id
                    LEFT JOIN varosok v ON e.iranyitoszam = v.iranyitoszam";
        if (!string.IsNullOrWhiteSpace(searchTerm))
            sql += " WHERE e.nev LIKE @s OR k.kategoria_nev LIKE @s OR v.varos LIKE @s";
        sql += " ORDER BY e.etterem_id";

        await using var cmd = new MySqlCommand(sql, conn);
        if (!string.IsNullOrWhiteSpace(searchTerm))
            cmd.Parameters.AddWithValue("@s", $"%{searchTerm}%");

        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            list.Add(new Etterem
            {
                EtteremId = reader.GetInt32("etterem_id"),
                Nev = reader.GetString("nev"),
                Telefon = reader.GetString("telefon"),
                Leiras = reader.GetString("leiras"),
                KategoriaId = reader.GetInt32("kategoria_id"),
                KategoriaNev = reader.GetString("kategoria_nev"),
                Iranyitoszam = reader.GetInt32("iranyitoszam"),
                VarosNev = reader.GetString("varos"),
                Jovahagyott = reader.GetBoolean("jovahagyott")
            });
        }
        return list;
    }

    public async Task<List<Kategoria>> GetKategoriakAsync()
    {
        var list = new List<Kategoria>();
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand("SELECT kategoria_id, kategoria_nev FROM kategoriak ORDER BY kategoria_id", conn);
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            list.Add(new Kategoria { KategoriaId = reader.GetInt32(0), KategoriaNev = reader.GetString(1) });
        return list;
    }

    public async Task<List<Varos>> GetVarosokAsync()
    {
        var list = new List<Varos>();
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand("SELECT iranyitoszam, varos FROM varosok ORDER BY varos", conn);
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            list.Add(new Varos { Iranyitoszam = reader.GetInt32(0), VarosNev = reader.GetString(1) });
        return list;
    }

    public async Task InsertAsync(Etterem e)
    {
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand(
            @"INSERT INTO ettermek (nev, telefon, leiras, kategoria_id, iranyitoszam, jovahagyott)
              VALUES (@nev, @telefon, @leiras, @kat, @ir, @jov)", conn);
        cmd.Parameters.AddWithValue("@nev", e.Nev);
        cmd.Parameters.AddWithValue("@telefon", e.Telefon);
        cmd.Parameters.AddWithValue("@leiras", e.Leiras);
        cmd.Parameters.AddWithValue("@kat", e.KategoriaId);
        cmd.Parameters.AddWithValue("@ir", e.Iranyitoszam);
        cmd.Parameters.AddWithValue("@jov", e.Jovahagyott ? 1 : 0);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task UpdateAsync(Etterem e)
    {
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand(
            @"UPDATE ettermek SET nev=@nev, telefon=@telefon, leiras=@leiras,
              kategoria_id=@kat, iranyitoszam=@ir, jovahagyott=@jov
              WHERE etterem_id=@id", conn);
        cmd.Parameters.AddWithValue("@nev", e.Nev);
        cmd.Parameters.AddWithValue("@telefon", e.Telefon);
        cmd.Parameters.AddWithValue("@leiras", e.Leiras);
        cmd.Parameters.AddWithValue("@kat", e.KategoriaId);
        cmd.Parameters.AddWithValue("@ir", e.Iranyitoszam);
        cmd.Parameters.AddWithValue("@jov", e.Jovahagyott ? 1 : 0);
        cmd.Parameters.AddWithValue("@id", e.EtteremId);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task DeleteAsync(int id)
    {
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand("DELETE FROM ettermek WHERE etterem_id = @id", conn);
        cmd.Parameters.AddWithValue("@id", id);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task SetJovahagyottAsync(int id, bool jovahagyott)
    {
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand(
            "UPDATE ettermek SET jovahagyott = @jov WHERE etterem_id = @id", conn);
        cmd.Parameters.AddWithValue("@jov", jovahagyott ? 1 : 0);
        cmd.Parameters.AddWithValue("@id", id);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<int> GetCountAsync()
    {
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand("SELECT COUNT(*) FROM ettermek", conn);
        return Convert.ToInt32(await cmd.ExecuteScalarAsync());
    }

    public async Task<int> GetPendingCountAsync()
    {
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand("SELECT COUNT(*) FROM ettermek WHERE jovahagyott = 0", conn);
        return Convert.ToInt32(await cmd.ExecuteScalarAsync());
    }

    public async Task<Dictionary<string, int>> GetByKategoriaAsync()
    {
        var dict = new Dictionary<string, int>();
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand(
            @"SELECT k.kategoria_nev, COUNT(*) AS cnt
              FROM ettermek e JOIN kategoriak k ON e.kategoria_id = k.kategoria_id
              GROUP BY k.kategoria_nev", conn);
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            dict[reader.GetString(0)] = reader.GetInt32(1);
        return dict;
    }
}
