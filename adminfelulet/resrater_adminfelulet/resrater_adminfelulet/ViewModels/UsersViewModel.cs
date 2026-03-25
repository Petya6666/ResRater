using resrater_adminfelulet.Models;
using System.Collections.Generic;

// UsersViewModel - provides data and operations for the Users tab
namespace resrater_adminfelulet.ViewModels
{
    public class UsersViewModel
    {
        // The list of users currently displayed in the DataGrid
        public List<User> Users { get; private set; } = new List<User>();

        // Load all users from the database, optionally filtered by username
        public void LoadUsers(string search = "")
        {
            Users = DatabaseHelper.GetAllUsers(search);
        }

        // Delete the user with the given ID
        public void DeleteUser(int userId)
        {
            DatabaseHelper.DeleteUser(userId);
        }
    }
}
