// Restaurant model - stores data for a single restaurant
namespace resrater_adminfelulet.Models
{
    public class Restaurant
    {
        // Unique identifier
        public int RestaurantId { get; set; }

        // Restaurant name
        public string Name { get; set; } = "";

        // Phone number
        public string Phone { get; set; } = "";

        // Short description
        public string Description { get; set; } = "";

        // Category ID (foreign key to kategoriak table)
        public int CategoryId { get; set; }

        // Postal code (city identifier)
        public int PostalCode { get; set; }

        // Whether the restaurant is approved by an admin
        public bool IsApproved { get; set; }

        // Helper property for displaying approval status in the DataGrid
        public string IsApprovedText => IsApproved ? "Yes" : "No";
    }
}
