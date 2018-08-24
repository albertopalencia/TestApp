using System.Collections.Generic;
using System.Data;
using TestApp.BE;
using TestApp.Models;

namespace TestApp.BLL
{
    public class CustomerBLL
    {
        private readonly IDbConnection _connection;

        public CustomerBLL(IDbConnection connection)
        {
            _connection = connection;
        }

        public CustomerBLL()
        {
        }

        public void LoadDropDownList(CustomerModel model)
        {
            List<Service> listServices = new List<Service>
            {
                new Service  { ServicesId = 1,Name = "Descarga espacial de contenidos",  Price = 10000 }
                ,new Service  { ServicesId = 2,Name = "Desaparición forzada de bytes",  Price = 15000 }
            };

            List<Countrie> listCountries = new List<Countrie>
            {
                new Countrie  { CountrieId = 1,Name = "Colombia"}
                ,new Countrie  { CountrieId = 2,Name = "Perú" }
                ,new Countrie  { CountrieId = 3,Name = "México" }
            };

            model.ListServices = GeneralBLL.LoadDropDownList(listServices, Constantes.ServiceId,Constantes.ServiceName);
            model.ListCountries = GeneralBLL.LoadDropDownList(listCountries, Constantes.CountrieId, Constantes.CountrieName);
        }

    }
}