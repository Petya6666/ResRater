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
        // A bejelentkezett admin neve
        private readonly string _adminNev;

        // Konstruktor – fogadja a bejelentkezett admin felhasználónevét
        public MainWindow(string adminNev)
        {
            InitializeComponent();
            _adminNev = adminNev;

            // Megjeleníti az admin nevét a fejlécben, ha meg van adva
            if (!string.IsNullOrEmpty(_adminNev))
            {
                lblAdminNev.Text = $"Üdvözöljük, {_adminNev}!";
            }
        }

        // File → Exit menu item
        private void MenuExit_Click(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }

        // Kijelentkezés gomb: visszatér a bejelentkezési ablakhoz
        private void btnKijelentkezes_Click(object sender, RoutedEventArgs e)
        {
            var bejelentkezesAblak = new LoginWindow();
            bejelentkezesAblak.Show();
            this.Close();
        }
    }
}
