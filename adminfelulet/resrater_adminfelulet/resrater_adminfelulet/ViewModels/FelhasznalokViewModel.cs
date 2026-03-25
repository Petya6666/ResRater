using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Input;
using resrater_adminfelulet.DataAccess;
using resrater_adminfelulet.Models;

namespace resrater_adminfelulet.ViewModels;

public class FelhasznalokViewModel : BaseViewModel
{
    private readonly FelhasznaloRepository _repo = new();

    private ObservableCollection<Felhasznalo> _felhasznalok = new();
    private Felhasznalo? _selectedFelhasznalo;
    private string _searchTerm = string.Empty;
    private bool _isBusy;
    private string _statusMessage = string.Empty;

    public ObservableCollection<Felhasznalo> Felhasznalok { get => _felhasznalok; set => SetProperty(ref _felhasznalok, value); }
    public Felhasznalo? SelectedFelhasznalo { get => _selectedFelhasznalo; set => SetProperty(ref _selectedFelhasznalo, value); }
    public string SearchTerm { get => _searchTerm; set => SetProperty(ref _searchTerm, value); }
    public bool IsBusy { get => _isBusy; set => SetProperty(ref _isBusy, value); }
    public string StatusMessage { get => _statusMessage; set => SetProperty(ref _statusMessage, value); }

    public ICommand LoadCommand { get; }
    public ICommand SearchCommand { get; }
    public ICommand DeleteCommand { get; }
    public ICommand MakeAdminCommand { get; }
    public ICommand MakeFelhasznaloCommand { get; }

    public FelhasznalokViewModel()
    {
        LoadCommand = new RelayCommand(async () => await LoadAsync());
        SearchCommand = new RelayCommand(async () => await LoadAsync());
        DeleteCommand = new RelayCommand(async () => await DeleteAsync(), () => SelectedFelhasznalo != null);
        MakeAdminCommand = new RelayCommand(async () => await SetSzerepAsync("admin"), () => SelectedFelhasznalo != null);
        MakeFelhasznaloCommand = new RelayCommand(async () => await SetSzerepAsync("felhasznalo"), () => SelectedFelhasznalo != null);
    }

    public async Task LoadAsync()
    {
        IsBusy = true;
        try
        {
            var data = await _repo.GetAllAsync(string.IsNullOrWhiteSpace(SearchTerm) ? null : SearchTerm);
            Felhasznalok = new ObservableCollection<Felhasznalo>(data);
            StatusMessage = $"{data.Count} felhasználó betöltve";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Hiba: {ex.Message}";
            MessageBox.Show($"Hiba az adatok betöltésekor:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
        }
        finally { IsBusy = false; }
    }

    private async Task DeleteAsync()
    {
        if (SelectedFelhasznalo == null) return;
        var result = MessageBox.Show(
            $"Biztosan törli a következő felhasználót?\n\n{SelectedFelhasznalo.Felhasznev} ({SelectedFelhasznalo.Email})",
            "Törlés megerősítése", MessageBoxButton.YesNo, MessageBoxImage.Warning);
        if (result != MessageBoxResult.Yes) return;

        IsBusy = true;
        try
        {
            await _repo.DeleteAsync(SelectedFelhasznalo.FelhasznaloId);
            Felhasznalok.Remove(SelectedFelhasznalo);
            SelectedFelhasznalo = null;
            StatusMessage = "Felhasználó törölve";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Hiba: {ex.Message}";
            MessageBox.Show($"Hiba a törléskor:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
        }
        finally { IsBusy = false; }
    }

    private async Task SetSzerepAsync(string szerep)
    {
        if (SelectedFelhasznalo == null) return;
        IsBusy = true;
        try
        {
            await _repo.UpdateSzerepAsync(SelectedFelhasznalo.FelhasznaloId, szerep);
            SelectedFelhasznalo.Szerep = szerep;
            var idx = Felhasznalok.IndexOf(SelectedFelhasznalo);
            if (idx >= 0)
            {
                Felhasznalok.RemoveAt(idx);
                Felhasznalok.Insert(idx, SelectedFelhasznalo);
                SelectedFelhasznalo = Felhasznalok[idx];
            }
            StatusMessage = $"Szerepkör frissítve: {szerep}";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Hiba: {ex.Message}";
            MessageBox.Show($"Hiba a frissítéskor:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
        }
        finally { IsBusy = false; }
    }
}
