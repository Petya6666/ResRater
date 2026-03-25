using resrater_adminfelulet.Models;

// DashboardViewModel - holds the statistics shown on the Dashboard tab
namespace resrater_adminfelulet.ViewModels
{
    public class DashboardViewModel
    {
        // Total number of registered users
        public int TotalUsers { get; set; }

        // Total number of restaurants in the database
        public int TotalRestaurants { get; set; }

        // Total number of ratings submitted
        public int TotalRatings { get; set; }

        // Total number of comments submitted
        public int TotalComments { get; set; }

        // Loads all statistics from the database
        public void LoadStats()
        {
            TotalUsers       = DatabaseHelper.GetUserCount();
            TotalRestaurants = DatabaseHelper.GetRestaurantCount();
            TotalRatings     = DatabaseHelper.GetRatingCount();
            TotalComments    = DatabaseHelper.GetCommentCount();
        }
    }
}
