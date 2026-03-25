using resrater_adminfelulet.Models;
using resrater_adminfelulet.ViewModels;
using System;
using System.Windows;
using System.Windows.Controls;

// Code-behind for the Restaurants tab UserControl
namespace resrater_adminfelulet.Views
{
    public partial class RestaurantsTab : UserControl
    {
        // ViewModel that handles data loading and restaurant operations
        private RestaurantsViewModel viewModel = new RestaurantsViewModel();

        public RestaurantsTab()
        {
            InitializeComponent();
            // Load restaurants when the control first appears
            this.Loaded += RestaurantsTab_Loaded;
        }

        // Runs when the tab becomes visible for the first time
        private void RestaurantsTab_Loaded(object sender, RoutedEventArgs e)
        {
            LoadRestaurants();
        }

        // Loads (or reloads) the restaurant list into the DataGrid
        public void LoadRestaurants()
        {
            try
            {
                viewModel.LoadRestaurants(txtSearch.Text);
                // Bind the list to the DataGrid
                dgRestaurants.ItemsSource = viewModel.Restaurants;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error loading restaurants: " + ex.Message,
                                "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Clears all form fields
        private void ClearForm()
        {
            txtName.Text        = "";
            txtPhone.Text       = "";
            txtCategory.Text    = "";
            txtPostalCode.Text  = "";
            txtDescription.Text = "";
        }

        // When the user clicks a row, fill the form fields with that restaurant's data
        private void dgRestaurants_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (dgRestaurants.SelectedItem is Restaurant selected)
            {
                txtName.Text        = selected.Name;
                txtPhone.Text       = selected.Phone;
                txtCategory.Text    = selected.CategoryId.ToString();
                txtPostalCode.Text  = selected.PostalCode.ToString();
                txtDescription.Text = selected.Description;
            }
        }

        // Search box: reload filtered list on every keystroke
        private void txtSearch_TextChanged(object sender, TextChangedEventArgs e)
        {
            LoadRestaurants();
        }

        // Refresh button - reload from database
        private void btnRefresh_Click(object sender, RoutedEventArgs e)
        {
            LoadRestaurants();
        }

        // Add New Restaurant button - creates a restaurant from the form fields
        private void btnAddRestaurant_Click(object sender, RoutedEventArgs e)
        {
            // Validate required fields
            if (string.IsNullOrWhiteSpace(txtName.Text) ||
                string.IsNullOrWhiteSpace(txtPhone.Text))
            {
                MessageBox.Show("Name and Phone are required.",
                                "Warning", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            // Validate numeric fields
            if (!int.TryParse(txtCategory.Text, out int categoryId) ||
                !int.TryParse(txtPostalCode.Text, out int postalCode))
            {
                MessageBox.Show("Category ID and Postal Code must be numbers.",
                                "Warning", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            try
            {
                var newRestaurant = new Restaurant
                {
                    Name        = txtName.Text,
                    Phone       = txtPhone.Text,
                    Description = txtDescription.Text,
                    CategoryId  = categoryId,
                    PostalCode  = postalCode,
                    IsApproved  = false    // New restaurants are not approved by default
                };

                viewModel.AddRestaurant(newRestaurant);
                MessageBox.Show("Restaurant added successfully.",
                                "Success", MessageBoxButton.OK, MessageBoxImage.Information);
                ClearForm();
                LoadRestaurants();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error adding restaurant: " + ex.Message,
                                "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Edit Restaurant button - saves the form fields back to the selected restaurant
        private void btnEditRestaurant_Click(object sender, RoutedEventArgs e)
        {
            // Make sure a row is selected
            if (dgRestaurants.SelectedItem is not Restaurant selected)
            {
                MessageBox.Show("Please select a restaurant first.",
                                "Warning", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            // Validate required fields
            if (string.IsNullOrWhiteSpace(txtName.Text) ||
                string.IsNullOrWhiteSpace(txtPhone.Text))
            {
                MessageBox.Show("Name and Phone are required.",
                                "Warning", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (!int.TryParse(txtCategory.Text, out int categoryId) ||
                !int.TryParse(txtPostalCode.Text, out int postalCode))
            {
                MessageBox.Show("Category ID and Postal Code must be numbers.",
                                "Warning", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            try
            {
                // Update the selected restaurant's properties from the form
                selected.Name        = txtName.Text;
                selected.Phone       = txtPhone.Text;
                selected.Description = txtDescription.Text;
                selected.CategoryId  = categoryId;
                selected.PostalCode  = postalCode;

                viewModel.UpdateRestaurant(selected);
                MessageBox.Show("Restaurant updated successfully.",
                                "Success", MessageBoxButton.OK, MessageBoxImage.Information);
                ClearForm();
                LoadRestaurants();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error updating restaurant: " + ex.Message,
                                "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Approve/Disapprove button - flips the approval status
        private void btnToggleApproval_Click(object sender, RoutedEventArgs e)
        {
            if (dgRestaurants.SelectedItem is not Restaurant selected)
            {
                MessageBox.Show("Please select a restaurant first.",
                                "Warning", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            try
            {
                viewModel.ToggleApproval(selected.RestaurantId, selected.IsApproved);
                string newStatus = selected.IsApproved ? "disapproved" : "approved";
                MessageBox.Show($"Restaurant is now {newStatus}.",
                                "Success", MessageBoxButton.OK, MessageBoxImage.Information);
                LoadRestaurants();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error changing approval status: " + ex.Message,
                                "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Delete Restaurant button - asks for confirmation then removes the selected restaurant
        private void btnDeleteRestaurant_Click(object sender, RoutedEventArgs e)
        {
            if (dgRestaurants.SelectedItem is not Restaurant selected)
            {
                MessageBox.Show("Please select a restaurant first.",
                                "Warning", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            // Ask the admin to confirm before deleting
            var result = MessageBox.Show(
                $"Are you sure you want to delete '{selected.Name}'?",
                "Confirm Delete",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);

            if (result == MessageBoxResult.Yes)
            {
                try
                {
                    viewModel.DeleteRestaurant(selected.RestaurantId);
                    MessageBox.Show("Restaurant deleted successfully.",
                                    "Success", MessageBoxButton.OK, MessageBoxImage.Information);
                    ClearForm();
                    LoadRestaurants();
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Error deleting restaurant: " + ex.Message,
                                    "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }
    }
}
