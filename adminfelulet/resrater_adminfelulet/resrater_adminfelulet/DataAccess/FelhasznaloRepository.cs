using MySqlConnector;
using resrater_adminfelulet.Models;

namespace resrater_adminfelulet.DataAccess;

public class FelhasznaloRepository
{
    public async Task<List<Felhasznalo>> GetAllAsync(string? searchTerm = null)
    {
        var list = new List<Felhasznalo>();
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();

        var sql = "SELECT felhasznalo_id, felhasznev, email, reg_datum, szerep FROM felhasznalok";
        if (!string.IsNullOrWhiteSpace(searchTerm))
            sql += " WHERE felhasznev LIKE @s OR email LIKE @s";
        sql += " ORDER BY felhasznalo_id";

        await using var cmd = new MySqlCommand(sql, conn);
        if (!string.IsNullOrWhiteSpace(searchTerm))
            cmd.Parameters.AddWithValue("@s", $"%{searchTerm}%");

        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            list.Add(new Felhasznalo
            {
                FelhasznaloId = reader.GetInt32("felhasznalo_id"),
                Felhasznev = reader.GetString("felhasznev"),
                Email = reader.GetString("email"),
                RegDatum = reader.GetDateTime("reg_datum"),
                Szerep = reader.GetString("szerep")
            });
        }
        return list;
    }

    public async Task UpdateSzerepAsync(int id, string szerep)
    {
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand(
            "UPDATE felhasznalok SET szerep = @szerep WHERE felhasznalo_id = @id", conn);
        cmd.Parameters.AddWithValue("@szerep", szerep);
        cmd.Parameters.AddWithValue("@id", id);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task DeleteAsync(int id)
    {
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand(
            "DELETE FROM felhasznalok WHERE felhasznalo_id = @id", conn);
        cmd.Parameters.AddWithValue("@id", id);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<int> GetCountAsync()
    {
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand("SELECT COUNT(*) FROM felhasznalok", conn);
        return Convert.ToInt32(await cmd.ExecuteScalarAsync());
    }
}
