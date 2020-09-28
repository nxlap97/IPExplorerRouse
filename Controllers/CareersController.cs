using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web.Mvc;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Core.Services;
using Newtonsoft.Json;
using Umbraco.Web.WebApi;

using Rousesite_Umbraco.Models;
using Umbraco.Web;
using Umbraco.Core.Logging;
using Umbraco.Core.Models.PublishedContent;
namespace Rousesite_Umbraco.Controllers
{
    public class CareersController : UmbracoApiController
    {
        public bool CheckDepartment(IEnumerable<IPublishedContent> list, string keyWord)
        {
            foreach (var item in list)
            {

                if (item.Name.ToString().Trim().ToLower() == keyWord.Trim().ToLower())
                {
                    return true;
                }

            }

            return false;
        }


        IEnumerable<IPublishedContent> jobsResult;
        String jobs = "";
        int count_jobs = 0;

        List<CareersModel> listCareers = new List<CareersModel>();
    
        [ValidateAntiForgeryToken]
        [System.Web.Http.HttpPost]
        public string GetProducts(CareersModel model)
        {
            long resultCount = 0;
            var pageSize = 5;
            var page = Convert.ToDouble(model.Page);

            if (ModelState.IsValid)
            {
                var careersContentId = model.CTID;
                int jobCount = 0;
                String Department = model.Department;              
                String Country = model.Country;
                Logger.Info<CareersModel>(jobCount + "fffffffffff page:" + page + "Department: " + Department +  "Country :" + Country);

                try
                {
                    jobsResult = Umbraco.Content(Guid.Parse(careersContentId)).Children().OrderByDescending(x => x.CreateDate)
                   .Where(x => x.IsVisible());
                    if (Department != "all")
                    {         

                        jobsResult = jobsResult.Where(x => x.Value<IEnumerable<IPublishedContent>>("jobDepartment") != null && x.Value<IEnumerable<IPublishedContent>>("jobDepartment").Count() > 0)
                       .Where(x => CheckDepartment(x.Value<IEnumerable<IPublishedContent>>("jobDepartment"), Department));

                    }
                    if (Country != "all")
                    {
                        jobsResult = jobsResult.Where(x => x.Value<IPublishedContent>("jobCountry") != null)
                                     .Where(x => x.Value<IPublishedContent>("jobCountry").Value<string>("countryName").ToLower() == Country.ToLower());
                    }
                             
                }
                catch (InvalidCastException e)
                {
                    throw new InvalidCastException("Put your error message here.", e);
                }
                resultCount = jobsResult != null && jobsResult.Any() ? jobsResult.Count() : 0;

                var totalPages = (int)Math.Ceiling((double)resultCount / (double)pageSize);
                if (page > totalPages)
                {
                    page = totalPages;
                }
                else if (page < 1)
                {
                    page = 1;
                }

                Logger.Info<CareersModel>(jobCount + "fffffffffff");


                if (resultCount > 0)
                {
                    foreach (var jobsearchItem in jobsResult.Skip(((int)page - 1) * pageSize).Take(pageSize))
                    {

                        CareersModel item = new CareersModel();
                        item.Name = jobsearchItem.Name;
                        item.Url = jobsearchItem.Url;

                        List<string> jobLocation = new List<string>();
                         try
                        {
                            var jobLocations = jobsearchItem.Value<IEnumerable<IPublishedContent>>("jobLocation");

                            if (jobLocations != null && jobLocations.Count() > 0)
                            {
                                
                                foreach (var locationItem in jobLocations)
                                {
                                    jobLocation.Add(locationItem.Value("locationName").ToString());
                                }
                            }
                            item.Location = jobLocation;

                        } catch (Exception e)
                        {
                            item.Location = jobLocation;
                        }      

                       




                      listCareers.Add(item);
                        /*jobs = jobsearchItem.Name;*/

                    }

                    Logger.Info<CareersModel>(jobCount + "fffffffffff" + JsonConvert.SerializeObject(listCareers), JsonConvert.SerializeObject(listCareers));
                    PaginationModel pagination = new PaginationModel();
                    pagination.Careers = listCareers;
                    pagination.Page = page;
                    pagination.Total = totalPages;
                    pagination.totalResult = resultCount;
                    return JsonConvert.SerializeObject(pagination);

                }
                else
                {

                    PaginationModel pagination = new PaginationModel();
                    pagination.Total = 0;
                    return JsonConvert.SerializeObject(pagination);

                }
            }
           
            return JsonConvert.SerializeObject(jobsResult);

        }


    
}
}