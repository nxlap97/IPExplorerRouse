using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web.Mvc;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Core.Services;
using Rousesite_Umbraco.Models;

namespace Rousesite_Umbraco.Controllers
{
    public class CVController : SurfaceController
    {
        // GET: CV
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult HandleSubmitForm(CVContentModel model)
        {
            if (ModelState.IsValid)
            {
                var message = Services.ContentService.Create(String.Format("{0}-{1}", model.userName, DateTime.Now.ToString()), CurrentPage.Id, "cvContent");
                message.SetValue("userName", model.userName);
                message.SetValue("email", model.Email);
                message.SetValue("sex", model.Sex);
                Services.ContentService.SaveAndPublish(message);
                return RedirectToCurrentUmbracoPage();
            }
            return CurrentUmbracoPage();
        }

        public void  HandleSubmitFormDemo(DemoModel model)
        {
            /* if (ModelState.IsValid)
             {
                 var message = Services.ContentService.Create(String.Format("{0}-{1}",model.Sex, DateTime.Now.ToString()), CurrentPage.Id, "demoTypeContent");              
                 message.SetValue("sex", model.Sex);
                 Services.ContentService.SaveAndPublish(message);
                 return RedirectToCurrentUmbracoPage();
             }
             return CurrentUmbracoPage(); */
            Console.WriteLine("asdasdasd");  
        }

    }
}