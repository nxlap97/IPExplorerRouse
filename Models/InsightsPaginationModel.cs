﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rousesite_Umbraco.Models
{
    public class InsightsPaginationModel
    {
        public Double Page { get; set; }
        public Double Total { get; set; }
        public List<NewsModel> News { get; set; }
    }
}