using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rousesite_Umbraco.Models
{
    public class PeoplePaginationModel
    {
        public Double Page { get; set; }
        public Double Total { get; set; }
        public List<PeopleModel> People { get; set; }
    }
}