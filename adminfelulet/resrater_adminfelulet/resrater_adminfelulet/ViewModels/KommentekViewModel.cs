using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Input;
using resrater_adminfelulet.DataAccess;
using resrater_adminfelulet.Models;

namespace resrater_adminfelulet.ViewModels;

public class KommentekViewModel : BaseViewModel
{
    private readonly KommentRepository _repo = new();

    private ObservableCollection<Komment> _kommentek = new();
    private Komment? _selectedKomment;
    private string _searchTerm = string.Empty;
    private bool _isBusy;
    private string _statusMessage = string.Empty;

    public ObservableCollection<Komment> Kommentek { get => _kommentek; set => SetProperty(ref _kommentek, value); }
    public Komment? SelectedKomment { get => _selectedKomment; set => SetProperty(ref _selectedKomment, value); }
    public string SearchTerm { get => _searchTerm; set => SetProperty(ref _searchTerm, value); }
    public bool IsBusy { get => _isBusy; set => SetProperty(ref _isBusy, value); }
    public string StatusMessage { get => _statusMessage; set => SetProperty(ref _statusMessage, value); }

    public ICommand LoadCommand { get; }
    public ICommand SearchCommand { get; }
    public ICommand DeleteCommand { get; }

    public KommentekViewModel()
    {
        LoadCommand = new RelayCommand(async () => await LoadAsync());
        SearchCommand = new RelayCommand(async () => await LoadAsync());
        DeleteCommand = new RelayCommand(async () => await DeleteAsync(), () => SelectedKomment != null);
    }

    public async Task LoadAsync()
    {
        IsBusy = true;
        try
        {
            var data = await _repo.GetAllAsync(string.IsNullOrWhiteSpace(SearchTerm) ? null : SearchTerm);
            Kommentek = new ObservableCollection<Komment>(data);
            StatusMessage = $"{data.Count} komment betöltve";
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
        if (SelectedKomment == null) return;
        var result = MessageBox.Show(
            $"Biztosan törli ezt a kommentet?\n\n\"{SelectedKomment.Megjegyzes}\"\n– {SelectedKomment.FelhasznaloNev}",
            "Törlés megerősítése", MessageBoxButton.YesNo, MessageBoxImage.Warning);
        if (result != MessageBoxResult.Yes) return;

        IsBusy = true;
        try
        {
            await _repo.DeleteAsync(SelectedKomment.KommentId);
            Kommentek.Remove(SelectedKomment);
            SelectedKomment = null;
            StatusMessage = "Komment törölve";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Hiba: {ex.Message}";
            MessageBox.Show($"Hiba a törléskor:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
        }
        finally { IsBusy = false; }
    }
}
