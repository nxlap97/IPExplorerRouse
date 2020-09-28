using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core.Models.PublishedContent;

namespace Rousesite_Umbraco.Models
{
    public class PeopleModel
    {
        public int ID { get; set; }
        public string CTID { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Location { get; set; }
        public string Department { get; set; }
        public string Firm { get; set; }
        public string Country { get; set; }
        public string Team { get; set; }
        public string Page { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Position { get; set; }
        public string Image { get; set; }
        public string Face { get; set; }
        public string Linkedin { get; set; }        
        public  List<SocialModel> SocialMedia { get; set; }

    }
}