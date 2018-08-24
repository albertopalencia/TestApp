using System.Configuration;
using ServiceStack.OrmLite;

namespace TestApp.General
{
    public class Factory
    {
        public static OrmLiteConnectionFactory ConnectionFactory
        {
            get { return new OrmLiteConnectionFactory(ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString); }
        }
    }
}