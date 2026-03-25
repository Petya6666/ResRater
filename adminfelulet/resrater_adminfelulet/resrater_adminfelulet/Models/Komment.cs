namespace resrater_adminfelulet.Models;

public class Komment
{
    public int KommentId { get; set; }
    public int? FelhasznaloId { get; set; }
    public string FelhasznaloNev { get; set; } = string.Empty;
    public int EtteremId { get; set; }
    public string EtteremNev { get; set; } = string.Empty;
    public string Megjegyzes { get; set; } = string.Empty;
    public DateTime LetrehozIdo { get; set; }
}
