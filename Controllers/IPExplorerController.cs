using Newtonsoft.Json;
using Rousesite_Umbraco.Enums;
using Rousesite_Umbraco.Models;
using Rousesite_Umbraco.Utilities;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Http.Results;
using System.Web.Mvc;
using System.Web.Security;
using Umbraco.Core.Composing;
using Umbraco.Core.Models;
using Umbraco.Web;
using Umbraco.Web.Models;
using Umbraco.Web.Mvc;

namespace Rousesite_Umbraco.Controllers
{
    public class IPExplorerController : SurfaceController
    {
        public ActionResult Index()
        {
            return PartialView("LoginForm", new LoginModel());
        }

        [System.Web.Http.HttpPost]
        public ActionResult Logout()
        {
            Session.Clear();
            FormsAuthentication.SignOut();
            return Json(new { message = "logout success" });
        }

        [System.Web.Http.HttpPost]
        public ActionResult Login(LoginModel model)
        {
            var obj = new { message = "Login success", status = true };
            var memberService = Services.MemberService;
            var user = memberService.GetByUsername(model.Username);

            if (user == null)
                return Json(new { message = "Username or password is incorrect", status = false });
            var isActive = user.GetValue("UmbracoMemberIsActive") ?? 0;
            if (isActive == null || (int)isActive == 0)
                return Json(new { message = "User account is not activated", status = false });

            if (Membership.ValidateUser(model.Username, model.Password))
            {
                FormsAuthentication.SetAuthCookie(model.Username, true);
                return Json(obj);
            }
            obj = new { message = "Username or password is incorrect", status = false };
            return Json(obj);
        }


        [System.Web.Http.HttpPost]
        public ActionResult Register(RegisterModel model, string returnUrl)
        {
            var result = new { message = "Register success", status = true };
            model.Email = model.Username;
            if (ModelState.IsValid)
            {
                if (!Util.IsMemberExist(model.Username))
                {
                    IMember member = Current.Services.MemberService.CreateMember(model.Username, model.Email, model.Name, "Member");
                    try
                    {
                        Current.Services.MemberService.Save(member);
                        Current.Services.MemberService.SavePassword(member, model.Password);
                        if (member.Id > 0)
                            return Json(result);
                        else
                        {
                            result = new { message = "has error", status = false };
                            return Json(result);
                        }
                    }
                    catch (Exception ex)
                    {
                        Current.Services.MemberService.Delete(member);
                        result = new { message = "length requires 10 characters", status = false };
                        return Json(result);
                    }
                }
                else
                {
                    result = new { message = "Username already exists", status = false };
                    return Json(result);
                }

            }
            result = new { message = "Invalid infomation", status = false };
            return Json(result);
        }

        public ActionResult BusinessSaveData(string dataJson)
        {
            var result = new { message = "sucess", status = true };

            var userName = Members.CurrentUserName;
            var memberService = Services.MemberService;
            var customMember = memberService.GetByEmail(userName);
            if (customMember == null)
                return Json(new { message = "Not logged in", status = false });
            dynamic dataPost = "{}";
            if (!string.IsNullOrWhiteSpace(dataJson))
                dataPost = JsonConvert.DeserializeObject<dynamic>(dataJson);

            customMember.Properties[ConfigurationManager.AppSettings["IPEx.Members.Business.Name"]].SetValue(dataPost[ConfigurationManager.AppSettings["IPEx.Members.Business.Name"]].ToString());
            customMember.Properties[ConfigurationManager.AppSettings["IPEx.Members.Business.TradingYear"]].SetValue(dataPost[ConfigurationManager.AppSettings["IPEx.Members.Business.TradingYear"]].ToString());

            if (!string.IsNullOrWhiteSpace(dataPost[ConfigurationManager.AppSettings["IPEx.Members.Business.Sector"]].ToString()))
            {
                customMember.Properties[ConfigurationManager.AppSettings["IPEx.Members.Business.Sector"]].SetValue($"umb://document/{dataPost[ConfigurationManager.AppSettings["IPEx.Members.Business.Sector"]].ToString().Replace("-", "")}");
            }
            else
            {
                customMember.Properties[ConfigurationManager.AppSettings["IPEx.Members.Business.Sector"]].SetValue("");
            }

            if (!string.IsNullOrWhiteSpace(dataPost[ConfigurationManager.AppSettings["IPEx.Members.Business.SubSector"]].ToString()))
            {
                customMember.Properties[ConfigurationManager.AppSettings["IPEx.Members.Business.SubSector"]].SetValue($"umb://document/{dataPost[ConfigurationManager.AppSettings["IPEx.Members.Business.SubSector"]].ToString().Replace("-", "")}");
            }
            else
            {
                customMember.Properties[ConfigurationManager.AppSettings["IPEx.Members.Business.SubSector"]].SetValue("");
            }

            if (!string.IsNullOrWhiteSpace(dataPost[ConfigurationManager.AppSettings["IPEx.Members.Business.Role"]].ToString()))
            {
                customMember.Properties[ConfigurationManager.AppSettings["IPEx.Members.Business.Role"]].SetValue($"umb://document/{dataPost[ConfigurationManager.AppSettings["IPEx.Members.Business.Role"]].ToString().Replace("-", "")}");
            }
            else
            {
                customMember.Properties[ConfigurationManager.AppSettings["IPEx.Members.Business.Role"]].SetValue("");
            }

            if (!string.IsNullOrWhiteSpace(dataPost[ConfigurationManager.AppSettings["IPEx.Members.Business.Funded"]].ToString()))
            {
                customMember.Properties[ConfigurationManager.AppSettings["IPEx.Members.Business.Funded"]].SetValue($"umb://document/{dataPost[ConfigurationManager.AppSettings["IPEx.Members.Business.Funded"]].ToString().Replace("-", "")}");
            }
            else
            {
                customMember.Properties[ConfigurationManager.AppSettings["IPEx.Members.Business.Funded"]].SetValue("");
            }

            if (!string.IsNullOrWhiteSpace(dataPost[ConfigurationManager.AppSettings["IPEx.Members.Business.Gender"]].ToString()))
            {
                customMember.Properties[ConfigurationManager.AppSettings["IPEx.Members.Business.Gender"]].SetValue($"umb://document/{dataPost[ConfigurationManager.AppSettings["IPEx.Members.Business.Gender"]].ToString().Replace("-", "")}");
            }
            else
            {
                customMember.Properties[ConfigurationManager.AppSettings["IPEx.Members.Business.Gender"]].SetValue("");
            }

            if (!string.IsNullOrWhiteSpace(dataPost[ConfigurationManager.AppSettings["IPEx.Members.Business.Region"]].ToString()))
            {
                customMember.Properties[ConfigurationManager.AppSettings["IPEx.Members.Business.Region"]].SetValue($"umb://document/{dataPost[ConfigurationManager.AppSettings["IPEx.Members.Business.Region"]].ToString().Replace("-", "")}");
            }
            else
            {
                customMember.Properties[ConfigurationManager.AppSettings["IPEx.Members.Business.Region"]].SetValue("");
            }

            memberService.Save(customMember);
            return Json(result);
        }

        public ActionResult IPSaveData(string dataJson)
        {
            var result = new { message = "sucess", status = true };
            var model = new List<dynamic>();
            var dataPost = new List<dynamic>();
            var userName = Members.CurrentUserName;
            var memberService = Services.MemberService;
            var customMember = memberService.GetByEmail(userName);
            if (customMember == null)
                return Json(new { message = "Not logged in", status = false });
            if (!string.IsNullOrWhiteSpace(dataJson))
                dataPost = JsonConvert.DeserializeObject<List<dynamic>>(dataJson);

            var user = Members.GetCurrentMember();
            var property = user.GetProperty(ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber"]);
            var propertyValue = property.GetSourceValue();
            var top = dataPost.FirstOrDefault();

            if (propertyValue != null)
            {
                model = JsonConvert.DeserializeObject<List<dynamic>>(propertyValue.ToString());

                model = model.Where(x => x[ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber.Selection"]] != $"umb://document/{top[ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber.Selection"]].ToString().Replace("-", "")}").ToList();
            }
            var JsonResult = "[";
            foreach (var data in model)
            {
                JsonResult += "{";
                JsonResult += $" \"key\": \"{Guid.NewGuid().ToString()}\" ,";
                JsonResult += $" \"name\": \"Item add\" ,";
                JsonResult += $" \"{ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber.Selection"]}\": \"{data[ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber.Selection"]]}\" ,";
                JsonResult += $" \"{ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber.Value"]}\": \"{data[ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber.Value"]].ToString()}\" ,";
                JsonResult += $" \"ncContentTypeAlias\": \"{ConfigurationManager.AppSettings["IPEx.IP.Control.PrefixNumberData"]}\" ,";
                JsonResult += "},";
            }

            if (dataPost.Count() > 1 || top[ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber.Value"]] != null)
            {
                foreach (var data in dataPost)
                {
                    JsonResult += "{";
                    JsonResult += $" \"key\": \"{Guid.NewGuid().ToString()}\" ,";
                    JsonResult += $" \"name\": \"Item add\" ,";
                    JsonResult += $" \"{ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber.Selection"]}\": \"umb://document/{data[ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber.Selection"]].ToString().Replace("-", "")}\" ,";
                    JsonResult += $" \"{ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber.Value"]}\": \"{data[ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber.Value"]].ToString()}\" ,";
                    JsonResult += $" \"ncContentTypeAlias\": \"{ConfigurationManager.AppSettings["IPEx.IP.Control.PrefixNumberData"]}\" ,";
                    JsonResult += "},";
                }
            }

            if (JsonResult.Length > 2)
                JsonResult = JsonResult.Remove(JsonResult.Length - 1, 1);

            JsonResult += "]";
            customMember.SetValue(ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber"], JsonResult);
            memberService.Save(customMember);
            var memberNew = memberService.GetByUsername(userName);

            var currentData = memberNew?.GetIdFromNestedContentAlias(ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber"], ConfigurationManager.AppSettings["IPEx.Members.IP.PrefixNumber.Selection"]);
            return Json(new
            {
                message = "sucess",
                status = true,
                data = currentData
            });
        }

        public ActionResult URSaveData(string dataJson)
        {
            var result = new { message = "sucess", status = true };
            var dataPost = new List<string>();
            var userName = Members.CurrentUserName;
            var memberService = Services.MemberService;
            var customMember = memberService.GetByEmail(userName);
            if (customMember == null)
                return Json(new { message = "Not logged in", status = false });
            if (!string.IsNullOrWhiteSpace(dataJson))
                dataPost = JsonConvert.DeserializeObject<List<string>>(dataJson);
            var JsonResult = "[";
            foreach (var data in dataPost)
            {
                JsonResult += "{";
                JsonResult += $" \"key\": \"{Guid.NewGuid().ToString()}\" ,";
                JsonResult += $" \"name\": \"Item add\" ,";
                JsonResult += $" \"{ConfigurationManager.AppSettings["IPEx.Members.UR.SelectedValue.Value"]}\": \"umb://document/{data.ToString().Replace("-", "")}\" ,";
                JsonResult += $" \"ncContentTypeAlias\": \"{ConfigurationManager.AppSettings["IPEx.Data.Partial.Unregister.Selection"]}\" ,";
                JsonResult += "},";
            }

            if (JsonResult.Length > 2)
                JsonResult = JsonResult.Remove(JsonResult.Length - 1, 1);
            JsonResult += "]";

            customMember.SetValue(ConfigurationManager.AppSettings["IPEx.Members.UR.SelectedValue"], JsonResult);
            memberService.Save(customMember);

            var memberNew = memberService.GetByUsername(userName);
            var currentData = memberNew?.GetIdFromNestedContentAlias(ConfigurationManager.AppSettings["IPEx.Members.UR.SelectedValue"], ConfigurationManager.AppSettings["IPEx.Members.UR.SelectedValue.Value"]);
            return Json(new
            {
                message = "sucess",
                status = true,
                data = currentData
            });
        }

        public ActionResult IASaveData(string dataJson)
        {
            var result = new { message = "sucess", status = true };
            var model = new List<dynamic>();
            var dataPost = new List<dynamic>();
            var userName = Members.CurrentUserName;
            var memberService = Services.MemberService;
            var customMember = memberService.GetByEmail(userName);
            if (customMember == null)
                return Json(new { message = "Not logged in", status = false });

            if (!string.IsNullOrWhiteSpace(dataJson))
                dataPost = JsonConvert.DeserializeObject<List<dynamic>>(dataJson);

            var user = Members.GetCurrentMember();
            var property = user.GetProperty(ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue"]);
            var propertyValue = property.GetSourceValue();
            var top = dataPost.FirstOrDefault();

            if (propertyValue != null)
            {
                model = JsonConvert.DeserializeObject<List<dynamic>>(propertyValue.ToString());
                model = model.Where(x => x[ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue.Selection"]] != $"umb://document/{top[ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue.Selection"]].ToString().Replace("-", "")}").ToList();
            }

            var JsonResult = "[";
            foreach (var data in model)
            {
                JsonResult += "{";
                JsonResult += $" \"key\": \"{Guid.NewGuid().ToString()}\" ,";
                JsonResult += $" \"name\": \"Item add\" ,";
                JsonResult += $" \"{ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue.SubSelection"]}\": \"{data[ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue.SubSelection"]]}\" ,";
                JsonResult += $" \"{ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue.Selection"]}\": \"{data[ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue.Selection"]]}\" ,";
                JsonResult += $" \"ncContentTypeAlias\": \"{ConfigurationManager.AppSettings["IPEx.IA.Control.Selected"]}\" ,";
                JsonResult += "},";
            }

            foreach (var data in dataPost)
            {
                JsonResult += "{";
                JsonResult += $" \"key\": \"{Guid.NewGuid().ToString()}\" ,";
                JsonResult += $" \"name\": \"Item add\" ,";
                JsonResult += $" \"{ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue.SubSelection"]}\": \"umb://document/{data[ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue.SubSelection"]].ToString().Replace("-", "")}\" ,";
                JsonResult += $" \"{ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue.Selection"]}\": \"umb://document/{data[ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue.Selection"]].ToString().Replace("-", "")}\" ,";
                JsonResult += $" \"ncContentTypeAlias\": \"{ConfigurationManager.AppSettings["IPEx.IA.Control.Selected"]}\" ,";
                JsonResult += "},";
            }

            if (JsonResult.Length > 2)
                JsonResult = JsonResult.Remove(JsonResult.Length - 1, 1);
            JsonResult += "]";

            customMember.SetValue(ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue"], JsonResult);
            memberService.Save(customMember);
            var memberNew = memberService.GetByUsername(userName);
            var currentData = memberNew?.GetIdFromNestedContentAlias(ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue"], ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue.Selection"], ConfigurationManager.AppSettings["IPEx.Members.IA.SelectedValue.SubSelection"]);

            return Json(new
            {
                message = "sucess",
                status = true,
                data = currentData
            });
        }

        [System.Web.Http.HttpPost]
        public ActionResult SendEmailForgotPW(string email)
        {
            var memberService = Services.MemberService;
            var user = memberService.GetByUsername(email);
            var mailTemplate = "IPExForgotPassword";
            var senderTitle = "IPExplorer reset password";
            var subject = $"Password reset on ipexplorer.biz";
            var reciverName = user?.Name;
            var contextUrl = HttpContext.Request.Url;
            if (user == null)
            {
                return Json(new { status = false, message = "Email does not exist" });
            }

            var token = Guid.NewGuid().ToString();
            user.SetValue("TokenResetPW", token);
            user.SetValue("TokenResetPWExpired", DateTime.Now.AddDays(1));
            Current.Services.MemberService.Save(user);

            var tokenUrl = $"email={email}&token={token}".Encrypt();
            var mailTokens = new List<KeyValuePair<string, string>>();
            var link = $"{contextUrl.Scheme}://{contextUrl.Host}/reset?token={tokenUrl}";
            var objOne = new KeyValuePair<string, string>("{LinkToken}", link);
            var objTwo = new KeyValuePair<string, string>("{userName}", user?.Username);
            var objThree = new KeyValuePair<string, string>("{Name}", user?.Name);
            var objTfor = new KeyValuePair<string, string>("{logo}", "https://dev.ipexplorer.biz/assets/ipex/images/logo.svg");
            mailTokens.Add(objOne);
            mailTokens.Add(objTwo);
            mailTokens.Add(objThree);
            mailTokens.Add(objTfor);
            var result = SendMail(mailTokens: mailTokens, mailTemplate: mailTemplate, emaiReciver: email, nameReciver: reciverName, senderTitle: senderTitle, subject: subject);

            return Json(new { status = result.status, message = result.status ? "Thank you please check your email for the reset link" : result.message });
        }

        private string RawDataBodyEmail(List<KeyValuePair<string, string>> model, string mailTemplate)
        {
            string Path_URL = HttpRuntime.AppDomainAppPath;
            string body = string.Empty;

            using (StreamReader reader = new StreamReader(Path_URL + $"/Views/Partials/EmailTemplate/{mailTemplate}.cshtml"))
            {
                body = reader.ReadToEnd();
            }

            foreach (var item in model)
            {
                body = body.Replace(item.Key, item.Value);
            }
            return body;
        }

        private (bool status, string message) SendMail(List<KeyValuePair<string, string>> mailTokens, string mailTemplate, string emaiReciver, string nameReciver, string senderTitle, string subject)
        {
            var siteConfig = Umbraco.Content(2865);
            var configEmailSender = siteConfig.Value("emailSender").ToString();
            var configSMTP = siteConfig.Value("sMTP").ToString();
            int configPort = int.Parse(siteConfig.Value("port").ToString());
            var configPassword = siteConfig.Value("password").ToString();

            try
            {
                var senderEmail = new MailAddress(configEmailSender, senderTitle);
                var receiverEmail = new MailAddress(emaiReciver, nameReciver);
                var smtp = new SmtpClient
                {
                    Host = configSMTP,
                    Port = configPort,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(senderEmail.Address, configPassword)
                };

                using (var mess = new MailMessage(senderEmail, receiverEmail) { })
                {
                    mess.IsBodyHtml = true;
                    mess.Body = RawDataBodyEmail(mailTokens, mailTemplate);
                    mess.Subject = subject;
                    smtp.Send(mess);
                }
                return (status: true, message: "");
            }
            catch (Exception ex)
            {
                return (status: true, message: ex.Message);
            }
        }

        [System.Web.Http.HttpPost]
        public ActionResult SendEmailActiveAccount(string email)
        {
            var memberService = Services.MemberService;
            var user = memberService.GetByUsername(email);
            var mailTemplate = "IPExActiveAccount";
            var senderTitle = "IPExplorer active password mail";
            var subject = $"Confirm your account on ipexplorer.biz";
            var reciverName = user?.Name;
            var contextUrl = HttpContext.Request.Url;

            if (user == null)
                return Json(new { status = false, message = "Email does not exist" });

            var token = Guid.NewGuid().ToString();
            user.SetValue("TokenActiveAccount", token);
            user.SetValue("TokenActiveAccountExpired", DateTime.Now.AddDays(1));
            Current.Services.MemberService.Save(user);

            var tokenUrl = $"email={email}&token={token}".Encrypt();

            var mailTokens = new List<KeyValuePair<string, string>>();
            var link = $"{contextUrl.Scheme}://{contextUrl.Host}/registered/activate?token={tokenUrl}";
            var obj = new KeyValuePair<string, string>("{LinkToken}", link);
            var objName = new KeyValuePair<string, string>("{Name}", user?.Name);
            var objlogo = new KeyValuePair<string, string>("{logo}", "https://dev.ipexplorer.biz/assets/ipex/images/logo.svg");
            mailTokens.Add(obj);
            mailTokens.Add(objName);
            mailTokens.Add(objlogo);
            var result = SendMail(mailTokens: mailTokens, mailTemplate: mailTemplate, emaiReciver: email, nameReciver: reciverName, senderTitle: senderTitle, subject: subject);

            return Json(new { status = result.status, message = result.message });
        }

        [HttpPost]
        public ActionResult ForgotPassowdValidateToken(string token)
        {
            string paramsUrl = "";
            try
            {
                paramsUrl = token.Decrypt();
            }
            catch(Exception ex)
            {
                return Json(new { status = (int)TokenMessage.TokenIsInCorrect });
            }
            
            var email = "";
            token = "";
            if (!string.IsNullOrWhiteSpace(paramsUrl))
            {
                if (paramsUrl.Contains('&') && paramsUrl.Contains('='))
                {
                    email = paramsUrl.Split('&')[0]?.Split('=')[1];
                    token = paramsUrl.Split('&')[1]?.Split('=')[1];
                }
            }
            var memberService = Services.MemberService;
            var user = memberService.GetByUsername(email);
            var status = ValidateToken(user, token, "TokenResetPW", "TokenResetPWExpired");
            return Json(new { status = status });
        }

        [HttpPost]
        public ActionResult ChangePassowrd(string token, string password)
        {
            string paramsUrl = "";

            try
            {
                paramsUrl = token.Decrypt();
            }
            catch (Exception ex)
            {
                return Json(new { status = (int)TokenMessage.TokenIsInCorrect });
            }

            var email = "";
            if (!string.IsNullOrWhiteSpace(paramsUrl))
            {
                if (paramsUrl.Contains('&') && paramsUrl.Contains('='))
                {
                    email = paramsUrl.Split('&')[0]?.Split('=')[1];
                    token = paramsUrl.Split('&')[1]?.Split('=')[1];
                }
            }
            var memberService = Services.MemberService;
            var user = memberService.GetByUsername(email);

            var status = ValidateToken(user, token, "TokenResetPW", "TokenResetPWExpired");

            if(status != 0)
                return Json(new { status = 4 });
            try
            {
                Current.Services.MemberService.SavePassword(user, password);
                user.SetValue("TokenResetPW", "");
                user.SetValue("TokenResetPWExpired", "");
                Current.Services.MemberService.Save(user);
                return Json(new { status = 0, message = "Change password success" });
            }
            catch (Exception ex)
            {
                return Json(new { status = 4 });
            }

        }

        [HttpPost]
        public ActionResult ActiveAccount(string token)
        {
            string email = "";
            string paramsUrl = "";

            try
            {
                paramsUrl = token.Decrypt();
            }
            catch (Exception ex)
            {
                return Json(new { status = (int)TokenMessage.TokenIsInCorrect });
            }

            if (!string.IsNullOrWhiteSpace(paramsUrl))
            {
                if (paramsUrl.Contains('&') && paramsUrl.Contains('='))
                {
                    email = paramsUrl.Split('&')[0]?.Split('=')[1];
                    token = paramsUrl.Split('&')[1]?.Split('=')[1];
                }
            }

            var memberService = Services.MemberService;
            var user = memberService.GetByUsername(email);

            var status = ValidateToken(user, token, "TokenActiveAccount", "TokenActiveAccountExpired");
            if(status == 0)
            {
                user.SetValue("UmbracoMemberIsActive", true);
                user.SetValue("TokenActiveAccount", "");
                user.SetValue("TokenActiveAccountExpired", "");
                Current.Services.MemberService.Save(user);
            }

            return Json(new { status = status });
        }

        [HttpPost]
        public ActionResult InitDataAccountActive()
        {
            var memberService = Services.MemberService;
            var members = memberService.GetAllMembers();
            foreach(var member in members)
            {
                member.SetValue("UmbracoMemberIsActive", true);
                Current.Services.MemberService.Save(member);
            }

            return Json(new { status = true, message = "update user default success" });
        }


        private int ValidateToken(IMember user,string token, string aliasToken, string aliasExpired)
        {
            if (user == null)
                return (int)TokenMessage.TokenIsInCorrect;

            if (user.GetValue(aliasToken) == null)
                return (int)TokenMessage.TokenIsInCorrect;

            var str = user.GetValue(aliasToken);
            if (user.GetValue(aliasToken)?.ToString() != token)
                return (int)TokenMessage.TokenIsInCorrect;

            if (user.GetValue(aliasExpired) == null)
                return (int)TokenMessage.TokenIsInCorrect;

            if ((DateTime)user.GetValue(aliasExpired) > DateTime.Now.AddDays(1))
                return (int)TokenMessage.TokenHasExpired;

            return (int)TokenMessage.Success;
        }

    }
}