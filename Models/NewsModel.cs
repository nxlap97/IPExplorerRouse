using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rousesite_Umbraco.Models
{
    public class NewsModel
    {
        public int ID { get; set; }
        public string CTID { get; set; }
        public string Data { get; set; }
        public string Type { get; set; }
        public string Industry { get; set; }
        public string Services { get; set; }
        public string Page { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Date { get; set; }
        public string Sumary { get; set; }
        public string Image { get; set; }
        public string TimeRead { get; set; }
        public List<PeopleModel> Author { get; set; }
        public String[] Tags { get; set; }


    }
}