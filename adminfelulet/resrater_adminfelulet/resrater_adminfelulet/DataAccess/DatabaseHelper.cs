using Microsoft.Extensions.Configuration;
using MySqlConnector;

namespace resrater_adminfelulet.DataAccess;

public class DatabaseHelper
{
    private static readonly string _connectionString;

    static DatabaseHelper()
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: true)
            .Build();

        _connectionString = config.GetConnectionString("ResRaterDb")
            ?? "Server=localhost;Port=3306;Database=resrater_db;User=root;Password=;CharSet=utf8mb4;";
    }

    public static string ConnectionString => _connectionString;

    public static MySqlConnection GetConnection()
    {
        return new MySqlConnection(_connectionString);
    }

    public static async Task<bool> TestConnectionAsync()
    {
        try
        {
            await using var conn = GetConnection();
            await conn.OpenAsync();
            return true;
        }
        catch
        {
            // Connection failed – caller receives false and shows appropriate UI feedback
            return false;
        }
    }
}
