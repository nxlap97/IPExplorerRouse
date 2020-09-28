using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rousesite_Umbraco.Models
{
    public class ContactModel
    {
        public int ID { get; set; }
        public string userName { get; set; }
        public  string Email { get; set; }
        public string Message { get; set; }
    }
}