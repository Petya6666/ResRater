using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Input;
using resrater_adminfelulet.DataAccess;
using resrater_adminfelulet.Models;

namespace resrater_adminfelulet.ViewModels;

public class EttermekViewModel : BaseViewModel
{
    private readonly EtteremRepository _repo = new();

    private ObservableCollection<Etterem> _ettermek = new();
    private Etterem? _selectedEtterem;
    private string _searchTerm = string.Empty;
    private bool _isBusy;
    private string _statusMessage = string.Empty;
    private bool _isEditing;

    // Edit form fields
    private string _editNev = string.Empty;
    private string _editTelefon = string.Empty;
    private string _editLeiras = string.Empty;
    private int _editKategoriaId;
    private int _editIranyitoszam;
    private bool _editJovahagyott;

    private ObservableCollection<Kategoria> _kategoriak = new();
    private ObservableCollection<Varos> _varosok = new();
    private Kategoria? _selectedKategoria;
    private Varos? _selectedVaros;

    public ObservableCollection<Etterem> Ettermek { get => _ettermek; set => SetProperty(ref _ettermek, value); }
    public Etterem? SelectedEtterem
    {
        get => _selectedEtterem;
        set
        {
            SetProperty(ref _selectedEtterem, value);
            if (value != null) LoadEditForm(value);
        }
    }
    public string SearchTerm { get => _searchTerm; set => SetProperty(ref _searchTerm, value); }
    public bool IsBusy { get => _isBusy; set => SetProperty(ref _isBusy, value); }
    public string StatusMessage { get => _statusMessage; set => SetProperty(ref _statusMessage, value); }
    public bool IsEditing { get => _isEditing; set => SetProperty(ref _isEditing, value); }

    public string EditNev { get => _editNev; set => SetProperty(ref _editNev, value); }
    public string EditTelefon { get => _editTelefon; set => SetProperty(ref _editTelefon, value); }
    public string EditLeiras { get => _editLeiras; set => SetProperty(ref _editLeiras, value); }
    public int EditKategoriaId { get => _editKategoriaId; set => SetProperty(ref _editKategoriaId, value); }
    public int EditIranyitoszam { get => _editIranyitoszam; set => SetProperty(ref _editIranyitoszam, value); }
    public bool EditJovahagyott { get => _editJovahagyott; set => SetProperty(ref _editJovahagyott, value); }

    public ObservableCollection<Kategoria> Kategoriak { get => _kategoriak; set => SetProperty(ref _kategoriak, value); }
    public ObservableCollection<Varos> Varosok { get => _varosok; set => SetProperty(ref _varosok, value); }
    public Kategoria? SelectedKategoria { get => _selectedKategoria; set { SetProperty(ref _selectedKategoria, value); if (value != null) EditKategoriaId = value.KategoriaId; } }
    public Varos? SelectedVaros { get => _selectedVaros; set { SetProperty(ref _selectedVaros, value); if (value != null) EditIranyitoszam = value.Iranyitoszam; } }

    public ICommand LoadCommand { get; }
    public ICommand SearchCommand { get; }
    public ICommand DeleteCommand { get; }
    public ICommand ApproveCommand { get; }
    public ICommand DisapproveCommand { get; }
    public ICommand StartEditCommand { get; }
    public ICommand SaveEditCommand { get; }
    public ICommand CancelEditCommand { get; }
    public ICommand AddNewCommand { get; }

    private bool _isAddingNew;
    public bool IsAddingNew { get => _isAddingNew; set => SetProperty(ref _isAddingNew, value); }

    public EttermekViewModel()
    {
        LoadCommand = new RelayCommand(async () => await LoadAsync());
        SearchCommand = new RelayCommand(async () => await LoadAsync());
        DeleteCommand = new RelayCommand(async () => await DeleteAsync(), () => SelectedEtterem != null);
        ApproveCommand = new RelayCommand(async () => await SetJovahagyottAsync(true), () => SelectedEtterem != null);
        DisapproveCommand = new RelayCommand(async () => await SetJovahagyottAsync(false), () => SelectedEtterem != null);
        StartEditCommand = new RelayCommand(() => { IsEditing = true; IsAddingNew = false; }, () => SelectedEtterem != null);
        SaveEditCommand = new RelayCommand(async () => await SaveAsync());
        CancelEditCommand = new RelayCommand(() => { IsEditing = false; IsAddingNew = false; });
        AddNewCommand = new RelayCommand(() =>
        {
            SelectedEtterem = null;
            IsAddingNew = true;
            IsEditing = true;
            ClearEditForm();
        });
    }

    public async Task LoadAsync()
    {
        IsBusy = true;
        try
        {
            var data = await _repo.GetAllAsync(string.IsNullOrWhiteSpace(SearchTerm) ? null : SearchTerm);
            Ettermek = new ObservableCollection<Etterem>(data);

            var kategoriak = await _repo.GetKategoriakAsync();
            Kategoriak = new ObservableCollection<Kategoria>(kategoriak);

            var varosok = await _repo.GetVarosokAsync();
            Varosok = new ObservableCollection<Varos>(varosok);

            StatusMessage = $"{data.Count} étterem betöltve";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Hiba: {ex.Message}";
            MessageBox.Show($"Hiba az adatok betöltésekor:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
        }
        finally { IsBusy = false; }
    }

    private void LoadEditForm(Etterem e)
    {
        EditNev = e.Nev;
        EditTelefon = e.Telefon;
        EditLeiras = e.Leiras;
        EditKategoriaId = e.KategoriaId;
        EditIranyitoszam = e.Iranyitoszam;
        EditJovahagyott = e.Jovahagyott;
        SelectedKategoria = Kategoriak.FirstOrDefault(k => k.KategoriaId == e.KategoriaId);
        SelectedVaros = Varosok.FirstOrDefault(v => v.Iranyitoszam == e.Iranyitoszam);
    }

    private void ClearEditForm()
    {
        EditNev = string.Empty;
        EditTelefon = string.Empty;
        EditLeiras = string.Empty;
        EditKategoriaId = Kategoriak.FirstOrDefault()?.KategoriaId ?? 1;
        EditIranyitoszam = Varosok.FirstOrDefault()?.Iranyitoszam ?? 1117;
        EditJovahagyott = false;
        SelectedKategoria = Kategoriak.FirstOrDefault();
        SelectedVaros = Varosok.FirstOrDefault();
    }

    private async Task SaveAsync()
    {
        if (string.IsNullOrWhiteSpace(EditNev))
        {
            MessageBox.Show("Az étterem neve kötelező!", "Validációs hiba", MessageBoxButton.OK, MessageBoxImage.Warning);
            return;
        }

        IsBusy = true;
        try
        {
            var etterem = new Etterem
            {
                Nev = EditNev.Trim(),
                Telefon = EditTelefon.Trim(),
                Leiras = EditLeiras.Trim(),
                KategoriaId = SelectedKategoria?.KategoriaId ?? EditKategoriaId,
                Iranyitoszam = SelectedVaros?.Iranyitoszam ?? EditIranyitoszam,
                Jovahagyott = EditJovahagyott
            };

            if (IsAddingNew)
            {
                await _repo.InsertAsync(etterem);
                StatusMessage = "Új étterem hozzáadva";
            }
            else if (SelectedEtterem != null)
            {
                etterem.EtteremId = SelectedEtterem.EtteremId;
                await _repo.UpdateAsync(etterem);
                StatusMessage = "Étterem frissítve";
            }

            IsEditing = false;
            IsAddingNew = false;
            await LoadAsync();
        }
        catch (Exception ex)
        {
            StatusMessage = $"Hiba: {ex.Message}";
            MessageBox.Show($"Hiba a mentéskor:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
        }
        finally { IsBusy = false; }
    }

    private async Task DeleteAsync()
    {
        if (SelectedEtterem == null) return;
        var result = MessageBox.Show(
            $"Biztosan törli a következő éttermet?\n\n{SelectedEtterem.Nev}\n\n(Ezzel törlődnek a hozzá tartozó értékelések is!)",
            "Törlés megerősítése", MessageBoxButton.YesNo, MessageBoxImage.Warning);
        if (result != MessageBoxResult.Yes) return;

        IsBusy = true;
        try
        {
            await _repo.DeleteAsync(SelectedEtterem.EtteremId);
            Ettermek.Remove(SelectedEtterem);
            SelectedEtterem = null;
            IsEditing = false;
            StatusMessage = "Étterem törölve";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Hiba: {ex.Message}";
            MessageBox.Show($"Hiba a törléskor:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
        }
        finally { IsBusy = false; }
    }

    private async Task SetJovahagyottAsync(bool jovahagyott)
    {
        if (SelectedEtterem == null) return;
        IsBusy = true;
        try
        {
            await _repo.SetJovahagyottAsync(SelectedEtterem.EtteremId, jovahagyott);
            SelectedEtterem.Jovahagyott = jovahagyott;
            await LoadAsync();
            StatusMessage = jovahagyott ? "Étterem jóváhagyva" : "Jóváhagyás visszavonva";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Hiba: {ex.Message}";
            MessageBox.Show($"Hiba:\n{ex.Message}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
        }
        finally { IsBusy = false; }
    }
}
