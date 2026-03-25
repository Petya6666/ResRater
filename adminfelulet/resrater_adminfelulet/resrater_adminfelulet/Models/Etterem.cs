namespace resrater_adminfelulet.Models;

public class Etterem
{
    public int EtteremId { get; set; }
    public string Nev { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public string Leiras { get; set; } = string.Empty;
    public int KategoriaId { get; set; }
    public string KategoriaNev { get; set; } = string.Empty;
    public int Iranyitoszam { get; set; }
    public string VarosNev { get; set; } = string.Empty;
    public bool Jovahagyott { get; set; }
    public string JovahagyottSzoveg => Jovahagyott ? "Jóváhagyva" : "Függőben";
}
