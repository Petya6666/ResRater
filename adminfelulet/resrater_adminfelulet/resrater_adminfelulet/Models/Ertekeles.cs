namespace resrater_adminfelulet.Models;

public class Ertekeles
{
    public int ErtekelesId { get; set; }
    public int EtteremId { get; set; }
    public string EtteremNev { get; set; } = string.Empty;
    public int? FelhasznaloId { get; set; }
    public string FelhasznaloNev { get; set; } = string.Empty;
    public decimal Atlag { get; set; }
    public DateTime Datum { get; set; }
    public int Etelminoseg { get; set; }
    public int Kiszolgalas { get; set; }
    public int Hangulat { get; set; }
}
