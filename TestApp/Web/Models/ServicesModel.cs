using System.Collections.Generic;
using System.Web.Mvc;
using TestApp.BE;

namespace TestApp.Models
{
    public class ServicesModel : Service
    {
        public IEnumerable<SelectListItem> ListService { get; set; }

        public IEnumerable<SelectListItem> ListCountries { get; set; }
    }
}