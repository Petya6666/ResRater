using resrater_adminfelulet.DataAccess;

namespace resrater_adminfelulet.ViewModels;

public class MainViewModel : BaseViewModel
{
    public DashboardViewModel Dashboard { get; } = new();
    public FelhasznalokViewModel Felhasznalok { get; } = new();
    public EttermekViewModel Ettermek { get; } = new();
    public ErtekelesekViewModel Ertekelesek { get; } = new();
    public KommentekViewModel Kommentek { get; } = new();

    private int _selectedTabIndex;
    private string _connectionStatus = "Csatlakozás...";
    private bool _isConnected;

    public int SelectedTabIndex
    {
        get => _selectedTabIndex;
        set
        {
            SetProperty(ref _selectedTabIndex, value);
            _ = OnTabChangedAsync(value);
        }
    }

    public string ConnectionStatus { get => _connectionStatus; set => SetProperty(ref _connectionStatus, value); }
    public bool IsConnected { get => _isConnected; set => SetProperty(ref _isConnected, value); }

    public async Task InitializeAsync()
    {
        var connected = await DatabaseHelper.TestConnectionAsync();
        IsConnected = connected;
        ConnectionStatus = connected ? "✓ Adatbázis kapcsolódva" : "✗ Nem sikerült csatlakozni";

        if (connected)
            await Dashboard.LoadAsync();
    }

    private async Task OnTabChangedAsync(int tabIndex)
    {
        if (!IsConnected) return;
        switch (tabIndex)
        {
            case 0: await Dashboard.LoadAsync(); break;
            case 1: await Felhasznalok.LoadAsync(); break;
            case 2: await Ettermek.LoadAsync(); break;
            case 3: await Ertekelesek.LoadAsync(); break;
            case 4: await Kommentek.LoadAsync(); break;
        }
    }
}
