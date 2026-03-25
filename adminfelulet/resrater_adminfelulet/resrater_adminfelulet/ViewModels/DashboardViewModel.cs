using resrater_adminfelulet.DataAccess;

namespace resrater_adminfelulet.ViewModels;

public class DashboardViewModel : BaseViewModel
{
    private readonly FelhasznaloRepository _felhasznaloRepo = new();
    private readonly EtteremRepository _etteremRepo = new();
    private readonly ErtekelesRepository _ertekelesRepo = new();
    private readonly KommentRepository _kommentRepo = new();

    private int _totalFelhasznalok;
    private int _totalEttermek;
    private int _totalErtekelesek;
    private int _totalKommentek;
    private int _pendingEttermek;
    private string _statusMessage = "Adatok betöltése...";
    private List<KategoriaStatisztika> _kategoriaStatisztikak = new();
    private List<string> _recentActivity = new();

    public int TotalFelhasznalok { get => _totalFelhasznalok; set => SetProperty(ref _totalFelhasznalok, value); }
    public int TotalEttermek { get => _totalEttermek; set => SetProperty(ref _totalEttermek, value); }
    public int TotalErtekelesek { get => _totalErtekelesek; set => SetProperty(ref _totalErtekelesek, value); }
    public int TotalKommentek { get => _totalKommentek; set => SetProperty(ref _totalKommentek, value); }
    public int PendingEttermek { get => _pendingEttermek; set => SetProperty(ref _pendingEttermek, value); }
    public string StatusMessage { get => _statusMessage; set => SetProperty(ref _statusMessage, value); }
    public List<KategoriaStatisztika> KategoriaStatisztikak { get => _kategoriaStatisztikak; set => SetProperty(ref _kategoriaStatisztikak, value); }
    public List<string> RecentActivity { get => _recentActivity; set => SetProperty(ref _recentActivity, value); }

    public async Task LoadAsync()
    {
        try
        {
            StatusMessage = "Adatok betöltése...";
            TotalFelhasznalok = await _felhasznaloRepo.GetCountAsync();
            TotalEttermek = await _etteremRepo.GetCountAsync();
            TotalErtekelesek = await _ertekelesRepo.GetCountAsync();
            TotalKommentek = await _kommentRepo.GetCountAsync();
            PendingEttermek = await _etteremRepo.GetPendingCountAsync();

            var byKategoria = await _etteremRepo.GetByKategoriaAsync();
            KategoriaStatisztikak = byKategoria
                .Select(kv => new KategoriaStatisztika { Nev = kv.Key, Darab = kv.Value })
                .OrderByDescending(k => k.Darab)
                .ToList();

            var recentKommentek = await _kommentRepo.GetRecentAsync(5);
            RecentActivity = recentKommentek
                .Select(k => $"💬 {k.FelhasznaloNev} kommentált: \"{k.EtteremNev}\" – {k.LetrehozIdo:yyyy.MM.dd HH:mm}")
                .ToList();

            StatusMessage = $"Utoljára frissítve: {DateTime.Now:HH:mm:ss}";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Hiba: {ex.Message}";
        }
    }
}

public class KategoriaStatisztika
{
    public string Nev { get; set; } = string.Empty;
    public int Darab { get; set; }
    public override string ToString() => $"{Nev}: {Darab}";
}
