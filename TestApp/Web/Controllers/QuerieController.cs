using System.Web.Mvc;

namespace TestApp.Controllers
{
    public class QuerieController : Controller
    {
        public ActionResult Index()
        {
            return Customer();
        }

        public ActionResult Services()
        {
            return View();
        }

        public ActionResult Customer()
        {
            return View();
        }

        public ActionResult Countries()
        {
            return View();
        }
    }
}