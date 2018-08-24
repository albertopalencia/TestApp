using ServiceStack.DataAnnotations;

namespace TestApp.BE
{
    [Alias("Customers")]
    public class Customer
    {
        [AutoIncrement]
        [PrimaryKey]
        [Alias("ID")]
        public int CustomerId { get; set; }

        [Alias("Nit")]
        public string Nit { get; set; }

        [Alias("Name")]
        public string FirstName { get; set; }

        [Alias("Email")]
        public string Email { get; set; }

    }
}