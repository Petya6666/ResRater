namespace resrater_adminfelulet.Models;

public class Felhasznalo
{
    public int FelhasznaloId { get; set; }
    public string Felhasznev { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime RegDatum { get; set; }
    public string Szerep { get; set; } = "felhasznalo";
}
