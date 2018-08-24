using System.Collections.Generic;
using System.Web.Mvc;
using TestApp.BLL;
using TestApp.Models;

namespace TestApp.Controllers
{
    public class CustomerController : Controller
    {
        public ActionResult Index()
        {
            return LoadInformation();
        }

        public ActionResult LoadInformation()
        {
            var model = new CustomerModel();
            //using (IDbConnection _connection = Factory.CreateConnection())
            //{
            //    BLL.CustomerBLL customerBll = new BLL.CustomerBLL(_connection); 
            //}
            var customerBll = new CustomerBLL();
            customerBll.LoadDropDownList(model);
            return View("Index", model);
        }

        [HttpPost]
        public JsonResult ConsultarBarrios(int? idSitioAtencion)
        {
            //List<SelectListItem> barrios = new  List<SelectListItem>();
            return Json(null, JsonRequestBehavior.AllowGet);
        }


        public JsonResult SaveCustomer(CustomerModel model)
        {
            return Json( true ,JsonRequestBehavior.AllowGet);
        }
    }
}