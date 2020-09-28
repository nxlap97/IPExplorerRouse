using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Rousesite_Umbraco.Models
{
    public class PaginationModel
    {
        public Double Page { get; set; }
        public Double totalResult { get; set; }
        public Double Total { get; set; }

        public List<CareersModel> Careers { get; set; }


    }
}