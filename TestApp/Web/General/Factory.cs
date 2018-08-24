using System.Configuration;
using System.Data;
using ServiceStack.OrmLite;

namespace TestApp.General
{
    public class Factory
    {
        public static OrmLiteConnectionFactory ConnectionFactory
        {
            get { return new OrmLiteConnectionFactory(ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString); }
        }
        

        public static IDbConnection CreateConnection()
        {
            return (new OrmLiteConnectionFactory(ConnectionFactory.ConnectionString)).OpenDbConnection();
        }
    }
}