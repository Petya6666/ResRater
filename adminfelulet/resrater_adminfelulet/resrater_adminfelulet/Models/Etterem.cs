// Étterem modell - ez a class tárolja egy étterem adatait
namespace resrater_adminfelulet.Models
{
    public class Etterem
    {
        // Egyedi azonosító
        public int EtteremId { get; set; }

        // Étterem neve
        public string Nev { get; set; } = "";

        // Telefonszám
        public string Telefon { get; set; } = "";

        // Leírás
        public string Leiras { get; set; } = "";

        // Kategória azonosítója
        public int KategoriaId { get; set; }

        // Irányítószám
        public int Iranyitoszam { get; set; }

        // Jóváhagyott-e (1 = igen, 0 = nem)
        public bool Jovahagyott { get; set; }

        // Ezt a property-t a táblázatban megjelenítéshez használjuk
        public string JovahagyottSzoveg => Jovahagyott ? "Igen" : "Nem";
    }
}
