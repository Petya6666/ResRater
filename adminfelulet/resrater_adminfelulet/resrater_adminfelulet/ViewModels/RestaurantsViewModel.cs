using resrater_adminfelulet.Models;
using System.Collections.Generic;

// RestaurantsViewModel - provides data and operations for the Restaurants tab
namespace resrater_adminfelulet.ViewModels
{
    public class RestaurantsViewModel
    {
        // The list of restaurants currently displayed in the DataGrid
        public List<Restaurant> Restaurants { get; private set; } = new List<Restaurant>();

        // Load all restaurants from the database, optionally filtered by name
        public void LoadRestaurants(string search = "")
        {
            Restaurants = DatabaseHelper.GetAllRestaurants(search);
        }

        // Delete the restaurant with the given ID
        public void DeleteRestaurant(int restaurantId)
        {
            DatabaseHelper.DeleteRestaurant(restaurantId);
        }

        // Save changes to an existing restaurant
        public void UpdateRestaurant(Restaurant restaurant)
        {
            DatabaseHelper.UpdateRestaurant(restaurant);
        }

        // Add a brand new restaurant to the database
        public void AddRestaurant(Restaurant restaurant)
        {
            DatabaseHelper.AddRestaurant(restaurant);
        }

        // Flip the approved/disapproved status of a restaurant
        public void ToggleApproval(int restaurantId, bool currentStatus)
        {
            DatabaseHelper.ToggleRestaurantApproval(restaurantId, currentStatus);
        }
    }
}
