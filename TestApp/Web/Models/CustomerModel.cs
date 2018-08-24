using System.Collections.Generic;
using System.Web.Mvc;
using TestApp.BE;

namespace TestApp.Models
{
    public class CustomerModel : Customer
    {
        public int ServiceId { get; set; }
        public int CountrieId { get; set; }
        public IEnumerable<SelectListItem> ListServices { get; set; }
        public IEnumerable<SelectListItem> ListCountries { get; set; }
    }
}