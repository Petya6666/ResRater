using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

// DatabaseHelper - handles all database operations for the admin panel
namespace resrater_adminfelulet.Models
{
    public static class DatabaseHelper
    {
        // Connection string - adjust username/password if needed
        private static string connectionString =
            "Server=localhost;Port=3307;Database=resrater_db;Uid=root;Pwd=;CharSet=utf8mb4;";


        // Get all users, optionally filtered by username search term
        public static List<User> GetAllUsers(string search = "")
        {
            var list = new List<User>();

            try
            {
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                // Build the query - add a WHERE clause only if search text is provided
                string sql = "SELECT felhasznalo_id, felhasznev, email, szerep, reg_datum FROM felhasznalok";
                if (!string.IsNullOrEmpty(search))
                {
                    sql += " WHERE felhasznev LIKE @search";
                }

                using var command = new MySqlCommand(sql, connection);
                if (!string.IsNullOrEmpty(search))
                {
                    command.Parameters.AddWithValue("@search", "%" + search + "%");
                }

                using var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    list.Add(new User
                    {
                        UserId           = reader.GetInt32("felhasznalo_id"),
                        Username         = reader.GetString("felhasznev"),
                        Email            = reader.GetString("email"),
                        Role             = reader.GetString("szerep"),
                        RegistrationDate = reader["reg_datum"].ToString() ?? ""
                    });
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error loading users: " + ex.Message);
            }

            return list;
        }

        // Delete a user by their ID
        public static void DeleteUser(int userId)
        {
            try
            {
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string sql = "DELETE FROM felhasznalok WHERE felhasznalo_id = @id";
                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@id", userId);
                command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting user: " + ex.Message);
            }
        }


        // Get all restaurants, optionally filtered by name
        public static List<Restaurant> GetAllRestaurants(string search = "")
        {
            var list = new List<Restaurant>();

            try
            {
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string sql = "SELECT etterem_id, nev, telefon, leiras, kategoria_id, iranyitoszam, jovahagyott FROM ettermek";
                if (!string.IsNullOrEmpty(search))
                {
                    sql += " WHERE nev LIKE @search";
                }

                using var command = new MySqlCommand(sql, connection);
                if (!string.IsNullOrEmpty(search))
                {
                    command.Parameters.AddWithValue("@search", "%" + search + "%");
                }

                using var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    list.Add(new Restaurant
                    {
                        RestaurantId = reader.GetInt32("etterem_id"),
                        Name         = reader.GetString("nev"),
                        Phone        = reader.GetString("telefon"),
                        Description  = reader.GetString("leiras"),
                        CategoryId   = reader.GetInt32("kategoria_id"),
                        PostalCode   = reader.GetInt32("iranyitoszam"),
                        IsApproved   = reader.GetBoolean("jovahagyott")
                    });
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error loading restaurants: " + ex.Message);
            }

            return list;
        }

        // Delete a restaurant by its ID
        public static void DeleteRestaurant(int restaurantId)
        {
            try
            {
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string sql = "DELETE FROM ettermek WHERE etterem_id = @id";
                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@id", restaurantId);
                command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting restaurant: " + ex.Message);
            }
        }

        // Update an existing restaurant's details
        public static void UpdateRestaurant(Restaurant restaurant)
        {
            try
            {
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string sql = @"UPDATE ettermek
                               SET nev          = @name,
                                   telefon      = @phone,
                                   leiras       = @description,
                                   kategoria_id = @categoryId,
                                   iranyitoszam = @postalCode,
                                   jovahagyott  = @isApproved
                               WHERE etterem_id = @id";

                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@name",        restaurant.Name);
                command.Parameters.AddWithValue("@phone",       restaurant.Phone);
                command.Parameters.AddWithValue("@description", restaurant.Description);
                command.Parameters.AddWithValue("@categoryId",  restaurant.CategoryId);
                command.Parameters.AddWithValue("@postalCode",  restaurant.PostalCode);
                command.Parameters.AddWithValue("@isApproved",  restaurant.IsApproved ? 1 : 0);
                command.Parameters.AddWithValue("@id",          restaurant.RestaurantId);
                command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating restaurant: " + ex.Message);
            }
        }

        // Add a new restaurant to the database
        public static void AddRestaurant(Restaurant restaurant)
        {
            try
            {
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                string sql = @"INSERT INTO ettermek (nev, telefon, leiras, kategoria_id, iranyitoszam, jovahagyott)
                               VALUES (@name, @phone, @description, @categoryId, @postalCode, @isApproved)";

                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@name",        restaurant.Name);
                command.Parameters.AddWithValue("@phone",       restaurant.Phone);
                command.Parameters.AddWithValue("@description", restaurant.Description);
                command.Parameters.AddWithValue("@categoryId",  restaurant.CategoryId);
                command.Parameters.AddWithValue("@postalCode",  restaurant.PostalCode);
                command.Parameters.AddWithValue("@isApproved",  restaurant.IsApproved ? 1 : 0);
                command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding restaurant: " + ex.Message);
            }
        }

        // Toggle the approval status of a restaurant
        public static void ToggleRestaurantApproval(int restaurantId, bool currentStatus)
        {
            try
            {
                using var connection = new MySqlConnection(connectionString);
                connection.Open();

                int newValue = currentStatus ? 0 : 1;
                string sql = "UPDATE ettermek SET jovahagyott = @approved WHERE etterem_id = @id";
                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@approved", newValue);
                command.Parameters.AddWithValue("@id",       restaurantId);
                command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw new Exception("Error toggling approval: " + ex.Message);
            }
        }


        // Returns the total number of users
        public static int GetUserCount()
        {
            return GetScalarInt("SELECT COUNT(*) FROM felhasznalok");
        }

        // Returns the total number of restaurants
        public static int GetRestaurantCount()
        {
            return GetScalarInt("SELECT COUNT(*) FROM ettermek");
        }

        // Returns the total number of ratings
        public static int GetRatingCount()
        {
            return GetScalarInt("SELECT COUNT(*) FROM ertekelesek");
        }

        // Returns the total number of comments
        public static int GetCommentCount()
        {
            return GetScalarInt("SELECT COUNT(*) FROM kommentek");
        }

        // Helper: runs a SQL query that returns a single integer value
        // Returns 0 on any error (e.g. table missing, no connection) - safe for count queries
        private static int GetScalarInt(string sql)
        {
            try
            {
                using var connection = new MySqlConnection(connectionString);
                connection.Open();
                using var command = new MySqlCommand(sql, connection);
                return Convert.ToInt32(command.ExecuteScalar());
            }
            catch
            {
                return 0;
            }
        }
    }
}
