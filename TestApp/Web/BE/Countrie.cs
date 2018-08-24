using ServiceStack.DataAnnotations;

namespace TestApp.BE
{
    [Alias("Countries")]
    public class Countrie
    {
        [AutoIncrement]
        [PrimaryKey]
        [Alias("ID")]
        public int CountrieId { get; set; }

        [Alias("Nit")]
        public string Nit { get; set; }

        [Alias("Name")]
        public string FirstName { get; set; }

        [Alias("Email")]
        public string Email { get; set; }
    }
}