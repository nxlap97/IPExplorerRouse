using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;
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
using System.Net.Mime;
using System.IO;

namespace Rousesite_Umbraco.Controllers
{
    public class SendEmailController : UmbracoApiController
    {
        public string PopulateBody(ApplyJobModel apply)
        {
            var JobTitle = apply.JobTitle;
            var FirstName = apply.FirstName;
            var LastName = apply.LastName;
            var Phone = apply.Phone;
            var Email = apply.Email;
            var LinkedIn = apply.LinkedIn;
            var Information = apply.Information;
            var Country = apply.Country;

            string Path_URL = HttpRuntime.AppDomainAppPath;           
            string body = string.Empty;
            using (StreamReader reader = new StreamReader(Path_URL + "/Views/Partials/EmailTemplate/ApplyJobEmail.cshtml")) 
            {
                body = reader.ReadToEnd();
            }
            body = body.Replace("{JobTitle}", JobTitle);
            body = body.Replace("{FirstName}", FirstName);
            body = body.Replace("{LastName}", LastName);
            body = body.Replace("{Phone}", Phone);
            body = body.Replace("{Email}", Email);
            body = body.Replace("{LinkedIn}", LinkedIn);
            body = body.Replace("{Information}", Information);
            body = body.Replace("{Country}", Country);
          

            return body;
        }

        public string SubcribeEmailBody(ApplyJobModel apply)
        {         
            var Email = apply.Email;          

            string Path_URL = HttpRuntime.AppDomainAppPath;
            string body = string.Empty;
            using (StreamReader reader = new StreamReader(Path_URL + "/Views/Partials/EmailTemplate/SubcribleEmail.cshtml"))
            {
                body = reader.ReadToEnd();
            }
     
            body = body.Replace("{Email}", Email);          

            return body;
        }


        [ValidateAntiForgeryToken]
        [System.Web.Http.HttpPost]
        public string TestData(ApplyJobModel apply)
        {
            var result = "";
          

            result = PopulateBody(apply);

            return result;
        }

        [ValidateAntiForgeryToken]
        [System.Web.Http.HttpPost]
        public string SendEmail(ApplyJobModel apply)
        {
            var subject = "Application for " + apply.JobTitle;
            string URL = HttpRuntime.AppDomainAppPath;
            string jobCountry = apply.Country;
            var file = URL + apply.Cv;
            var extension = Path.GetExtension(file);       
            var listCountry = Umbraco.Content(Guid.Parse("a7cfa562-c717-4ca1-a0c8-7b9518b4f484"))
                            .Children().OfTypes("whereWeWorkMain")
                            .Where(x => x.IsVisible());

            var siteConfig = Umbraco.Content(2865);

            var recipientEmail = "";
            var configEmailSender = siteConfig.Value("emailSender").ToString();
            var configSMTP = siteConfig.Value("sMTP").ToString();
            int configPort = int.Parse(siteConfig.Value("port").ToString());
            var configPassword = siteConfig.Value("password").ToString(); 
            try
            {
                foreach (var item in listCountry)
                {
                    if (item.Value("countryName").ToString().Trim().ToLower() == jobCountry.Trim().ToLower())
                    {
                        recipientEmail = item.Value("recipientEmail").ToString();
                    }
                }


            }
            catch (Exception e)
            {

                recipientEmail = "";

            }

            try
            {
                if (ModelState.IsValid)
                {
                    var senderEmail = new MailAddress(configEmailSender, "Rouse Career Apply Job");
                    var receiverEmail = new MailAddress(recipientEmail, "Receiver");
                    var password = configPassword;
                    var sub = subject;
                    //var body = message;
                    var body = PopulateBody(apply);
                    var smtp = new SmtpClient
                    {
                        Host = configSMTP,
                        Port = configPort,
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(senderEmail.Address, password)
                    };
                  
                    using (var mess = new MailMessage(senderEmail, receiverEmail)
                    {
                        //Subject = subject,
                        //Body = message
                    })
                    {


                        System.Net.Mail.Attachment attachment;
                        attachment = new System.Net.Mail.Attachment(file);
                        attachment.Name = apply.Name + extension;
                        mess.IsBodyHtml = true;
                        mess.Body = body;
                        mess.Subject = subject;
                        mess.Attachments.Add(attachment); 


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

        [ValidateAntiForgeryToken]
        [System.Web.Http.HttpPost]
        public string SendEmailSubcribe(ApplyJobModel apply)
        {
            var subject = "Subcribe Email";       
           
            var siteConfig = Umbraco.Content(2865);
            var recipientEmail = siteConfig.Value("subscribeEmailRecieve").ToString(); ;
            var configEmailSender = siteConfig.Value("emailSender").ToString();
            var configSMTP = siteConfig.Value("sMTP").ToString();
            int configPort = int.Parse(siteConfig.Value("port").ToString());
            var configPassword = siteConfig.Value("password").ToString();           

            try
            {
                if (ModelState.IsValid)
                {
                    var senderEmail = new MailAddress(configEmailSender, "Rouse Subcribe Email");
                    var receiverEmail = new MailAddress(recipientEmail, "Receiver");
                    var password = configPassword;
                    var sub = subject;
                    //var body = message;
                    var body = SubcribeEmailBody(apply);
                    var smtp = new SmtpClient
                    {
                        Host = configSMTP,
                        Port = configPort,
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential(senderEmail.Address, password)
                    };

                    using (var mess = new MailMessage(senderEmail, receiverEmail)
                    {
                        
                    })
                    {                     
                        mess.IsBodyHtml = true;
                        mess.Body = body;
                        mess.Subject = subject;
                      
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