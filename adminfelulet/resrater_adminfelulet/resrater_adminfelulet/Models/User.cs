// User model - stores data for a single user
namespace resrater_adminfelulet.Models
{
    public class User
    {
        // Unique identifier
        public int UserId { get; set; }

        // Login name
        public string Username { get; set; } = "";

        // Email address
        public string Email { get; set; } = "";

        // Date when the user registered
        public string RegistrationDate { get; set; } = "";

        // Role: "felhasznalo" (regular user) or "admin"
        public string Role { get; set; } = "felhasznalo";
    }
}
