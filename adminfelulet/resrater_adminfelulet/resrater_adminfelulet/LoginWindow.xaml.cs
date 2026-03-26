using System.Windows;

// Bejelentkezési ablak kód – csak admin felhasználók léphetnek be
namespace resrater_adminfelulet
{
    public partial class LoginWindow : Window
    {
        public LoginWindow()
        {
            InitializeComponent();
        }

        // "Bejelentkezés" gomb megnyomásakor fut le
        private void btnBejelentkezes_Click(object sender, RoutedEventArgs e)
        {
            // Felhasználónév és jelszó kiolvasása a beviteli mezőkből
            string felhasznev = txtFelhasznev.Text.Trim();
            string jelszo = pwbJelszo.Password;

            // Egyszerű üres mező ellenőrzés
            if (string.IsNullOrEmpty(felhasznev) || string.IsNullOrEmpty(jelszo))
            {
                MutasdHibat("Kérjük, töltsd ki mindkét mezőt!");
                return;
            }

            // Adatbázis hitelesítés – az AdatbazisHelper végzi az ellenőrzést
            var eredmeny = AdatbazisHelper.AdminBejelentkezes(felhasznev, jelszo);

            if (eredmeny == BejelentkezesEredmeny.Sikeres)
            {
                // Sikeres bejelentkezés: nyisd meg a főablakot, majd zárd be ezt az ablakot
                var foablak = new MainWindow(felhasznev);
                foablak.Show();
                this.Close();
            }
            else if (eredmeny == BejelentkezesEredmeny.NemAdmin)
            {
                // A felhasználó létezik, de nem admin
                MutasdHibat("Csak adminok jelentkezhetnek be!");
                pwbJelszo.Clear();
            }
            else
            {
                // Hibás felhasználónév vagy jelszó
                MutasdHibat("Érvénytelen felhasználónév vagy jelszó!");
                pwbJelszo.Clear();
            }
        }

        // "Mégse" gomb: bezárja az alkalmazást
        private void btnMegse_Click(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }

        // Segéd metódus: megjeleníti a hibaüzenetet
        private void MutasdHibat(string uzenet)
        {
            lblHiba.Text = uzenet;
            lblHiba.Visibility = Visibility.Visible;
        }
    }
}
