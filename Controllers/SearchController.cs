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
using System.Net;
using System.Net.Mail;

namespace Rousesite_Umbraco.Controllers
{
    public class SearchController : UmbracoApiController
    {
        IEnumerable<IPublishedContent> jobsResult;

        String jobs = "";
        int count_jobs = 0;
        List<CareersModel> listCareers = new List<CareersModel>();
        public string HandleCustomSearch ()
        {
            int[] marks = new int[] { 99, 98, 92, 97, 95 };
            var json = JsonConvert.SerializeObject(marks);
            return json;
        }
        [ValidateAntiForgeryToken]
        [System.Web.Http.HttpPost]
        public string GetAllProducts(CareersModel model)
        {
            long resultCount = 0;
            var pageSize = 5;
            var page = Convert.ToDouble(model.Page);

            if (ModelState.IsValid)
            {
                var careersContentId = model.CTID;              
                int jobCount = 0;
                String Department = model.Department;
                String Team = model.Team;
                String Country = model.Country;
                Logger.Info<CareersModel>( jobCount + "fffffffffff page:" + page + "Department: "+Department + " Team:" + Team + "Country :" + Country);
                if (Department != "all" && Team == "all" && Country == "all")
                {
                    jobsResult = Umbraco.Content(Guid.Parse(careersContentId)).Children()
                     .Where(x => x.IsVisible())
                     .Where(x => (string.Join(",", x.Value<IEnumerable<string>>("jobDepartment")).ToLower().Contains(Department.ToLower())));
                } else if (Department != "all" && Team == "all" && Country != "all")
                {
                    jobsResult = Umbraco.Content(Guid.Parse(careersContentId)).Children()
                     .Where(x => x.IsVisible())
                     .Where(x => x.Value<IPublishedContent>("country") != null)
                     .Where(x => x.Value<IPublishedContent>("country").Value<string>("locationName").ToLower() == Country.ToLower())
                     .Where(x => (string.Join(",", x.Value<IEnumerable<string>>("jobDepartment")).ToLower().Contains(Department.ToLower())));
                }
                else if (Department == "all" && Team == "all" && Country == "all")
                {
                    jobsResult = Umbraco.Content(Guid.Parse(careersContentId)).Children()
                     .Where(x => x.IsVisible());
                    
                }
                else if (Department != "all" && Team != "all" && Country == "all")
                {
                    jobsResult = Umbraco.Content(Guid.Parse(careersContentId)).Children()
                    .Where(x => (string.Join(",", x.Value<IEnumerable<string>>("jobDepartment")).ToLower().Contains(Department.ToLower())))
                   .Where(x => (string.Join(",", x.Value<IEnumerable<string>>("team")).ToLower().Contains(Team.ToLower())))
                     .Where(x => x.IsVisible());

                }
                else if (Department != "all" && Country != "all" && Team != "all")
                {
                    jobsResult = Umbraco.Content(Guid.Parse(careersContentId)).Children()
                   .Where(x => x.IsVisible())
                   .Where(x => x.Value<IPublishedContent>("country") != null)
                   .Where(x => x.Value<IPublishedContent>("country").Value<string>("locationName").ToLower() == Country.ToLower())
                   .Where(x => (string.Join(",", x.Value<IEnumerable<string>>("jobDepartment")).ToLower().Contains(Department.ToLower())))
                   .Where(x => (string.Join(",", x.Value<IEnumerable<string>>("team")).ToLower().Contains(Team.ToLower())));
                }
                else if (Department == "all" && Country != "all" && Team == "all")
                {
                    jobsResult = Umbraco.Content(Guid.Parse(careersContentId)).Children()
                   .Where(x => x.IsVisible())
                   .Where(x => x.Value<IPublishedContent>("country") != null)
                   .Where(x => x.Value<IPublishedContent>("country").Value<string>("locationName").ToLower() == Country.ToLower());
                  
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
                            //item.Location = jobsearchItem.Value("jobLocation").ToString();                            
                            listCareers.Add(item);
                            /*jobs = jobsearchItem.Name;*/

                        }

                        Logger.Info<CareersModel>(jobCount + "fffffffffff" + JsonConvert.SerializeObject(listCareers), JsonConvert.SerializeObject(listCareers));
                        PaginationModel pagination = new PaginationModel();
                        pagination.Careers = listCareers;
                        pagination.Page = page;
                        pagination.Total = totalPages;
                        return JsonConvert.SerializeObject(pagination);

                    }
                    else
                    {

                        PaginationModel pagination = new PaginationModel();
                        pagination.Total = 0;
                        return JsonConvert.SerializeObject(pagination);

                }



            }


            /*  return name;*/
            return JsonConvert.SerializeObject(jobsResult);

            /*return JsonConvert.SerializeObject(data);*/
        }


        [ValidateAntiForgeryToken]
        [System.Web.Http.HttpPost]
        public string SendEmail()
        {

            var subject = "Test email";
            var message = "Demo";
            try
            {
                if (ModelState.IsValid)
                {
                    var senderEmail = new MailAddress("phulong9517@gmail.com", "LongHo Umbraco");
                    var receiverEmail = new MailAddress("phulong95@gmail.com", "Receiver");
                    var password = "anhemchungta2xX@";
                    var sub = subject;
                    var body = message;
                    var smtp = new SmtpClient
                    {
                        Host = "smtp.gmail.com",
                        Port = 587,
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(senderEmail.Address, password)
                    };
                    using (var mess = new MailMessage(senderEmail, receiverEmail)
                    {
                        Subject = subject,
                        Body = body
                    })
                    {
                        smtp.Send(mess);
                    }
                    return "";
                }
            }
            catch (Exception)
            {

            }
            return "";
        }

    }

}