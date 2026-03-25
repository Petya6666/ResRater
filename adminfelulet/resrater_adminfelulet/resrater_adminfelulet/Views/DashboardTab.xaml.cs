using resrater_adminfelulet.ViewModels;
using System;
using System.Windows;
using System.Windows.Controls;

// Code-behind for the Dashboard tab UserControl
namespace resrater_adminfelulet.Views
{
    public partial class DashboardTab : UserControl
    {
        // ViewModel that holds the statistics data
        private DashboardViewModel viewModel = new DashboardViewModel();

        public DashboardTab()
        {
            InitializeComponent();
            // Load stats when the control is displayed
            this.Loaded += DashboardTab_Loaded;
        }

        // Runs when the tab becomes visible for the first time
        private void DashboardTab_Loaded(object sender, RoutedEventArgs e)
        {
            LoadStatistics();
        }

        // Fetches statistics from the database and updates the TextBlocks
        public void LoadStatistics()
        {
            try
            {
                viewModel.LoadStats();

                // Update each statistic card with the value from the ViewModel
                txtTotalUsers.Text       = viewModel.TotalUsers.ToString();
                txtTotalRestaurants.Text = viewModel.TotalRestaurants.ToString();
                txtTotalRatings.Text     = viewModel.TotalRatings.ToString();
                txtTotalComments.Text    = viewModel.TotalComments.ToString();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error loading statistics: " + ex.Message,
                                "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}
