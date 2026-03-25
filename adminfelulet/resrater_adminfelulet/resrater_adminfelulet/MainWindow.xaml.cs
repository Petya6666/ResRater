using resrater_adminfelulet.Models;
using System;
using System.Windows;
using System.Windows.Controls;

// Főablak kód - itt van az összes gomb és eseménykezelő logika
namespace resrater_adminfelulet
{
    public partial class MainWindow : Window
    {
        // Az ablak megnyitásakor fut le
        public MainWindow()
        {
            InitializeComponent();
            // Az ablak betöltésekor töltjük be az adatokat
            this.Loaded += MainWindow_Loaded;
        }

        // Betöltéskor fut le - betölti az összes adatot
        private void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            DashboardFrissit();
            FelhasznalokBetoltes();
            EttermekBetoltes();
        }

        // =====================
        // DASHBOARD
        // =====================

        // Dashboard statisztikák frissítése
        private void DashboardFrissit()
        {
            try
            {
                txtFelhasznalokSzama.Text = AdatbazisHelper.FelhasznalokSzama().ToString();
                txtEttermekSzama.Text = AdatbazisHelper.EttermekSzama().ToString();
                txtErtekelesekSzama.Text = AdatbazisHelper.ErtekelesekSzama().ToString();
                txtKommentekSzama.Text = AdatbazisHelper.KommentekSzama().ToString();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba a statisztikák betöltésekor: " + ex.Message, "Hiba",
                                MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // =====================
        // FELHASZNÁLÓK
        // =====================

        // Felhasználók betöltése a táblázatba
        private void FelhasznalokBetoltes(string kereses = "")
        {
            try
            {
                var lista = AdatbazisHelper.FelhasznalokLekeres(kereses);
                dgFelhasznalok.ItemsSource = lista;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba a felhasználók betöltésekor: " + ex.Message, "Hiba",
                                MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Keresés szöveg változásakor szűr
        private void txtFelhasznaloKereses_TextChanged(object sender, TextChangedEventArgs e)
        {
            FelhasznalokBetoltes(txtFelhasznaloKereses.Text);
        }

        // Frissítés gomb megnyomásakor
        private void btnFelhasznalokFrissit_Click(object sender, RoutedEventArgs e)
        {
            FelhasznalokBetoltes(txtFelhasznaloKereses.Text);
            DashboardFrissit();
        }

        // Szerepkör váltása (felhasznalo <-> admin)
        private void btnSzerepValt_Click(object sender, RoutedEventArgs e)
        {
            // Ellenőrizzük, hogy van-e kijelölt felhasználó
            if (dgFelhasznalok.SelectedItem is not Felhasznalo kivalasztott)
            {
                MessageBox.Show("Kérjük, jelöljön ki egy felhasználót!", "Figyelem",
                                MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            // Megfordítjuk a szerepkört
            string ujSzerep = kivalasztott.Szerep == "admin" ? "felhasznalo" : "admin";

            try
            {
                AdatbazisHelper.FelhasznaloSzerepModositas(kivalasztott.FelhasznaloId, ujSzerep);
                MessageBox.Show($"A szerepkör sikeresen módosítva: {ujSzerep}", "Siker",
                                MessageBoxButton.OK, MessageBoxImage.Information);
                FelhasznalokBetoltes(txtFelhasznaloKereses.Text);
                DashboardFrissit();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba: " + ex.Message, "Hiba",
                                MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Felhasználó törlése megerősítéssel
        private void btnFelhasznaloTorles_Click(object sender, RoutedEventArgs e)
        {
            // Ellenőrizzük, hogy van-e kijelölt felhasználó
            if (dgFelhasznalok.SelectedItem is not Felhasznalo kivalasztott)
            {
                MessageBox.Show("Kérjük, jelöljön ki egy felhasználót!", "Figyelem",
                                MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            // Megerősítés kérése törlés előtt
            var eredmeny = MessageBox.Show(
                $"Biztosan törli a(z) '{kivalasztott.Felhasznev}' felhasználót?",
                "Törlés megerősítése",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);

            if (eredmeny == MessageBoxResult.Yes)
            {
                try
                {
                    AdatbazisHelper.FelhasznaloTorles(kivalasztott.FelhasznaloId);
                    MessageBox.Show("Felhasználó sikeresen törölve!", "Siker",
                                    MessageBoxButton.OK, MessageBoxImage.Information);
                    FelhasznalokBetoltes(txtFelhasznaloKereses.Text);
                    DashboardFrissit();
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Hiba: " + ex.Message, "Hiba",
                                    MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }

        // =====================
        // ÉTTERMEK
        // =====================

        // Éttermek betöltése a táblázatba
        private void EttermekBetoltes()
        {
            try
            {
                var lista = AdatbazisHelper.EttermekLekeres();
                dgEttermek.ItemsSource = lista;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba az éttermek betöltésekor: " + ex.Message, "Hiba",
                                MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Új étterem hozzáadása a form adatai alapján
        private void btnEtteremHozzaad_Click(object sender, RoutedEventArgs e)
        {
            // Alap ellenőrzés - kötelező mezők
            if (string.IsNullOrWhiteSpace(txtEtteremNev.Text) ||
                string.IsNullOrWhiteSpace(txtEtteremTelefon.Text))
            {
                MessageBox.Show("A név és telefon mezők kitöltése kötelező!", "Figyelem",
                                MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            // Számok ellenőrzése
            if (!int.TryParse(txtEtteremKategoria.Text, out int kategoriaId) ||
                !int.TryParse(txtEtteremIranyitoszam.Text, out int iranyitoszam))
            {
                MessageBox.Show("A kategória ID és irányítószám csak szám lehet!", "Figyelem",
                                MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            try
            {
                var ujEtterem = new Etterem
                {
                    Nev = txtEtteremNev.Text,
                    Telefon = txtEtteremTelefon.Text,
                    Leiras = txtEtteremLeiras.Text,
                    KategoriaId = kategoriaId,
                    Iranyitoszam = iranyitoszam,
                    Jovahagyott = false  // Alapból nem jóváhagyott
                };

                AdatbazisHelper.EtteremHozzaadas(ujEtterem);
                MessageBox.Show("Étterem sikeresen hozzáadva!", "Siker",
                                MessageBoxButton.OK, MessageBoxImage.Information);
                FormMezo_Torol();
                EttermekBetoltes();
                DashboardFrissit();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba: " + ex.Message, "Hiba",
                                MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Kijelölt étterem szerkesztése
        private void btnEtteremSzerkeszt_Click(object sender, RoutedEventArgs e)
        {
            // Ellenőrizzük, hogy van-e kijelölt étterem
            if (dgEttermek.SelectedItem is not Etterem kivalasztott)
            {
                MessageBox.Show("Kérjük, jelöljön ki egy éttermet!", "Figyelem",
                                MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            // Alap ellenőrzés
            if (string.IsNullOrWhiteSpace(txtEtteremNev.Text) ||
                string.IsNullOrWhiteSpace(txtEtteremTelefon.Text))
            {
                MessageBox.Show("A név és telefon mezők kitöltése kötelező!", "Figyelem",
                                MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (!int.TryParse(txtEtteremKategoria.Text, out int kategoriaId) ||
                !int.TryParse(txtEtteremIranyitoszam.Text, out int iranyitoszam))
            {
                MessageBox.Show("A kategória ID és irányítószám csak szám lehet!", "Figyelem",
                                MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            try
            {
                kivalasztott.Nev = txtEtteremNev.Text;
                kivalasztott.Telefon = txtEtteremTelefon.Text;
                kivalasztott.Leiras = txtEtteremLeiras.Text;
                kivalasztott.KategoriaId = kategoriaId;
                kivalasztott.Iranyitoszam = iranyitoszam;

                AdatbazisHelper.EtteremModositas(kivalasztott);
                MessageBox.Show("Étterem sikeresen módosítva!", "Siker",
                                MessageBoxButton.OK, MessageBoxImage.Information);
                FormMezo_Torol();
                EttermekBetoltes();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba: " + ex.Message, "Hiba",
                                MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Jóváhagyás állapotának váltása
        private void btnJovahagyasValt_Click(object sender, RoutedEventArgs e)
        {
            if (dgEttermek.SelectedItem is not Etterem kivalasztott)
            {
                MessageBox.Show("Kérjük, jelöljön ki egy éttermet!", "Figyelem",
                                MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            try
            {
                AdatbazisHelper.EtteremJovahagyasValt(kivalasztott.EtteremId, kivalasztott.Jovahagyott);
                string ujAllapot = kivalasztott.Jovahagyott ? "nem jóváhagyott" : "jóváhagyott";
                MessageBox.Show($"Az étterem állapota megváltozott: {ujAllapot}", "Siker",
                                MessageBoxButton.OK, MessageBoxImage.Information);
                EttermekBetoltes();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba: " + ex.Message, "Hiba",
                                MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // Étterem törlése megerősítéssel
        private void btnEtteremTorles_Click(object sender, RoutedEventArgs e)
        {
            if (dgEttermek.SelectedItem is not Etterem kivalasztott)
            {
                MessageBox.Show("Kérjük, jelöljön ki egy éttermet!", "Figyelem",
                                MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var eredmeny = MessageBox.Show(
                $"Biztosan törli a(z) '{kivalasztott.Nev}' éttermet?",
                "Törlés megerősítése",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);

            if (eredmeny == MessageBoxResult.Yes)
            {
                try
                {
                    AdatbazisHelper.EtteremTorles(kivalasztott.EtteremId);
                    MessageBox.Show("Étterem sikeresen törölve!", "Siker",
                                    MessageBoxButton.OK, MessageBoxImage.Information);
                    FormMezo_Torol();
                    EttermekBetoltes();
                    DashboardFrissit();
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Hiba: " + ex.Message, "Hiba",
                                    MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }

        // Táblázatban való kattintáskor betölti az adatokat a form mezőkbe
        private void dgEttermek_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (dgEttermek.SelectedItem is Etterem kivalasztott)
            {
                txtEtteremNev.Text = kivalasztott.Nev;
                txtEtteremTelefon.Text = kivalasztott.Telefon;
                txtEtteremLeiras.Text = kivalasztott.Leiras;
                txtEtteremKategoria.Text = kivalasztott.KategoriaId.ToString();
                txtEtteremIranyitoszam.Text = kivalasztott.Iranyitoszam.ToString();
            }
        }

        // Form mezők ürítése
        private void FormMezo_Torol()
        {
            txtEtteremNev.Text = "";
            txtEtteremTelefon.Text = "";
            txtEtteremLeiras.Text = "";
            txtEtteremKategoria.Text = "";
            txtEtteremIranyitoszam.Text = "";
        }
    }
}
