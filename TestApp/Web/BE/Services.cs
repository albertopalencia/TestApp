using ServiceStack.DataAnnotations;

namespace TestApp.BE
{
    [Alias("Services")]
    public class Service
    {
        [AutoIncrement]
        [PrimaryKey]
        [Alias("ID")]
        public int ServicesId { get; set; }

        [Alias("Service")]
        public string Name { get; set; }

        [Alias("Price")]
        public decimal Price { get; set; }
        
        [Alias("CustomerId")]
        public int CustomerId { get; set; }

    }
}