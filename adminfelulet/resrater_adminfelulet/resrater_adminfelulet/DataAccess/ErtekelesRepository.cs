using MySqlConnector;
using resrater_adminfelulet.Models;

namespace resrater_adminfelulet.DataAccess;

public class ErtekelesRepository
{
    public async Task<List<Ertekeles>> GetAllAsync()
    {
        var list = new List<Ertekeles>();
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();

        var sql = @"SELECT er.ertekeles_id, er.etterem_id, e.nev AS etterem_nev,
                           er.felhasznalo_id, COALESCE(f.felhasznev,'Névtelen') AS felhasznev,
                           er.atlag, er.datum, er.etelminoseg, er.kiszolgalas, er.hangulat
                    FROM ertekelesek er
                    JOIN ettermek e ON er.etterem_id = e.etterem_id
                    LEFT JOIN felhasznalok f ON er.felhasznalo_id = f.felhasznalo_id
                    ORDER BY er.datum DESC";

        await using var cmd = new MySqlCommand(sql, conn);
        await using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            list.Add(new Ertekeles
            {
                ErtekelesId = reader.GetInt32("ertekeles_id"),
                EtteremId = reader.GetInt32("etterem_id"),
                EtteremNev = reader.GetString("etterem_nev"),
                FelhasznaloId = reader.IsDBNull(reader.GetOrdinal("felhasznalo_id")) ? null : reader.GetInt32("felhasznalo_id"),
                FelhasznaloNev = reader.GetString("felhasznev"),
                Atlag = reader.GetDecimal("atlag"),
                Datum = reader.GetDateTime("datum"),
                Etelminoseg = reader.GetInt32("etelminoseg"),
                Kiszolgalas = reader.GetInt32("kiszolgalas"),
                Hangulat = reader.GetInt32("hangulat")
            });
        }
        return list;
    }

    public async Task DeleteAsync(int id)
    {
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand("DELETE FROM ertekelesek WHERE ertekeles_id = @id", conn);
        cmd.Parameters.AddWithValue("@id", id);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<int> GetCountAsync()
    {
        await using var conn = DatabaseHelper.GetConnection();
        await conn.OpenAsync();
        await using var cmd = new MySqlCommand("SELECT COUNT(*) FROM ertekelesek", conn);
        return Convert.ToInt32(await cmd.ExecuteScalarAsync());
    }
}
