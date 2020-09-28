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
    public class ContactController : SurfaceController
    {
        // GET: Contact
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult HandleSubmitForm (ContactModel model)
        {
            if (ModelState.IsValid)
            {
                var message = Services.ContentService.Create(String.Format("{0}-{1}", model.userName, DateTime.Now.ToString()), CurrentPage.Id , "contactContent");
                message.SetValue("userName", model.userName);
                message.SetValue("email", model.Email);
                message.SetValue("message", model.Message);
                Services.ContentService.SaveAndPublish(message);
                return RedirectToCurrentUmbracoPage();
            }
            return CurrentUmbracoPage();           
        }

      
    }

}