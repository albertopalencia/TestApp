using System;
using System.Web;
using System.Web.Security;

namespace TestApp.General
{
    public class VariablesSesionHelper
    {
        public static string vsUserId = "UserId";
        
        public static int UserId()
        {
            int idUser = 0;

            if (ValidarSession())
            {
                idUser = Convert.ToInt32(HttpContext.Current.Session[vsUserId]);
            }

            return idUser;
        }

        public static bool ValidarSession()
        {
            if (HttpContext.Current.Session.Contents.Count.Equals(0))
            {

                if (HttpContext.Current.Session != null)
                {
                    HttpContext.Current.Session.Abandon();
                }

                FormsAuthentication.SignOut();
                return false;
            }

            return true;
        }

        public static string CrearCacheKey(string cadena)
        {
            string cacheKey = Guid.NewGuid().ToString("N");
            System.Web.HttpContext.Current.Cache.Insert(cacheKey, cadena, null,
                System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 120, 0));

            return cacheKey;
        }

        public static T ConsultarCacheKey<T>(string cacheKey, bool eliminar = false)
        {
            T resultado;

            if (cacheKey != null)
            {
                if (System.Web.HttpRuntime.Cache.Get(cacheKey) != null)
                {
                    resultado = (T)Convert.ChangeType(System.Web.HttpRuntime.Cache.Get(cacheKey), typeof(T));
                }
                else
                {
                    resultado = default(T);
                }

                if (eliminar)
                {
                    System.Web.HttpRuntime.Cache.Remove(cacheKey);
                }
            }
            else
            {
                resultado = default(T);
            }    

            return resultado;
        }

        public static bool UsuarioAutenticado()
        {
            bool usuarioAutenticado = false;

            if (HttpContext.Current.Session["Authenticated"] != null)
            {
                usuarioAutenticado = Convert.ToBoolean(HttpContext.Current.Session["Authenticated"]);
            }

            return usuarioAutenticado;
        }
    }
}