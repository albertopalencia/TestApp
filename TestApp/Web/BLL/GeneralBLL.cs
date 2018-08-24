using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;

namespace TestApp.BLL
{
    public class GeneralBLL
    {
        public const string formatoFecha = "mm/dd/yyyy";
        public const string formatoJquery = "mm/dd/yy";
        public const string formatoFechaControl = "{0:MM/dd/yyyy}";
        public const string alfrescoTamanioArchivos = "AlfrescoTamanioArchivos";
        public const string nombrePrimerElemento = "Seleccione";

        public static IEnumerable<SelectListItem> LoadDropDownList<T>(List<T> list, string value, string text)
        {
            var itemList = new SelectList(list, value, text);
            var allList = itemList.ToList();
            return allList;
        }

        public static IEnumerable<SelectListItem> LoadDropDownListParametros<T>(List<T> list)
        {
            var itemList = new SelectList(list, "Code", "Description");
            var allList = itemList.ToList();
            return allList;
        }

        public static T CopyEntity<T, T2>(T2 source) where T : new()
        {
            var newEmp = new T();

            foreach (var propInfo in typeof (T2).GetProperties())
            {
                var objType = typeof (T);
                var valueToCopy = propInfo.GetValue(source, null);

                var propInfo2 = GetPropertyInfo(objType, propInfo.Name);
                if (propInfo2 != null)
                    propInfo2.SetValue(newEmp, valueToCopy, null);
            }
            return newEmp;
        }

        public static PropertyInfo GetPropertyInfo(Type type, string propertyName)
        {
            PropertyInfo propInfo = null;
            do
            {
                propInfo = type.GetProperty(propertyName,
                    BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
                type = type.BaseType;
            } while (propInfo == null && type != null);
            return propInfo;
        }
    }
}