using System.Windows;

// Main window code-behind - the window just hosts the tab control.
// All tab logic lives in the corresponding UserControl code-behind files:
//   Views/DashboardTab.xaml.cs
//   Views/UsersTab.xaml.cs
//   Views/RestaurantsTab.xaml.cs
namespace resrater_adminfelulet
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        // File → Exit menu item
        private void MenuExit_Click(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }
    }
}
