using resrater_adminfelulet.Models;
using resrater_adminfelulet.ViewModels;
using System;
using System.Windows;
using System.Windows.Controls;

// Code-behind for the Users tab UserControl
namespace resrater_adminfelulet.Views
{
    public partial class UsersTab : UserControl
    {
        // ViewModel that handles data loading and user operations
        private UsersViewModel viewModel = new UsersViewModel();

        public UsersTab()
        {
            InitializeComponent();
            // Load users when the control first appears
            this.Loaded += UsersTab_Loaded;
        }

        // Runs when the tab becomes visible for the first time
        private void UsersTab_Loaded(object sender, RoutedEventArgs e)
        {
            LoadUsers();
        }

        // Loads (or reloads) the user list into the DataGrid
        public void LoadUsers()
        {
            try
            {
                viewModel.LoadUsers(txtSearch.Text);
                // Bind the list to the DataGrid
                dgUsers.ItemsSource = viewModel.Users;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error loading users: " + ex.Message,
                                "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Called automatically whenever the text in the search box changes
        private void txtSearch_TextChanged(object sender, TextChangedEventArgs e)
        {
            LoadUsers();
        }

        // Refresh button - reloads users from the database
        private void btnRefresh_Click(object sender, RoutedEventArgs e)
        {
            LoadUsers();
        }

        // Delete User button - asks for confirmation then removes the selected user
        private void btnDeleteUser_Click(object sender, RoutedEventArgs e)
        {
            // Make sure a row is selected
            if (dgUsers.SelectedItem is not User selected)
            {
                MessageBox.Show("Please select a user first.",
                                "Warning", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            // Ask the admin to confirm the deletion
            var result = MessageBox.Show(
                $"Are you sure you want to delete user '{selected.Username}'?",
                "Confirm Delete",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);

            if (result == MessageBoxResult.Yes)
            {
                try
                {
                    viewModel.DeleteUser(selected.UserId);
                    MessageBox.Show("User deleted successfully.",
                                    "Success", MessageBoxButton.OK, MessageBoxImage.Information);
                    LoadUsers();
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Error deleting user: " + ex.Message,
                                    "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }
    }
}
