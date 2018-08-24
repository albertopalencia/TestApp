using System;
using System.Configuration;
using System.IO;
using System.Reflection;
using System.Web;
using System.Web.Routing;
using ServiceStack.OrmLite;

namespace TestApp
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            var dir = Path.GetDirectoryName(Uri.UnescapeDataString(new UriBuilder(Assembly.GetExecutingAssembly().CodeBase).Path)) + @"\";
            var assembly = Assembly.LoadFrom(dir + ConfigurationManager.AppSettings["OrmLiteDLL"]);
            OrmLiteConfig.DialectProvider = assembly.CreateInstance(ConfigurationManager.AppSettings["OrmLiteClass"]) as IOrmLiteDialectProvider;
            OrmLiteConfig.CommandTimeout = 0;
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}