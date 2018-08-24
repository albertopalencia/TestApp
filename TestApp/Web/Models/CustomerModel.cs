using System.Collections.Generic;
using System.Web.Mvc;
using TestApp.BE;

namespace TestApp.Models
{
    public class CustomerModel : Customer
    {
        public IEnumerable<SelectListItem> ListCustomer { get; set; }
    }
}