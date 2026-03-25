using MySqlConnector;
using resrater_adminfelulet.Models;

namespace resrater_adminfelulet.DataAccess;

public class KommentRepository
{
    public async Task<List<Komment>> GetAllAsync(string? searchTerm = null)
    {
        var list = new List<Komment>();
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();

        var sql = @"SELECT k.komment_id, k.felhasznalo_id,
                           COALESCE(f.felhasznev,'Névtelen') AS felhasznev,
                           k.etterem_id, e.nev AS etterem_nev,
                           k.megjegyzes, k.letrehoz_ido
                    FROM kommentek k
                    JOIN ettermek e ON k.etterem_id = e.etterem_id
                    LEFT JOIN felhasznalok f ON k.felhasznalo_id = f.felhasznalo_id";
        if (!string.IsNullOrWhiteSpace(searchTerm))
            sql += " WHERE k.megjegyzes LIKE @s OR f.felhasznev LIKE @s OR e.nev LIKE @s";
        sql += " ORDER BY k.letrehoz_ido DESC";

        await using var cmd = new MySqlCommand(sql, conn);
        if (!string.IsNullOrWhiteSpace(searchTerm))
            cmd.Parameters.AddWithValue("@s", $"%{searchTerm}%");

        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            list.Add(new Komment
            {
                KommentId = reader.GetInt32("komment_id"),
                FelhasznaloId = reader.IsDBNull(reader.GetOrdinal("felhasznalo_id")) ? null : reader.GetInt32("felhasznalo_id"),
                FelhasznaloNev = reader.GetString("felhasznev"),
                EtteremId = reader.GetInt32("etterem_id"),
                EtteremNev = reader.GetString("etterem_nev"),
                Megjegyzes = reader.GetString("megjegyzes"),
                LetrehozIdo = reader.GetDateTime("letrehoz_ido")
            });
        }
        return list;
    }

    public async Task DeleteAsync(int id)
    {
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand("DELETE FROM kommentek WHERE komment_id = @id", conn);
        cmd.Parameters.AddWithValue("@id", id);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<int> GetCountAsync()
    {
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand("SELECT COUNT(*) FROM kommentek", conn);
        return Convert.ToInt32(await cmd.ExecuteScalarAsync());
    }

    public async Task<List<Komment>> GetRecentAsync(int count = 10)
    {
        var list = new List<Komment>();
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        var sql = @"SELECT k.komment_id, k.felhasznalo_id,
                           COALESCE(f.felhasznev,'Névtelen') AS felhasznev,
                           k.etterem_id, e.nev AS etterem_nev,
                           k.megjegyzes, k.letrehoz_ido
                    FROM kommentek k
                    JOIN ettermek e ON k.etterem_id = e.etterem_id
                    LEFT JOIN felhasznalok f ON k.felhasznalo_id = f.felhasznalo_id
                    ORDER BY k.letrehoz_ido DESC LIMIT @cnt";
        await using var cmd = new MySqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@cnt", count);
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            list.Add(new Komment
            {
                KommentId = reader.GetInt32("komment_id"),
                FelhasznaloId = reader.IsDBNull(reader.GetOrdinal("felhasznalo_id")) ? null : reader.GetInt32("felhasznalo_id"),
                FelhasznaloNev = reader.GetString("felhasznev"),
                EtteremId = reader.GetInt32("etterem_id"),
                EtteremNev = reader.GetString("etterem_nev"),
                Megjegyzes = reader.GetString("megjegyzes"),
                LetrehozIdo = reader.GetDateTime("letrehoz_ido")
            });
        }
        return list;
    }
}
