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
using Umbraco.Core.Models;
using Umbraco.Core.Services;
using Rousesite_Umbraco.Models;
using Umbraco.Web;
using Umbraco.Core.Logging;
using Umbraco.Core.Models.PublishedContent;
using  Umbraco.Web.PublishedModels;
using System.Web.Http;

namespace Rousesite_Umbraco.Controllers
{
    public class PeopleController : UmbracoApiController
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

        public bool CheckFirm(IPublishedContent firm, string keyWord)
        {
            

                if (firm.Name.ToString().Trim().ToLower() == keyWord.Trim().ToLower())
                {
                    return true;
                }


            return false;
        }

        IEnumerable<IPublishedContent> peoplesResult;
        List<PeopleModel> listPeople = new List<PeopleModel>();

        [ValidateAntiForgeryToken]
        [System.Web.Http.HttpGet]
        public string SearchPeople([FromUri] PeopleModel model)
        {
            long resultCount = 0;
            var pageSize = 8;
            var page = Convert.ToDouble(model.Page);

            if (true)
            {
                var PeopleContentId = model.CTID;
                int jobCount = 0;
                String Department = model.Department;               
                String Country = model.Country;
                String Firm = model.Firm;
                String Name = model.Name;
              



                try
                {                
                    peoplesResult = Umbraco.Content(Guid.Parse(PeopleContentId)).Children().Where(x => x.IsVisible());

                    if (Country != "all")
                    {
                         peoplesResult =  peoplesResult.Where(x => x.Value<IPublishedContent>("profileLocation") != null)
                        .Where(x => x.Value<IPublishedContent>("profileLocation").Name.ToLower().Trim().Contains(Country.ToLower().Trim()));
                    }
                    if (Name != null )
                    {
                        peoplesResult = peoplesResult.Where(x => x.Value<String>("profileName").ToLower().Contains(Name.ToLower()));
                    }
                    if (Department != "all")
                    {
                        peoplesResult = peoplesResult.Where(x => x.Value<IEnumerable<IPublishedContent>>("profileDepartments") != null && x.Value<IEnumerable<IPublishedContent>>("profileDepartments").Count() > 0)
                        .Where(x => CheckDepartment(x.Value<IEnumerable<IPublishedContent>>("profileDepartments"),Department));
                    }
                    if (Firm != "all")
                    {              
                               
                        peoplesResult = peoplesResult.Where(x => x.Value<IPublishedContent>("profileFirm") != null)
                                           .Where(x => CheckFirm(x.Value<IPublishedContent>("profileFirm"), Firm));
                    }

                }
                catch (InvalidCastException e)
                {
                    throw new InvalidCastException("Put your error message here.", e);
                }



                resultCount = peoplesResult != null && peoplesResult.Any() ? peoplesResult.Count() : 0;


                var totalPages = (int)Math.Ceiling((double)resultCount / (double)pageSize);
                if (page > totalPages)
                {
                    page = totalPages;
                }
                else if (page < 1)
                {
                    page = 1;
                }

                Logger.Info<PeopleModel>(jobCount + "fffffffffff");


                if (resultCount > 0)
                {
                    foreach (var peoplesearchItem in peoplesResult.Skip(((int)page - 1) * pageSize).Take(pageSize))
                    {
                        string profileImage = "";
                        PeopleModel item = new PeopleModel();
                        item.Name = peoplesearchItem.Name;
                        item.Url = peoplesearchItem.Url;         
                      
                        var officePlace = "";
                        try
                        {
                            officePlace =  peoplesearchItem.Value<IPublishedContent>("profileLocation").Name.ToString();
                        } catch (Exception e)
                        {
                            officePlace = "";
                        }
                        item.Location = officePlace;


                        item.Position = peoplesearchItem.Value("profilePosition").ToString();
                        item.Email = peoplesearchItem.Value("profileEmail").ToString();
                        item.Phone = peoplesearchItem.Value("profilePhone").ToString();
                        item.Linkedin = peoplesearchItem.Value("linkedinURL").ToString();

                        try {
                            if (peoplesearchItem.Value<IPublishedContent>("profileImage") != null)
                            {

                                if (peoplesearchItem.Value<IPublishedContent>("profileImage").GetCropUrl("ProfileImage") != null)
                                {
                                    profileImage = peoplesearchItem.Value<IPublishedContent>("profileImage").GetCropUrl("ProfileImage").ToString();
                                }
                                else
                                {
                                    profileImage = peoplesearchItem.Value<IPublishedContent>("profileImage").Url.ToString();
                                }
                            }

                        } catch (Exception e)
                        {
                            profileImage = "";

                        }
                       
                       item.Image  = profileImage;               
                                              
                       listPeople.Add(item);                   
                            
                    }

                    /* Logger.Info<PeopleModel>(jobCount + "fffffffffff" + JsonConvert.SerializeObject(listPeople), JsonConvert.SerializeObject(listPeople));*/

                    PeoplePaginationModel pagination = new PeoplePaginationModel();
                    pagination.People = listPeople;
                    pagination.Page = page;
                    pagination.Total = totalPages;
                    return JsonConvert.SerializeObject(pagination);

                }
                else
                {
                    PeoplePaginationModel pagination = new PeoplePaginationModel();
                    pagination.Total = 0;
                    return JsonConvert.SerializeObject(pagination);

                }
                               
            }


            /*  return name;*/
            return JsonConvert.SerializeObject(peoplesResult);

            /*return JsonConvert.SerializeObject(data);*/
        }
    }
}