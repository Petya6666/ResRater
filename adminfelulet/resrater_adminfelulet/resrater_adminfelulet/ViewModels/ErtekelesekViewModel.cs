using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Input;
using resrater_adminfelulet.DataAccess;
using resrater_adminfelulet.Models;

namespace resrater_adminfelulet.ViewModels;

public class ErtekelesekViewModel : BaseViewModel
{
    private readonly ErtekelesRepository _repo = new();

    private ObservableCollection<Ertekeles> _ertekelesek = new();
    private Ertekeles? _selectedErtekeles;
    private bool _isBusy;
    private string _statusMessage = string.Empty;

    public ObservableCollection<Ertekeles> Ertekelesek { get => _ertekelesek; set => SetProperty(ref _ertekelesek, value); }
    public Ertekeles? SelectedErtekeles { get => _selectedErtekeles; set => SetProperty(ref _selectedErtekeles, value); }
    public bool IsBusy { get => _isBusy; set => SetProperty(ref _isBusy, value); }
    public string StatusMessage { get => _statusMessage; set => SetProperty(ref _statusMessage, value); }

    public ICommand LoadCommand { get; }
    public ICommand DeleteCommand { get; }

    public ErtekelesekViewModel()
    {
        LoadCommand = new RelayCommand(async () => await LoadAsync());
        DeleteCommand = new RelayCommand(async () => await DeleteAsync(), () => SelectedErtekeles != null);
    }

    public async Task LoadAsync()
    {
        IsBusy = true;
        try
        {
            var data = await _repo.GetAllAsync();
            Ertekelesek = new ObservableCollection<Ertekeles>(data);
            StatusMessage = $"{data.Count} értékelés betöltve";
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
        if (SelectedErtekeles == null) return;
        var result = MessageBox.Show(
            $"Biztosan törli ezt az értékelést?\n\n{SelectedErtekeles.EtteremNev} – {SelectedErtekeles.FelhasznaloNev} ({SelectedErtekeles.Datum:yyyy.MM.dd})",
            "Törlés megerősítése", MessageBoxButton.YesNo, MessageBoxImage.Warning);
        if (result != MessageBoxResult.Yes) return;

        IsBusy = true;
        try
        {
            await _repo.DeleteAsync(SelectedErtekeles.ErtekelesId);
            Ertekelesek.Remove(SelectedErtekeles);
            SelectedErtekeles = null;
            StatusMessage = "Értékelés törölve";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Hiba: {ex.Message}";
            MessageBox.Show($"Hiba a törléskor:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
        }
        finally { IsBusy = false; }
    }
}
