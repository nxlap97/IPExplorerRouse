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
using Umbraco.Web.PublishedModels;
using System.Text.RegularExpressions;
using Umbraco.Web.Models;
namespace Rousesite_Umbraco.Controllers
    
{
    public class InsightsController : UmbracoApiController
    {
        IEnumerable<IPublishedContent> newsResult;
        List<NewsModel> listNews = new List<NewsModel>();
        int newsCount = 0;
        IEnumerable<IPublishedContent> resultAll;
        IEnumerable<IPublishedContent> newsResultFinal;

        public static int CountWord(string content)
        {
            string pattern = "[^\\w]";

            string[] words = null;
            int i = 0;
            int count = 0;

            words = Regex.Split(content, pattern, RegexOptions.IgnoreCase);
            for (i = words.GetLowerBound(0); i <= words.GetUpperBound(0); i++)
            {
                if (words[i].ToString() == string.Empty)
                {
                    count = count - 1;
                }

                count = count + 1;
            }

            return count;


        }

        public static string StripHTML(string input)
        {
            return Regex.Replace(input, "<.*?>", String.Empty);
        }


        public static string EstimateTimeToRead(int number)
        {

            int wordPerMin = 250;
            int result = number / wordPerMin;

            if (result == 0)
            {
                result = 1;
            }

            if (result > 10)
            {
                result = result - 3;
            }

            if (result > 1)
            {
                return result + " minute read";

            }
            else
            {
                return result + " minute read";
            }
        }

        public bool CheckTypes(IPublishedContent types, string[] keyWord)
        {

            foreach (var key in keyWord)
            {

                if (types.Name.ToString().Trim().ToLower() == key.Trim().ToLower())
                {
                    return true;
                    break;
                }
            }
            return false;
        }

        public bool CheckIndustry(IEnumerable<IPublishedContent> list, string keyWord)
        {
            foreach (var item in list)
            {

                if (item.Name.ToString().ToLower().Trim() == keyWord.ToLower().Trim())
                {
                    return true;
                }

            }

            return false;
        }

        public bool CheckServices(IEnumerable<IPublishedContent> list, string keyWord)
        {
            foreach (var item in list)
            {

                if (item.Name.ToString().ToLower().Trim() == keyWord.ToLower().Trim())
                {
                    return true;
                }

            }

            return false;
        }

        public bool CheckRegion(IEnumerable<IPublishedContent> regions, string keyWord)
        {

            foreach (var item in regions)
            {

                if (item.Name.ToString().ToLower().Trim() == keyWord.ToLower().Trim())
                {
                    return true;
                }

            }

            return false;
        }


        [ValidateAntiForgeryToken]
        [System.Web.Http.HttpPost]
        public string SearchNews(NewsModel model)
        {
            long resultCount = 0;
            var pageSize = 9;
            var page = Convert.ToDouble(model.Page);

            if (ModelState.IsValid)
            {
                var data = model.Data;
                dynamic stuff = JsonConvert.DeserializeObject(data);
                string ID = "9943175f-8999-4d55-ba58-65d41fa9bedf";
                string industry = stuff.industry;
                string services = stuff.services;
                string regions = stuff.regions;
                String[] types = stuff.types.ToObject<string[]>();
                string featuredTopics = stuff.featuredTopics;
                page = Convert.ToDouble(stuff.page);

                Logger.Info<PeopleModel>(regions + "fffffffffff");
                //try
                //{
                newsResult = Umbraco.Content(Guid.Parse(ID)).Descendants().OfTypes("news", "webinar").OrderByDescending(x => x.CreateDate).Where(x => x.IsVisible());

                if (industry != "all")
                {
                    newsResult = newsResult.Where(x => x.Value<IEnumerable<IPublishedContent>>("newsIndustry") != null && x.Value<IEnumerable<IPublishedContent>>("newsIndustry").Count() > 0)
                    .Where(x => CheckIndustry(x.Value<IEnumerable<IPublishedContent>>("newsIndustry"), industry));
                }

                if (services != "all")
                {
                    newsResult = newsResult.Where(x => x.Value<IEnumerable<IPublishedContent>>("newsServices") != null && x.Value<IEnumerable<IPublishedContent>>("newsServices").Count() > 0)
                    .Where(x => CheckServices(x.Value<IEnumerable<IPublishedContent>>("newsServices"), services));
                }

                if (regions != "all")
                {

                    newsResult = newsResult.Where(x => x.Value<IEnumerable<IPublishedContent>>("newsRegion") != null && x.Value<IEnumerable<IPublishedContent>>("newsRegion").Count() > 0)
                    .Where(x => CheckRegion(x.Value<IEnumerable<IPublishedContent>>("newsRegion"), regions));
                }


                if (types[0] != "all")
                {

                    newsResult = newsResult.Where(x => x.Value<IPublishedContent>("newsTypes") != null)
                                .Where(x => CheckTypes(x.Value<IPublishedContent>("newsTypes"), types));


                }


                resultCount = newsResult != null && newsResult.Any() ? newsResult.Count() : 0;


                var totalPages = (int)Math.Ceiling((double)resultCount / (double)pageSize);
                if (page > totalPages)
                {
                    page = totalPages;
                }
                else if (page < 1)
                {
                    page = 1;
                }

                Logger.Info<PeopleModel>(resultCount + "fffffffffff");


                if (resultCount > 0)
                {
                    foreach (var newsItem in newsResult.Skip(((int)page - 1) * pageSize).Take(pageSize))
                    {
                        var newsTitle = "";
                        var newsSummary = "";
                        var tempString = "";

                        try
                        {
                            newsTitle = (newsItem.Value("newsTitle").ToString().Length > 80) ? newsItem.Value("newsTitle").ToString().Substring(0, 80) : newsItem.Value("newsTitle").ToString();
                            tempString = StripHTML(newsItem.Value("newsSummary").ToString());
                            newsSummary = (tempString.ToString().Length > 120) ? tempString.Substring(0, 120) : tempString;
                        }
                        catch (Exception e)
                        {

                        }

                        string newsImage = "";
                        NewsModel item = new NewsModel();
                        item.Name = newsTitle;

                        if (newsItem.Value("webinarThirdParty") != null)
                        {
                            item.Url = newsItem.Value<Link>("webinarThirdParty").Url;

                        }
                        else
                        {
                            item.Url = newsItem.Url;
                        }

                        //item.Url = newsItem.Url;
                        item.Date = newsItem.CreateDate.ToString("dd MMM yyyy", null);
                        item.Sumary = newsSummary;
                        if (newsItem.HasValue("newsHashtag"))
                        {
                            item.Tags = newsItem.Value<string[]>("newsHashtag");
                        }


                        if (newsItem.Value("minuteRead") != null && newsItem.Value("minuteRead").ToString() != "")
                        {
                            var timeRead = newsItem.Value("minuteRead").ToString();
                            if (timeRead == "0")
                            {
                                timeRead = "1"; }

                            item.TimeRead = timeRead + " minute read";

                        } else
                        {
                            item.TimeRead = EstimateTimeToRead(CountWord(newsItem.Value("newsContent").ToString()));
                        }





                        try
                        {
                            if (newsItem.Value<IPublishedContent>("newsImage") != null)
                            {

                                if (newsItem.Value<IPublishedContent>("newsImage").GetCropUrl("InsightsItem") != null)
                                {
                                    newsImage = newsItem.Value<IPublishedContent>("newsImage").GetCropUrl("InsightsItem").ToString();
                                }
                                else
                                {
                                    newsImage = newsItem.Value<IPublishedContent>("newsImage").Url.ToString();
                                }
                            }

                        }
                        catch (Exception e)
                        {
                            newsImage = "";

                        }

                        item.Image = newsImage;

                        List<PeopleModel> listAuthor = new List<PeopleModel>();
                        try
                        {
                            foreach (IPublishedContent authorItem in newsItem.Value<IEnumerable<IPublishedContent>>("newsAuthor").Take(3))
                            {
                                /*Logger.Info<PeopleModel>(jobCount + "sssssssssssssss  content type : " + socialItem.Value<string>("socialNetworkName").ToString());*/
                                PeopleModel author = new PeopleModel();
                                //author.Name = authorItem.Value("profileName").ToString();
                                author.Name = authorItem.Name.ToString();

                                listAuthor.Add(author);

                            }
                        }
                        catch (Exception e)
                        {
                            newsImage = "";

                        }


                        item.Author = listAuthor;

                        listNews.Add(item);
                    }



                }



                InsightsPaginationModel pagination = new InsightsPaginationModel();
                pagination.News = listNews;
                pagination.Page = page;
                pagination.Total = totalPages;
                return JsonConvert.SerializeObject(pagination);


            }
            else
            {
                InsightsPaginationModel pagination = new InsightsPaginationModel();
                pagination.Total = 0;
                return JsonConvert.SerializeObject(pagination);

            }




            //}
            //catch (InvalidCastException e)
            //{
            //    throw new InvalidCastException("Put your error message here.", e);


            //}

            return JsonConvert.SerializeObject(newsResult);



        }

    
        


       
        public string GetLastNews()
        {
            NewsModel model = new NewsModel();
            long resultCount = 0;         

            if (ModelState.IsValid)
            {             
               
                string ID = "08427bd0-2141-4af2-96f6-158adcccddf9";


                //try
                //{
                newsResult =  Umbraco.Content(Guid.Parse(ID))
                               .Descendants().OfTypes("news")
                               .Where(x => x.HasValue("publishedDate"))
                               .OrderByDescending(x => x.Value<System.DateTime>("publishedDate"))
                               .Where(x => x.IsVisible()).Take(4);
               
                

                newsResult = newsResult.Take(4);
                resultCount = newsResult != null && newsResult.Any() ? newsResult.Count() : 0;


        


                if (resultCount > 0)
                {
                    foreach (var newsItem in newsResult)
                    {
                        var newsTitle = "";
                        var newsSummary = "";

                        try
                        {
                            newsTitle = (newsItem.Value("newsTitle").ToString().Length > 80) ? newsItem.Value("newsTitle").ToString().Substring(0, 80) : newsItem.Value("newsTitle").ToString();
                            newsSummary = (newsItem.Value("newsSummary").ToString().Length > 120) ? newsItem.Value("newsSummary").ToString().Substring(0, 120) : newsItem.Value("newsSummary").ToString();
                        }
                        catch (Exception e)
                        {

                        }
                        string newsImage = "";
                        NewsModel item = new NewsModel();
                        item.Name = newsTitle;
                        item.Url = newsItem.Url;

                        item.Sumary = newsSummary;

                        listNews.Add(item);
                    }



                }



                InsightsPaginationModel pagination = new InsightsPaginationModel();             
                pagination.News = listNews;           
                return JsonConvert.SerializeObject(pagination);
              


            }
            else
            {
                InsightsPaginationModel pagination = new InsightsPaginationModel();
                pagination.Total = 0;
                return JsonConvert.SerializeObject(pagination);

            }




            //}
            //catch (InvalidCastException e)
            //{
            //    throw new InvalidCastException("Put your error message here.", e);


            //}

            return JsonConvert.SerializeObject(newsResult);



        }

      
        public string GetTopArticles()
        {
            NewsModel model = new NewsModel();
            long resultCount = 0;
            var pageSize = 8;
            var page = Convert.ToDouble(model.Page);

            if (ModelState.IsValid)
            {
               
                string ID = "89cda73a-5d7f-485d-ba47-8cf471e1678b";


                //try
                //{
                
                var homeModel = Umbraco.Content(Guid.Parse(ID));

                var newsResult = homeModel.Value<IEnumerable<IPublishedElement>>("topNewsSection");
                Logger.Info<PeopleModel>(newsResult + "INSIGHT 111   fffffffffff");
               




                resultCount = newsResult != null && newsResult.Any() ? newsResult.Count() : 0;

                Logger.Info<PeopleModel>(resultCount + "INSIGHT fffffffffff");


                var totalPages = (int)Math.Ceiling((double)resultCount / (double)pageSize);
                if (page > totalPages)
                {
                    page = totalPages;
                }
                else if (page < 1)
                {
                    page = 1;
                }

                Logger.Info<PeopleModel>(newsResult + "fffffffffff");


                if (resultCount > 0)
                {
                    foreach (var articleItem in newsResult.Skip(((int)page - 1) * pageSize).Take(pageSize))
                    {

                        var newsItem = articleItem.Value<IPublishedContent>("news");

                        string newsImage = "";
                        NewsModel item = new NewsModel();
                        item.Name = newsItem.Name;
                        item.Url = newsItem.Url;
                        item.Sumary = newsItem.Value("newsSummary").ToString();



                        listNews.Add(item);
                    }



                }



                InsightsPaginationModel pagination = new InsightsPaginationModel();
                pagination.News = listNews;
                pagination.Page = page;
                pagination.Total = totalPages;
                return JsonConvert.SerializeObject(pagination);


            }
            else
            {
                InsightsPaginationModel pagination = new InsightsPaginationModel();
                pagination.Total = 0;
                return JsonConvert.SerializeObject(pagination);

            }




            //}
            //catch (InvalidCastException e)
            //{
            //    throw new InvalidCastException("Put your error message here.", e);


            //}

            return JsonConvert.SerializeObject(newsResult);



        }



        [ValidateAntiForgeryToken]
        [System.Web.Http.HttpPost]
        public string GetNewsByID(NewsModel model)
        {
         
            

            if (ModelState.IsValid)
            {
                var data = model.Data;
                dynamic stuff = JsonConvert.DeserializeObject(data);
                string ID = model.ID.ToString();
                string newsId = stuff.newsId;
                string typeSearch = stuff.typeSearch;               


                //try
                //{
                IPublishedContent newsResult = Umbraco.Content(newsId);

                NewsModel newsData = new NewsModel();



                if (newsResult != null)
                {
                    var newsTitle = "";
                    var newsSummary = "";

                    try
                    {
                        newsTitle = (newsResult.Value("newsTitle").ToString().Length > 80) ? newsResult.Value("newsTitle").ToString().Substring(0, 80) : newsResult.Value("newsTitle").ToString();
                        newsSummary = (newsResult.Value("newsSummary").ToString().Length > 120) ? newsResult.Value("newsSummary").ToString().Substring(0, 120) : newsResult.Value("newsSummary").ToString();
                    }
                    catch (Exception e)
                    {

                    }
                    string newsImage = "";
                    newsData.Name = newsTitle;
                    newsData.Url = newsResult.Url;
                    newsData.Date = newsResult.CreateDate.ToString("dd MMM yyyy", null);
                    newsData.Sumary = newsSummary;
                    if (newsResult.HasValue("newsHashtag"))
                    {
                        newsData.Tags = newsResult.Value<string[]>("newsHashtag");
                    }
                       
                    newsData.TimeRead = EstimateTimeToRead(CountWord(newsResult.Value("newsContent").ToString()));

                        //Add Image
                        try
                        {
                            if (newsResult.Value<IPublishedContent>("newsImage") != null)
                            {

                                if (newsResult.Value<IPublishedContent>("newsImage").GetCropUrl("SectionImageLaptop") != null)
                                {
                                    newsImage = newsResult.Value<IPublishedContent>("newsImage").GetCropUrl("SectionImageLaptop").ToString();
                                }
                                else
                                {
                                    newsImage = newsResult.Value<IPublishedContent>("newsImage").Url.ToString();
                                }
                            }

                        }
                        catch (Exception e)
                        {
                            newsImage = "";

                        }

                        newsData.Image = newsImage;


                    //Add author list
                        List<PeopleModel> listAuthor = new List<PeopleModel>();
                     try
                    {
                        foreach (IPublishedContent authorItem in newsResult.Value<IEnumerable<IPublishedContent>>("newsAuthor").Take(3))
                        {
                            /*Logger.Info<PeopleModel>(jobCount + "sssssssssssssss  content type : " + socialItem.Value<string>("socialNetworkName").ToString());*/
                            PeopleModel author = new PeopleModel();
                            //author.Name = authorItem.Value("profileName").ToString();
                            author.Name = authorItem.Name.ToString();

                            listAuthor.Add(author);

                        }
                    } catch (Exception e)
                    {

                    }
                       

                          newsData.Author = listAuthor;               
                }





                return JsonConvert.SerializeObject(newsData);


            }
            else
            {
                InsightsPaginationModel pagination = new InsightsPaginationModel();
                pagination.Total = 0;
                return JsonConvert.SerializeObject(pagination);

            }




            //}
            //catch (InvalidCastException e)
            //{
            //    throw new InvalidCastException("Put your error message here.", e);


            //}

            return JsonConvert.SerializeObject(newsResult);



        }


    }
}