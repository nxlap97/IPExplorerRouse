using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rousesite_Umbraco.Models
{
    public class CareersModel
    {
        public int ID { get; set; }
        public string CTID { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public List<string> Location { get; set; }
        public string Department { get; set; }
        public string Country { get; set; }
        public string Team { get; set; }
        public string Page { get; set; }

    }
}


