using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using Umbraco.Core.Composing;
using Umbraco.Core.Models;
using Umbraco.Core.Models.PublishedContent;


namespace Rousesite_Umbraco.Utilities
{
    public static class Util
    {
        public static string KEY_ENCRYPT = "jXn2r5u7x!A%D*G-";
        public static bool IsMemberExist(string email)
        {
            var user =  Current.Services.MemberService.GetByEmail(email) ;
            return user != null;
        }

        public static string GetCultureDefault()
        {
            return Current.VariationContextAccessor?.VariationContext?.Culture ?? "";
        }

        public static string GetIdFromContentPickerAlias(this IPublishedContent user, string aliasValue)
        {
            var property = user.GetProperty(aliasValue);
            var propertyValue = property.GetSourceValue();
            if (propertyValue != null)
            {
                var id = propertyValue.ToString().Replace("umb://document/", "");
                var idGuid = Guid.Parse(id);
                //var control = Current.Services.ContentService.GetById(idGuid);

                return idGuid.ToString();
            }
            return "[]";
        }

        public static string GetIdFromNestedContentAlias(this IPublishedContent user, string aliasValue, string aliasProp, string aliasChild = "")
        {

            var property = user.GetProperty(aliasValue);
            var propertyValue = property.GetSourceValue();
            if (propertyValue != null)
            {
                var model = JsonConvert.DeserializeObject<List<dynamic>>(propertyValue.ToString());
                foreach (var item in model.Where(x => x[aliasProp] != null))
                {
                    try
                    {
                        var id = item[aliasProp].ToString().Replace("umb://document/", "");
                        item[aliasProp] = Guid.Parse(id).ToString();
                        if (!string.IsNullOrWhiteSpace(aliasChild))
                        {
                            var idChild = item[aliasChild].ToString().Replace("umb://document/", "");
                            item[aliasChild] = Guid.Parse(idChild).ToString();
                        }
                    }
                    catch (Exception)
                    {
                        return "[]";
                    }
                }
                var json = JsonConvert.SerializeObject(model.Where(x => x[aliasProp] != null));
                return json;
            }
            return "[]";

        }

        public static string GetDataChartFromUser(this IPublishedContent user)
        {
            //IP
            var property_IA = user.GetProperty(ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue"]);
            var propertyValue_IA = property_IA.GetSourceValue();
            var data = "[";
            if (propertyValue_IA != null)
            {
                var model_IA = JsonConvert.DeserializeObject<List<dynamic>>(propertyValue_IA.ToString());
                var categories_IA = model_IA.Select(x => Guid.Parse(x[ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue.Selection"]].ToString().Replace("umb://document/", ""))).Distinct();

                foreach (var category in categories_IA)
                {
                    var sectorLink = "/intellectual-assets";
                    var control = Current.Services.ContentService.GetById(Guid.Parse(category.ToString()));
                    var count = model_IA.Where(x => Guid.Parse(x[ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue.Selection"]].ToString().Replace("umb://document/", "")) == category).Count();
                    data += "{ \"Value\" : \"" + count + "\", \"Name\" : \"" + control.Name + "\", \"Link\" : \"" + sectorLink + "\" },";
                }
            }

            var property_IP = user.GetProperty(ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber"]);
            var propertyValue_IP = property_IP.GetSourceValue();
            if (propertyValue_IP != null)
            {
                var model_IP = JsonConvert.DeserializeObject<List<dynamic>>(propertyValue_IP.ToString());
                var categories_IP = model_IP.Select(x => Guid.Parse(x[ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber.Selection"]].ToString().Replace("umb://document/", ""))).Distinct();

                foreach (var category in categories_IP)
                {
                    var sectorLink = "/intellectual-property";
                    var control = Current.Services.ContentService.GetById(Guid.Parse(category.ToString()));
                    var count = model_IP.Where(x => Guid.Parse(x[ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber.Selection"]].ToString().Replace("umb://document/", "")) == category).Count();
                    data += "{ \"Value\" : \"" + count + "\", \"Name\" : \"" + control.Name + "\", \"Link\" : \"" + sectorLink + "\" },";
                }
            }
            if(data.Length > 3)
                data = data.Remove(data.Length - 1, 1);

            data += "]";
            return data;
        }
        
        public static string ConvertIdStringToIdGuid(this string id)
        {
            return Guid.Parse(id).ToString();
        }

        public static string GetIdFromNestedContentAlias(this IMember user, string aliasValue, string aliasProp, string aliasChild = "")
        {

            var property = user.Properties.Where(x => x.Alias == aliasValue).FirstOrDefault();
            var propertyValue = property.GetValue();
            if (propertyValue != null)
            {
                var model = JsonConvert.DeserializeObject<List<dynamic>>(propertyValue.ToString());
                var result = new List<dynamic>();
                foreach (var item in model.Where(x => x[aliasProp] != null))
                {
                    try
                    {
                        var id = item[aliasProp].ToString().Replace("umb://document/", "");
                        item[aliasProp] = Guid.Parse(id).ToString();
                        if (!string.IsNullOrWhiteSpace(aliasChild))
                        {
                            var idChild = item[aliasChild].ToString().Replace("umb://document/", "");
                            item[aliasChild] = Guid.Parse(idChild).ToString();
                        }
                        result.Add(item);
                    }
                    catch (Exception)
                    {
                        return "[]";
                    }
                }
                var json = JsonConvert.SerializeObject(result.Where(x => x[aliasProp] != null));
                return json;
            }
            return "[]";

        }

        public static string Encrypt(this string toEncrypt)
        {
            byte[] keyArray;
            byte[] toEncryptArray = UTF8Encoding.UTF8.GetBytes(toEncrypt);

            keyArray = UTF8Encoding.UTF8.GetBytes(KEY_ENCRYPT);

            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
            tdes.Key = keyArray;
            tdes.Mode = CipherMode.ECB;
            tdes.Padding = PaddingMode.PKCS7;

            ICryptoTransform cTransform = tdes.CreateEncryptor();
            byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);

            return Convert.ToBase64String(resultArray, 0, resultArray.Length);
        }
        // Phần giải mã
        public static string Decrypt(this string toDecrypt)
        {
            byte[] keyArray;
            byte[] toEncryptArray = Convert.FromBase64String(toDecrypt);

            keyArray = UTF8Encoding.UTF8.GetBytes(KEY_ENCRYPT);

            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();
            tdes.Key = keyArray;
            tdes.Mode = CipherMode.ECB;
            tdes.Padding = PaddingMode.PKCS7;

            ICryptoTransform cTransform = tdes.CreateDecryptor();
            byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);

            return UTF8Encoding.UTF8.GetString(resultArray);
        }
    }
}