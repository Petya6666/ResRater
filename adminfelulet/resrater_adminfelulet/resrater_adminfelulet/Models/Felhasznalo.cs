// Felhasználó modell - ez a class tárolja egy felhasználó adatait
namespace resrater_adminfelulet.Models
{
    public class Felhasznalo
    {
        // Egyedi azonosító
        public int FelhasznaloId { get; set; }

        // Felhasználónév
        public string Felhasznev { get; set; } = "";

        // Email cím
        public string Email { get; set; } = "";

        // Szerepkör: "felhasznalo" vagy "admin"
        public string Szerep { get; set; } = "felhasznalo";

        // Regisztráció dátuma
        public string RegDatum { get; set; } = "";
    }
}
