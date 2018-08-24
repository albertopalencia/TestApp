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

        [Alias("Name")]
        public string Name { get; set; }

        [Alias("ServiceId")]
        public int ServiceId { get; set; }

      
    }
}