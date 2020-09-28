
$(document).ready(function () {

    if ($("#newsWebinarsID").length > 0) {
        let item = $("#types ul li[value=Webinars]").find("a");        
        console.log(item);
        console.log('item');
        setTimeout(function () {
            item.click();
        },200)
     
      
    }
    $("#serviceSectionController li").click(function () {
      
        let id = $(this).attr("section-id");
        console.log(id);
        let haveImage = $(this).attr("have-image");
        let position = 100;
        if (haveImage == 'true') {
            position = -300;
        }      
        console.log (position)
        $('html, body').animate({
            scrollTop: $('#' + id).offset().top - position
        }, 300)

    })

    

    $(document).on('click', '.filter-insight-dropdown .reset-filter', function (event) {
        $("#filterInsightResult").attr("filter-active", "true");
        $("#filterInsightResult").html("");
        var parentId = $(event.target.parentNode).attr("id");       
        let defaultText = $(this).prev().attr("text-default");

        $("#" + parentId + " .btn:first-child").text(defaultText);
        $("#" + parentId + " .btn:first-child").attr("value", "all");
        $("#" + parentId + " li").removeClass("select-active");
        $("#" + parentId).removeClass("active");
        $(this).removeClass("reset-filter");
        $(this).addClass("clear-filter");


        $("." + parentId).removeClass("active");
        $("#" + parentId).removeClass("active");

        
        if ($("#filterInsightResult").length > 0 || $("#newsWebinarsID").length > 0) {
            setTimeout(function () {
                resetFilterPage();
                FilterNews();
            }, 300)

        }

        if ($("#job-location-select".length > 0)) {
            setTimeout(function () {             
                console.log("parent IIIIII");
                console.log(parentId);
              
                if (parentId == "jobCountry") {
                    $("#" + "job-location-select").removeClass("active");
                    $("#" + "job-location-select" + " i").removeClass("reset-filter");
                    $("#" + "job-location-select" + " i").addClass("clear-filter");
                    $("#" + parentId + " .dropdown-toggle").attr("location-id", "1");
                    let textChange = $("#job-location-select p").attr("text-default");          
                    $("#job-location-select .dropdown-toggle").text(textChange);
                    $("#job-location-select .dropdown-toggle").attr("location-id","1");
              
                }

                if (parentId == "jobDepartment") {                  
                    $("#" + parentId + " .dropdown-toggle").attr("department-id", "1");                  
                  
                }

                let dataSearch = getDataToPostCareer();
                console.log(dataSearch)
                searchCareer(dataSearch);
            }, 200)

        }

        if ($("#peopleOurTeamSection").length > 0 || $("#people-search-result").length > 0)  {
          

         
            setTimeout(function () {
                $("#peopleOurTeamSection " + "#" + parentId).removeClass("active");
                $("#peopleOurTeamSection " + "#" + parentId + " i").removeClass("reset-filter");
                $("#" + parentId + " i").removeClass("reset-filter");

                $("#peopleOurTeamSection " + "#" + parentId + " i").addClass("clear-filter");
                $("#" + parentId + " i").addClass("clear-filter");
                resetDataSearch();
                let dataSearch = getDataSearchPeople();
                searchPeople(dataSearch);
            }, 100)
        }
   
       
    });

    

    $(document).on('click', '.clear-filter:not(.reset-filter)', function (event) {
        if ($("#peopleOurTeamSection").length > 0) {
            let itemDrop = $(this).prev();
            $(itemDrop).dropdown('toggle');
            event.stopPropagation();           
        } else {
            var parentId = $(event.target.parentNode).attr("id");
            console.log($("#" + parentId + " .dropdown-toggle"));
            $("#" + parentId + " .dropdown-toggle").dropdown('toggle');
            event.stopPropagation();
        }
        
    });

    $("#insightMobildeSearchArea .filter-insight-dropdown").click(function () {

        console.log("");
    })
        //Insight filter
    $(".filter-insight-dropdown li").click(function () {
        let itemId = $(this).attr("item-id");

        $("#filterInsightResult").attr("filter-active", "true");

        if ($("#search-results-page #filterInsightResult").length > 0) {
            $("#search-results-page  #filterInsightResult").html("");
        }

        //if ($("#newsWebinarsID").length > 0) {
        //    $("#newsWebinarsID").addClass("hide");
        //}




        $("#filterInsightResult").html("");
        
        resetFilterPage();
        let content = $(this).text();
        let parentId = $(this).parent().parent().attr("id");      

        $("#" + parentId + " .btn:first-child").html(content);
        $("#" + parentId + " .btn:first-child").attr("value", $(this).text());
        $("#" + parentId + " .filter-insight-dropdown .drop-icon").addClass("reset-filter");
        $("#" + parentId + " .filter-insight-dropdown .drop-icon").removeClass("clear-filter");
        $("#" + parentId + " li").removeClass("select-active");

        if ($("#jobDepartment").length > 0) {
            let departmentId = $(this).attr("department-id");
            $("#" + parentId + " .btn:first-child").attr("department-id", departmentId);
        }
        if ($("#jobCountry").length > 0) {
            let jobCountryId = $(this).attr("location-id");
            $("#" + parentId + " .btn:first-child").attr("location-id", jobCountryId);
        }
   
        if ($("#peopleOurTeamSection").length > 0 || $("#people-search-result").length > 0) {
        
            $( "." +  parentId + " .drop-icon").addClass("reset-filter");
            $("." + parentId + "  .drop-icon").removeClass("clear-filter");
        }

        $("." + parentId).addClass("active");
        $("#" + parentId).addClass("active");

        console.log("parentId");
        console.log(parentId);

        let valueSelect = $("#" + parentId + "-menu").attr("value");

        $("#" + parentId).find("i").addClass("reset-filter");      

        //Set active color
        if (valueSelect !== "all") {
            $(this).addClass("select-active");           

        } else {
            $(this).removeClass("select-active");
        }
        console.log ("check length")
        console.log($("#filterInsightResult").length)
        if ($("#filterInsightResult").length > 0 || $("#newsWebinarsID").length > 0) {
            console.log ("vao dndasdlnakfnsdkbskfgb")
            FilterNews();
        }


        if ($("#peopleOurTeamSection").length > 0 || $("#people-search-result").length > 0) {
            let value = $("#peopleOurTeamSection #" + parentId).attr("value");
            console.log("valueeeeeeee");
            
            if (itemId > 1) {
                $("#peopleOurTeamSection #" + parentId).addClass("active");
            }

            setTimeout(function () {
                $("#peopleOurTeamSection " + "#" + parentId).addClass("active");
                resetDataSearch();
                let dataSearch = getDataSearchPeople();
                searchPeople(dataSearch);
            }, 100)
        }

      
               
      
    })


    //Insight filter
    $("#careerBannerId .filter-insight-dropdown li").click(function () {
        console.log ('scdsfbsjfb vao day ne')
        let content = $(this).text();
        let parentId = $(this).parent().parent().attr("id");

        $("#" + parentId + " .btn:first-child").html(content);
        $("#" + parentId + " .btn:first-child").attr("value", $(this).text());
        $("#" + parentId + " .filter-insight-dropdown .drop-icon").addClass("reset-filter");
        $("#" + parentId + " .filter-insight-dropdown .drop-icon").removeClass("clear-filter");
        $("#" + parentId + " li").removeClass("select-active");

        if ($("#jobDepartment").length > 0) {
            let departmentId = $(this).attr("department-id");
            $("#" + parentId + " .btn:first-child").attr("department-id", departmentId);
            console.log($("#" + parentId + " .btn:first-child"))
            console.log(parentId)
        }
        if ($("#jobCountry").length > 0) {
            let jobCountryId = $(this).attr("location-id");
            $("#" + parentId + " .btn:first-child").attr("location-id", jobCountryId);
        }

        $("#" + parentId).addClass("active");

        let valueSelect = $("#" + parentId + "-menu").attr("value");

        $("#" + parentId).find("i").addClass("reset-filter");

        //Set active color
        if (valueSelect !== "all") {
            $(this).addClass("select-active");

        } else {
            $(this).removeClass("select-active");
        }

     

    })


    $(document).scroll(function () {
        if ($("#filterInsightResult").length > 0) {               
            let currentPage = parseInt($("#filterInsightResult").attr("current-page"));           
            let totalPage = parseInt($("#filterInsightResult").attr("total-page"));
            if (currentPage > totalPage) {
                  $("#filterInsightResult").attr("filter-active","false");    
            }
            let filterActive = $("#filterInsightResult").attr("filter-active");

            if (filterActive == "true") {
                setTimeout(function () {
                    if (filterActive == "true") {
                        var $el = $('#filterInsightResult');  //record the elem so you don't crawl the DOM everytime  
                        var bottom = $el.position().top + $el.outerHeight(true);
                        FilterNews()

                    }

                }, 3000)


            }
            $("#filterInsightResult").attr("filter-active", "false");    
           

        }
        
      
    });

    $("#clear-all").click(function () {
        console.log("dadasd");
        $("#filterInsightResult").html("");
        $("#filterInsightResult").attr("filter-active", "true");
        if ($("#insights-filter").length > 0) {
            let dropdownSelect = $('#insights-filter .filter-insight-dropdown p');
            dropdownSelect.each(function (index, element) {
                let textDefault = $(element).attr("text-default");
                $(element).text(textDefault);
                $(element).attr("value", "all");
            })
            $('#insights-filter .filter-insight-dropdown').removeClass("active");
            $(".drop-icon").removeClass("reset-filter");
            $('#insights-filter li').removeClass("select-active");
        } else if ($("#insightMobildeSearchArea").length > 0) {
            let dropdownSelect = $('#insightMobildeSearchArea .filter-insight-dropdown p');
            dropdownSelect.each(function (index, element) {
                let textDefault = $(element).attr("text-default");
                $(element).text(textDefault);
                $(element).attr("value", "all");
            })

            $(".drop-icon").removeClass("reset-filter");
            $('#insightMobildeSearchArea li').removeClass("select-active");
            $('#insightMobildeSearchArea .filter-insight-dropdown').removeClass("active");
        }

        setTimeout(function () {
            resetFilterPage();
            FilterNews();
        }, 500)    


        if ($("#peopleOurTeamSection").length > 0 || $("#people-search-result").length > 0) {
            let dropdownSelect = $(".filter-insight-dropdown p");
            dropdownSelect.each(function (index, element) {
                let textDefault = $(element).attr("text-default");
                $(element).text(textDefault);
                $(element).attr("value", "all");
            })
            $("#filterName").val("");
            $("#peopleName").val("");
            $(".filter").removeClass("active");
            $('.filter-insight-dropdown').removeClass("active");
            $(".drop-icon").removeClass("reset-filter");
            $('.dropdown-menu li').removeClass("select-active");

            setTimeout(function () {
                resetDataSearch();
                let dataSearch = getDataSearchPeople();
                searchPeople(dataSearch);
            }, 100)


        }


    })
    $("#news-tags li").click(function () {
        let url = $(this).find("a").attr("href");
        window.location.replace(url);
    })

    $(".remove-filter").click(function () {
       
    })

    $("select").on({
        "change": function () {
            $(this).blur();
         

        },

        'focus': function () {
           
            $(this).addClass("select-display");
           
        },

        "blur": function () {
           
            $(this).removeClass("select-display");
          
        },

        "keyup": function (e) {
            if (e.keyCode == 27)
                console.log("displayed");
        }
    });

    $(".top-banner select").on({
        "change": function () {
            $(this).blur();


        },

        'focus': function () {
          
            $(this).addClass("select-display");

        },

        "blur": function () {
           
            $(this).removeClass("select-display");

        },

        "keyup": function (e) {
            if (e.keyCode == 27)
                console.log("displayed");
        }
    });
    checkCountryServicePage();
    function checkCountryServicePage() {
        if (!$("#china-overview").length > 0) {
            $(".home-service .banner-howcan").css("margin-top", "0px");
        }
    }

    function selectFilterChangeColor() {

    }
    checkSite();
    CheckAcceptCookies();

    $('.carousel').carousel({ interval: false });

    $('a[class^=carousel-control-]').click(function (event) {
       
        event.preventDefault();
    });

    function disableScroll() {
        // Get the current page scroll position 
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,

            // if any scroll is attempted, set this to the previous value 
            window.onscroll = function () {
                window.scrollTo(scrollLeft, scrollTop);
            };
    }

    function enableScroll() {
        window.onscroll = function () { };
    } 


    var windowWidth = $(window).width();

 
    getLastNews();
    getTopArticles();
    /*Landing page Slick*/
    if ($("#mobile-landind-top-slider").length > 0) {
        $('#mobile-landind-top-slider').slick({
            centerMode: true,
            centerPadding: '20px',
            slidesToShow: 1,
            infinite: false,
            dots: true,

            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '20px',
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '20px',
                        slidesToShow: 1
                    }
                }
            ]
        });

    }
   
    /*Mobile Slick slider*/
    if ($("#mobile-news-related-articles").length > 0) {
        $('#mobile-news-related-articles').slick({
            centerMode: true,
            centerPadding: '25px',
            slidesToShow: 1,
            infinite: false,

            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '25px',
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '30px',
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
   

/*Department Career List*/
    if ($("#departmentListId").length > 0) {
        $('#departmentListId').slick({
            centerMode: true,
            centerPadding: '10px',
            slidesToShow: 1,
            infinite: false,

            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '10px',
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '10px',
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
  
    /* List all job*/
    if (windowWidth <= 1024) {

        if ($(".jobs-result-all-mobile").length > 0) {
            $('.jobs-result-all-mobile').slick({
                centerMode: true,
                centerPadding: '10px',
                slidesToShow: 1,
                infinite: false,

                responsive: [
                    {
                        breakpoint: 1136,
                        settings: {
                            arrows: false,
                            centerMode: true,
                            centerPadding: '10px',
                            slidesToShow: 1
                        }
                    },
                    {
                        breakpoint: 1024,
                        settings: {
                            arrows: false,
                            centerMode: true,
                            centerPadding: '10px',
                            slidesToShow: 1
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            arrows: false,
                            centerMode: true,
                            centerPadding: '10px',
                            slidesToShow: 1
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            arrows: false,
                            centerMode: true,
                            centerPadding: '10px',
                            slidesToShow: 1
                        }
                    }
                ]
            });
        }
       
    }
   


    /*all slider */
    if ($(".sliderSlickWrap").length > 0) {
        $('.sliderSlickWrap').slick({
            centerMode: true,
            centerPadding: '20px',
            slidesToShow: 1,
            focusOnSelect: true,
            infinite: false,

            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '2px',
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '20px',
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '25px',
                        slidesToShow: 1
                    }
                }
            ]
        });
    }

    if ($('.sliderSlickWrapPeople').length > 0) {

        $('.sliderSlickWrapPeople').slick({
            centerPadding: '20px',
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: false,
            arrows: true

        });
    }

    if ($("#serviceSectionController.mobile-version").length > 0) {
        $('#serviceSectionController.mobile-version').slick({
            centerPadding: '5px',
            variableWidth: true,
            focusOnSelect: true,
            slidesToScroll: 3,
            infinite: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        centerPadding: '5px',
                        variableWidth: true,

                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: false,
                        centerPadding: '5px',
                        slidesToScroll: 3,
                        variableWidth: true

                    }
                },
                {
                    breakpoint: 360,
                    settings: {
                        arrows: false,
                        centerPadding: '5px',
                        variableWidth: true,
                        slidesToScroll: 3

                    }
                },
            ]
        });
    }


    if ($(".slick-slider").length > 0) {
        $('.slick-slider').slick({
            dots: true,
            dotsClass: 'slick-dots',
            prevArrow: '<span class="slick-arrow slick-prev"><i class="fas fa-chevron-left"></i></span>',
            nextArrow: '<span class="slick-arrow slick-next"><i class="fas fa-chevron-right"></i></span>'
        });

    }
  
    if ($("#recentNewsId .slick-slider").length > 0) {
        $('#recentNewsId .slick-slider').slick({
            dots: true,
            centerPadding: '20px',
            dotsClass: 'slick-dots',
            prevArrow: '<span class="slick-arrow slick-prev"><i class="fas fa-chevron-left"></i></span>',
            nextArrow: '<span class="slick-arrow slick-next"><i class="fas fa-chevron-right"></i></span>'
        });
    }

  
  
    
  
    function checkSite() {
        if (($(".home-landing").length > 0)) {
            $("header").removeClass("header-master");
        }

        if ($("#chinaServicesId").length > 0) {
            $("body").css("overflow-y", "hidden");
        }
    }
    function updateReponsive() {
        var windowWidth = $(window).width();
        var windownHeight = $(window).height();
        if (windowWidth <= 1024) {
           
            
            $("header").removeClass("header");
            $("header").addClass("header-master");
            $(".china-section-content").removeClass("china-service-desktop-content");
            $(".china-section-content").addClass("china-service-mobile-content");

            $(".china-section-content").removeClass("china-service-desktop-content");
            $(".china-section-content").addClass("china-service-mobile-content");
            return 0;

        } else {
            
          
          /*  $("#touch-menu-trigger").removeClass("hide");
            $("#touch-menu-trigger-mobile").addClass("hide");*/
        }

    }
   
    updateReponsive();
    checkSite();
/*Resize Event */
        var windowWidth = $(window).width();
        $(window).resize(function () {
            // Check if the window width has actually changed and it's not just iOS triggering a resize event on scroll
            if ($(window).width() != windowWidth) {
                updateReponsive();

            }

         

        });

       });

    $("#touch-menu-trigger-mobile").click(function () {
     /*   alert('ádasdasdasd');*/
    })

  

    /*For safari*/
   /* jQuery(document).ready(function ($) {

        *//* Store the window width *//*
        var windowWidth = $(window).width();
        let screenWidth = window.screen.width;      
     

        $('html').css('width', windowWidth);

        *//* Resize Event *//*
        $(window).resize(function () {
            // Check if the window width has actually changed and it's not just iOS triggering a resize event on scroll
            if ($(window).width() != windowWidth) {

                // Update the window width for next time
                windowWidth = $(window).width();
                console.log(screenWidth);
                // Do stuff here
               *//* console.log('da lam');
                console.log(windowWidth);*//*
                $('html').css('width', windowWidth);

            }

            // Otherwise do nothing

        });

    });*/


    /*let screenWidth = window.screen.width;
    console.log(screenWidth);
    $('html').css('width', screenWidth);

    $(window).resize(function () {
        console.log('window was resized');
        let screenWidth = window.screen.width;      
        console.log(screenWidth);
        $('html').css('width', screenWidth);
    });*/


    /*js demo will be remove on release*/
    $("#btnAjax").click(function () {
        var url = "Umbraco/Api/Search/GetAllProducts";
    /* var data = {"name":"long","age":"21"};*/
        var data = null;
        $.ajax({
            type: "GET",
            url: url,
            data: data,
            success: function (success) {

              

            },
            dataType: 'JSON'
        });
    })

/*Add icon to Arrow carousel*/
    $(".carousel-control-next-icon").after("<span> <i class= 'fa fa-chevron-right' aria-hidden='true'></i> </span>");
    $(".carousel-control-prev-icon").after("<span> <i class= 'fa fa-chevron-left' aria-hidden='true'></i> </span>");

/*Department search in Careers page*/

    $(".departments-list>li").click(function () {
       console.log ("")
    })
//Fix error can't click on Iphone
$(".filter-insight-dropdown p").click(function () {
        console.log("")
    })


    $(".umbraco-forms-apply-job .checkbox-wrap .checkbox-inline").click(function () {      
        var label = $(this);       
            let checkbox = $(label).find("input");
            if (checkbox.prop("checked") == true) {
                if (!label.hasClass("active")) {                 
                   $(label).addClass("active");
                }
            } else {
                $(label).removeClass("active");
            } 
     

     
    })


    $("#closeThankyouBanner").click(function () {
        location.reload();
    })
   
$(document).on('click', '.people-item', function (event) {
    
        let url_profile = jQuery("a", this).attr('href');
        location.href = url_profile;
    })
  
    $("#btnIPConsulting").click(function () {
       
        $('html, body').animate({ scrollTop: 500 }, 500);

    })
    $("#btnIPPortfolios").click(function () {
      
        $('html, body').animate({ scrollTop: 2500 }, 500);

    })
    $("#btnEnforcement").click(function () {
     
        $('html, body').animate({ scrollTop: 4800 }, 500);

    })
    $("#btnIPLegal").click(function () {
        $('html, body').animate({ scrollTop: 6500 }, 500);      

    })

/* China service*/
    $("#china-services-controller #btnIPConsultingChina").click(function () {

        $('html, body').animate({ scrollTop: 3000 }, 500);

    })
    $("#china-services-controller #btnIPPortfoliosChina").click(function () {

        $('html, body').animate({ scrollTop: 4500 }, 500);

    })
    $("#china-services-controller #btnEnforcementChina").click(function () {

        $('html, body').animate({ scrollTop: 6500 }, 500);

    })
    $("#china-services-controller #btnIPLegalChina").click(function () {
        $('html, body').animate({ scrollTop: 8000 }, 500);

    })

$("#wrap-burger-content .tab-content  .tab-pane .content a").click(function () {
   
    $("#touch-menu-trigger").click();
}) 

    $("#touch-menu-trigger").click(function () {
        var windowWidth = $(window).width();
        var windownHeight = $(window).height();
      
        if (windowWidth <= 1200) {
            $("#rouse-burger .burger-content-container").height(windownHeight);
            let status = $(this).attr("aria-expanded");          

            if (status !== "true") {
               
                if (!$("#touch-menu-trigge .bar").hasClass("hide")) {
                    $(".bar").addClass("hide");
                }            
                $("#bugger-close-icon").removeClass("hide");
              


            } else {
               
                if (!$("#bugger-close-icon").hasClass("hide")) {
                    $("#bugger-close-icon").addClass("hide");                  
                }
                $(".bar").removeClass("hide");
              
            } 
        } else {           
            $("#rouse-burger .burger-content-container").height(windownHeight);
            let status = $(this).attr("aria-expanded");
            if (status !== "true") {
                $("#bar-top").removeClass('open-bar-top');
                $("#bar-middle").removeClass('open-bar-bottom');
                $("#bar-top").addClass('close-bar-top');
                $("#bar-middle").addClass('close-bar-bottom');
                $("#bar-bottom").addClass('hide');
                $("#burger-menu li.active a").click();
                $(".main-menu ul").addClass("hide");
               



            } else {

              
                $("#bar-top").removeClass('close-bar-top');
                $("#bar-middle").removeClass('close-bar-bottom');

                $("#bar-top").addClass('open-bar-top');
                $("#bar-middle").addClass('open-bar-bottom');

                setTimeout(function () {
                    $(".main-menu ul").removeClass("hide");

                }, 200);
             

                setTimeout(function () {
                    $("#bar-top").removeClass('open-bar-top');
                    $("#bar-bottom").removeClass('hide');
                   
                }, 500);
            } 
        }


       
    })

$("#burger-menu li a").click(function () {
    let checkRedirect = $(this).attr("is-redirect");
    let url = $(this).attr("url");
    if (checkRedirect == "True") {
        window.location.href = url;
        return false;
    }
});
    
    $("#search-icon").click(function () {
       
        if (!$(this).hasClass('show')) {
            $(this).addClass("show");
            $("#search-content").removeClass("hide");
            $("#icon-open-search").addClass("hide");
            $("#icon-close-search").removeClass("hide");
            $("#search-content").addClass("show-search-input");
            /*  $(".main-menu").css('left', '35px');*/
            //$(".main-menu").addClass("left-move");
         
         

        } else {
            $(this).removeClass("show");
            $("#icon-open-search").removeClass("hide");
            $("#icon-close-search").addClass("hide");
            $("#search-content").addClass("hide");
            $("#search-content").addClass("show-search-input");          
            //$(".main-menu").removeClass("left-move");
        
        }
       

    });



$(document).on('click', '.careersPageNum', function (event) {
    event.preventDefault();
    let currentPage = $(this).attr("page");
    $("#paginationList").attr("curentpage", currentPage);
    let dataSearch = getDataToPostCareer();
    searchCareer(dataSearch);
            
})

$(".people-page select").change(function () {
    $(this).addClass("select-active");

})

//$(".news-filter-wrap select").change(function () {
//    $("#filterInsightResult").attr("filter-active","true");
//    resetFilterPage();
//    var relaredWrap = $("#filterInsightResult");
//    relaredWrap.html("")
//    let valueSelect = $(this).val();
//    let id = $(this).attr("id");

//    //Set active color
//    if (valueSelect !== "all") {
//        $(this).addClass("select-active");
//        $(this).addClass("select-close");

//    } else {
//        $(this).removeClass("select-active");
//    }


//    if (id !== "featuredTopics") {       
//        let data = getNewsFilter();
//        searchNews(data);
//    } else {
//        let featuredTopics = $(this).children("option:selected").attr("news-id");
      
//        let data = { newsId: featuredTopics, "typeSearch": "news" };
      
//        searchNewsByID(JSON.stringify(data));
//    }
//})

//$("#insightsMobileFilter select").change(function () {
//    let id = $(this).attr("id");
//    if (id !== "featuredTopics") {
//        let data = getNewsMobileFilter();    
//        searchNews(data);
//    } else {
//        let featuredTopics = $(this).children("option:selected").attr("news-id");

//        let data = { newsId: featuredTopics, "typeSearch": "news" };

//        searchNewsByID(JSON.stringify(data));
//    }
//})
function resetWeb(classInsert) {
    if ($("#newsWebinarsID").length > 0) {
        $("#newsWebinarsID " + classInsert + " .title").text("");
        $("#newsWebinarsID  " + classInsert + " .description").html("");
        $("#newsWebinarsID   " + classInsert + ".datetime").text("");
        $("#newsWebinarsID  " + classInsert + " .readmore").attr("href", "");

        $("#newsWebinarsID  " + classInsert + ".tags-list").html("");
        $("#newsWebinarsID  " + classInsert + ".author").html("");
        $("#newsWebinarsID  " + classInsert + ".time").text("");

    }
}
function FilterNews() {
    if ($("#newsWebinarsID").length > 0) {
        resetWeb(".office-left");
        resetWeb(".office-right .office-top");
        resetWeb(".office-right .office-bottom");
    }
    let data = getNewsFilter();   
    searchNews(data);
}


//$("#insightMobildeSearchArea select").change(function () {
//    let id = $(this).attr("id");
    
//    if (id !== "featuredTopics") {
//        let data = getNewsFilter();
//        console.log("check data";)
//        console.log(data);
//        searchNews(data);
//    } else {
//        let featuredTopics = $(this).children("option:selected").attr("news-id");

//        let data = { newsId: featuredTopics, "typeSearch": "news" };

//        searchNewsByID(JSON.stringify(data));
//    }
//})

$("#btnShareSocial").click(function () {
    $(".social-list").toggleClass("hide");
    $("#btnShareSocial").toggleClass("active");
    

})

function getLastNews() {
    let windowWidth = $(window).width();
    let url = "/Umbraco/Api/Insights/GetLastNews";

    typesArray = new Array();
    typesArray.push("News");

    let data = { types: typesArray };
    data = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        data: { data: data },
        success: function (result) {


            //$("#jobs-result").html("");

            var listData = JSON.parse(result);

            let Page = listData.Page;
            let Total = listData.Total;
            let totalResult = listData.totalResult;
            let dataResult = listData.News;

        
            renderLastNewsBurger(dataResult);
        }

    });
}

function getTopArticles() {
    let windowWidth = $(window).width();
    let url = "/Umbraco/Api/Insights/GetTopArticles";

    typesArray = new Array();
    typesArray.push("News");

    let data = { types: typesArray };
    data = JSON.stringify(data);
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        data: { data: data },
        success: function (result) {

            var listData = JSON.parse(result);

            let Page = listData.Page;
            let Total = listData.Total;
            let totalResult = listData.totalResult;
            let dataResult = listData.News;


            renderTopArticlesBurger(dataResult);
        }

    });
}


function renderLastNewsBurger(content) {
    let burgerLastNews = $("#burgerLastNews");
    let listNews = "";
    
    content.forEach(function (e, i) {
        let itemNews = "<li><a href='" + e.Url + "' title='" + e.Name + "'>" + e.Name + "</a></li>";
        listNews += itemNews;
      
    })

    burgerLastNews.html(listNews);
}

function renderTopArticlesBurger(content) {
    let burgerLastNews = $("#burgerTopArticles");
    let listNews = "";

    content.forEach(function (e, i) {
        let itemNews = "<li><a href='" + e.Url + "' title='" + e.Name + "'>" + e.Name + "</a>" +
            "<div class='description'>" + 
                 e.Sumary 
            "<div>"+ 
        
        
        
        "</li > ";
        listNews += itemNews;

    })

    burgerLastNews.html(listNews);
}


function updateInsightsFilter(content) {
    $(".news-group.row").hide();
    console.log('content.length');
    console.log(content.length);
    if (content.length > 0) {  
        renderFilterInsight(content);
    }
    
   
}

function renderNewsItemTop(content) {   
    let title = content.Name;
    let date = content.Date;
    let url = content.Url;
    let description = content.Sumary;
    let tags = content.Tags;
    let timeToRead = content.TimeRead;
    let author = content.Author;
    let image = content.Image;

    var tagsContent = '';

    if (tags.length > 0) {
       
        tags.forEach(function (e, i) {
           
            if (i < 3) {
                tagsContent += '<li> #' + e + '</li >';
               
            }
           
        })
    }   

    var authorCotent = '';
    if (author.length > 0) {
        author.forEach(function (e, i) {
            if (i == 0) {
                authorCotent += '<span>' + e.Name + '</span>';
            } else {
                authorCotent += ', <span>' + e.Name + '</span>';
            }
          
        })
    }

    $("#insights-top .title").text(title);
    $("#insights-top .description").html(description);
    $("#insights-top .datetime").text(date);
    $("#insights-top .time").text(date);
    $("#insights-top .readmore").attr("href", url);       
    $(".news-banner").css("background", "url('" + image + "')");

    $("#insights-top .tags-list").html(tagsContent);
    $("#insights-top .author").html(authorCotent);
    $("#insights-top .time").text(timeToRead);
}

function renderRelatedNewsWrap(content) {
    var relaredWrap = $("#relatedNewsWrapID");
    relaredWrap.html ("")
  

    for (var i = 1; i < content.length; i++) {

        relaredWrap.append(renderRelatedNews(content[i]));
    }
    
}

function resetFilterPage() {
  $("#filterInsightResult").attr("current-page",0);
  $("#filterInsightResult").attr("total-page",0);
    $("#filterInsightResult").attr("is-all", "false");

    $("#newsWebinarsID").attr("current-page", 0);
    $("#newsWebinarsID").attr("total-page", 0);
    $("#newsWebinarsID").attr("is-all", "false");
}

function renderFilterInsight(content) {
    var relaredWrap = $("#filterInsightResult");
    let currentPage = parseInt($("#filterInsightResult").attr("current-page"));
    let totalPage = parseInt($("#filterInsightResult").attr("total-page"));
    let isAll = $("#filterInsightResult").attr("is-all");
    if (currentPage == 0 ) {
        relaredWrap.html("")
    }

    
    if (currentPage == totalPage) {
        $("#filterInsightResult").attr("is-all","true");
    }    

    if (isAll !== "true") {
       
        for (var i = 0; i < content.length; i++) {

            relaredWrap.append(renderRelatedNews(content[i]));
        }
    }
   

}

function renderRelatedNews(content) {
    let title = content.Name;
    let date = content.Date;
    let url = content.Url;
    let description = content.Sumary;
    let tags = content.Tags;
    let timeToRead = content.TimeRead;
    let author = content.Author; 
    let image = content.Image;

    var tagsContent = '';

    if (tags.length > 0) {
        tags.forEach(function (e, i) {
            if (i < 3) {
                tagsContent += '<li> #' + e + '</li >';
                
            }
         
        })
    }

    var authorCotent = '';
    if (author.length > 0) {
        author.forEach(function (e, i) {
            if (i == 0) {
                authorCotent += '<span>' + e.Name + '</span>';
            } else {
                authorCotent += ', <span>' + e.Name + '</span>';
            }

        })
    }


    var content =

        '<div class="col-xs-12 col-md-12 col-lg-4 item item-news" style="background-image:url(' + image+ ')">' +
        '<div class="item-content item-content-news">' +
        '<div class="title">'+
        '<a href="' + url + '">' + title + ' </a>' +
        '</div>' +
        '<div class="description">'+
                description   +
        '</div>'+        
        '<p class="time">' + timeToRead + '</p>' +
        ' <p class="author">' +
        authorCotent +



        '</p>' +
        '<a href="' + url +'" class="readmore">READ MORE <i class="fas fa-chevron-right arrow arrow-1"></i><i class="fas fa-chevron-right arrow arrow-2"></i><i class="fas fa-chevron-right arrow arrow-3"></i></a>'+
        
        '<p class="datetime">' + date + '</p>' +

        '<ul class="tags-list">       ' + tagsContent +

        ' </ul>' +
        '</div>'+
        '</div>';

    return content;
}




function updateWebinarsFilter(content) {

    renderNewsItemTop(content[0]);
   

}

function renderNewsWebinarsItemTop(content) {
    $(".office-right").show();
    $(".office-left").show();
    
    if (content[0].Name === "undefined") {
        $(".office-left").hide();
        $(".office-right").hide();
    }
    addItemNewsWebinars(".office-left", content[0])
    if (content.length > 1) {
        addItemNewsWebinars(".office-right .office-top", content[1])
    } else {
        $(".office-right").hide();
    

    }
    if (content.length > 2) {
        addItemNewsWebinars(".office-right .office-bottom", content[2])
    }
  
  

  
}

function addItemNewsWebinars(classInsert, content) {
  
    let title = content.Name;
    let date = content.Date;
    let url = content.Url;
    let description = content.Sumary;
    let tags = content.Tags;
    let timeToRead = content.TimeRead;
    let author = content.Author;
    let image = content.Image;

    console.log(url);
    console.log(title);
    console.log(author)
    var tagsContent = '';

    if (tags.length > 0) {
        tags.forEach(function (e, i) {
            tagsContent += '<li> #' + e + '</li >';
          
        })
    }

    var authorCotent = '';
    if (author.length > 0) {
        author.forEach(function (e, i) {
            if (i < 2) {
                if (i == 0) {
                    authorCotent += '<span>' + e.Name + '</span> ';
                } else {
                    authorCotent += '<span>, ' + e.Name + '</span> ';
                }
            }
           
          
           
        })
    }


    if ($("#newsWebinarsID").length > 0) {
        $("#newsWebinarsID " + classInsert + " .title").text(title);
        $("#newsWebinarsID  " + classInsert + " .description").html(description);
        $("#newsWebinarsID   " + classInsert + " .datetime").text(date);
        $("#newsWebinarsID  " + classInsert + " .watch-now a").attr("href", url);

        $("#newsWebinarsID  " + classInsert + " .tags-list").html(tagsContent);
        $("#newsWebinarsID  " + classInsert + " .author").html(authorCotent);
        $("#newsWebinarsID  " + classInsert + " .time").text(timeToRead);
  
    }
 
  
  
    if ($("#newsCaseStudiesID").length > 0) {
    
        $("#newsCaseStudiesID " + classInsert + " .title").text(title);
        $("#newsCaseStudiesID  " + classInsert + " .description").html(description);
        $("#newsCaseStudiesID   " + classInsert + ".datetime").text(date);
        $("#newsCaseStudiesID  " + classInsert + " .readmore").attr("href", url);

        $("#newsCaseStudiesID  " + classInsert + ".tags-list").html(tagsContent);
        $("#newsCaseStudiesID  " + classInsert + ".author").html(authorCotent);
        $("#newsCaseStudiesID  " + classInsert + ".time").text(timeToRead);
        $("#newsCaseStudiesID  " + classInsert).css("background", "url('" + image + "')");
    }

}

function searchNews(data) {
    let windowWidth = $(window).width();
    let url = "/Umbraco/Api/Insights/SearchNews";   
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        data: {data:data},
        success: function (result) {
            var listData = JSON.parse(result);
            let Page = listData.Page;
            let Total = listData.Total;
            let totalResult = listData.totalResult;
            let dataResult = listData.News;
         
           

            if ($("#filterInsightResult").length > 0) {
                $("#filterInsightResult").attr("current-page", Page);
                $("#filterInsightResult").attr("total-page", Total);
            } else if ($("#newsWebinarsID").length > 0) {
                $("#newsWebinarsID").attr("current-page", Page);
                $("#newsWebinarsID").attr("total-page", Total);
            }
            if ($("#insights-filter").length > 0) {               
                updateInsightsFilter(dataResult);

            }
            if ($("#insightMobildeSearchArea").length > 0) {
                $("#mobilde-top-insights-slider").attr("current-page", Page);
                $("#mobilde-top-insights-slider").attr("total-page", Total);
                $('#mobilde-top-insights-slider').slick('removeSlide', null, null, true);
                dataResult.forEach(function (item) {                   
                    $("#mobilde-top-insights-slider").slick('slickAdd', renderItemInsightsMobile(item));
                })
              
            }          
          
          
            if (dataResult.length > 0) {
                $("#newsWebinarsID").removeClass("hide");
                if ($("#newsWebinarsID").length > 0) {                  
                    renderNewsWebinarsItemTop(dataResult);

                    if ($("#insightMobildeSearchArea").length > 0) {
                        $('#mobilde-news-rouse-webinars').slick('removeSlide', null, null, true);
                        dataResult.forEach(function (item) {
                            $("#mobilde-news-rouse-webinars").slick('slickAdd', renderItemWebinarsMobile(item));
                        })

                    }   

                }
            } else {
                $("#newsWebinarsID").addClass("hide");
            }
           
              

        }
       
    });
}

function searchNewsByID(data) {
    let windowWidth = $(window).width();
    let url = "/Umbraco/Api/Insights/GetNewsByID";

    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        data: { data: data },
        success: function (result) {
            var content = JSON.parse(result);         
           

            if ($("#insightMobildeSearchArea").length > 0) {
                $('#mobilde-top-insights-slider').slick('removeSlide', null, null, true);
        
                    $("#mobilde-top-insights-slider").slick('slickAdd', renderItemInsightsMobile(content));
             

            } else {
                renderNewsItemTop(content)
            }

        }

    });
}



function getNewsFilter() {
    console.log('sadasdasdasdasd');
    let industry = $(".filer-dropdown #industries-menu").attr("value");
    let services = $(".filer-dropdown #services-menu").attr("value");
    let types = $(".filer-dropdown #types-menu").attr("value");
    let regions = "all";
    if ($(".filer-dropdown #regions-menu").length > 0) {
        regions = $(".filer-dropdown #regions-menu").attr("value");
    }
  
    let typesArray = new Array();
    let currentPage ="";

    if ($("#filterInsightResult").length > 0) {
         currentPage = $("#filterInsightResult").attr("current-page");
    }
    else if ($("#newsWebinarsID").length > 0) {
        currentPage = $("#newsWebinarsID").attr("current-page");
    }


    let page = parseInt(currentPage);
    if (page == 0) {
        page = 1
    } else {
        page++;
    }  

    if (types.indexOf('&') > -1) {
        typesArray = types.split("&");
    } else {
        typesArray.push(types);
    }

    console.log("get data from page : ..." + page)
    

    let data = { industry: industry, services: services, types: typesArray, regions: regions, page:page};
    
   

    return JSON.stringify(data);

    
}

function getNewsMobileFilter() {
    let industry = $("#insightMobildeSearchArea #industries-menu").attr("value");
    let services = $("#insightMobildeSearchArea  #services-menu").attr("value");
    let types = $("#insightMobildeSearchArea #types-menu").attr("value");
    let typesArray = new Array();

    let featuredTopics = $("#insightMobildeSearchArea #featuredTopics").val();


    if (types.indexOf('&') > -1) {
        typesArray = types.split("&");
    } else {
        typesArray.push(types);
    }



    let data = { industry: industry, services: services, types: typesArray, featuredTopics: featuredTopics };



    return JSON.stringify(data);


}

function removeOptionSelect(e) {
    let optionRemove = $(e);
    optionRemove.each(function (index, e) {
        $(e).attr("selected", false);
    });
}
/*Career Search Top  Method */
$("#btn-search-career").click(function () {
    if ($("#jobDetailSearchWrap").length > 0) {
        if ($("#jobDetailSearchWrap").hasClass("hide")) {
            $("#jobDetailSearchWrap").removeClass("hide");
        }
    }  
    
    getDataSearchCareer();
    var elmnt = document.getElementById("available-positions-section");
    elmnt.scrollIntoView({ behavior: 'smooth', block: 'center' });
})

/*People Search method */
$("#btn-search-people").click(function () {

    resetDataSearch();
    let dataSearch = getDataSearchPeople();
    searchPeople(dataSearch);

    //peopleLocation = $("#peopleLocation").attr("location-id")
    //peopleFirm = $("#peopleFirm").attr("firm-id")
    //peopleDepartment = $("#peopleDepartment").attr("department-id")  

  
    //$("#filterLocation").find("option[location-id=" + peopleLocation + "]").prop('selected', true)
    //$("#filterLocation").find("option[location-id=" + peopleLocation + "]").change();
    //$("#filterFirm").find("option[firm-id=" + peopleFirm + "]").prop('selected', true)
    //$("#filterFirm").find("option[firm-id=" + peopleFirm + "]").change()
    //$("#filterDepartment").find("option[department-id=" + peopleDepartment + "]").prop('selected', true)
    //$("#filterDepartment").find("option[department-id=" + peopleDepartment + "]").change()

    //$(".people-filter-controller select").removeClass("select-active");
    //if (peopleLocation !== "1") {
    //    $("#filterLocation").addClass("select-active");
    //}
    //if (peopleFirm !== "1") {
    //    $("#filterFirm").addClass("select-active");
    //}

    //if (peopleDepartment !== "1") {
    //    $("#filterDepartment").addClass("select-active");
    //}


    var elmnt = document.getElementById("our-team-section");
    elmnt.scrollIntoView({ behavior: 'smooth', block: 'center' });
})

/*Fileter People search */
$("#locationListId").change(function () {
    let country = $(this).val();
    resetDataSearch();
    let dataSearch = getDataSearchPeople();
    dataSearch.country = country;
    searchPeople(dataSearch);
})

function resetDataSearch() {
    let searchResult = $("#people-search-result");
    searchResult.html("");
    searchResult.attr("current-page","");
    searchResult.attr("total-page", "");


}

$("#job-location-select .dropdown-menu li").click(function () {
    $(this).addClass("select-active");
    //let parentId = $(this).parent().parent().attr("id");
    //let countryName = $(this).attr("value");

    //console.log("location  Parent ID");
    //console.log(parentId);
    setTimeout(function () {
        let dataSearch = getDataToPostCareer();       
        console.log(dataSearch)
        searchCareer(dataSearch);
    },200)
   
})



$('.jobs-result-all-mobile').on('swipe', function (event, slick, direction) {
  

    let currentSlide = $('.jobs-result-all-mobile').slick("slickCurrentSlide");
    let slideCount = slick.slideCount
  
    let currentPage = parseInt($("#jobs-result").attr("current-page"));
    let totalPage = parseInt($("#jobs-result").attr("total-page"));
    let nextPage = currentPage + 1;

    if (currentPage < totalPage) {       
        if (currentSlide === slideCount - 1) {
            let dataSearch = getDataToPostCareer();
            dataSearch.page = nextPage;
           
           
            searchCareerForMobileSwipe(dataSearch);

        }

    }
    


});

$('#mobilde-top-insights-slider').on('swipe', function (event, slick, direction) {

  
    let currentSlide = $('#mobilde-top-insights-slider').slick("slickCurrentSlide");
    let slideCount = slick.slideCount


    console.log("currentSlide")
    console.log(currentSlide)

    console.log("slideCount")
    console.log(slideCount)


    let currentPage = parseInt($("#mobilde-top-insights-slider").attr("current-page"));
    let totalPage = parseInt($("#mobilde-top-insights-slider").attr("total-page"));
    let nextPage = currentPage + 1;

    console.log("currentPage");
    console.log(currentPage);
    console.log("totalPage");
    console.log(totalPage);

    if (currentPage < totalPage) {
        if (currentSlide === (slideCount - 1)) {
            console.log ("sdasdas")
            let dataSearch = getNewsFilter();
            dataSearch.page = nextPage;
            searchNews(dataSearch);

        }

    }



});



function removeClassAnimation(e) {
    $(e).removeClass("slider-move-left");
    $(e).removeClass("slider-move-right");

}

$("#section1.main-image").addClass("slider-move-left");

$('#mobile-landind-top-slider').on('swipe', function (event, slick, direction) {
  

   
    let currentSlide = slick.currentSlide;
    let firstSlide = slick.$slides[0];
    let centerSlide = slick.$slides[1];
    let lastSlide = slick.$slides[2];
    let imageFirst = firstSlide.getElementsByClassName("main-image");
    let imageCenter = centerSlide.getElementsByClassName("main-image");   
    let imageLast = lastSlide.getElementsByClassName("main-image");
    switch (currentSlide) {
        case 0:
            removeClassAnimation(imageFirst)
            removeClassAnimation(imageCenter)
            $(imageCenter).addClass("slider-move-left");
           

            break;
        case 1:
           
            removeClassAnimation(imageFirst)
            removeClassAnimation(imageLast)
            $(imageFirst).addClass("slider-move-right");          
            $(imageLast).addClass("slider-move-left");
            break;

        case 2:
            removeClassAnimation(imageCenter)
            removeClassAnimation(imageLast)
            $(imageCenter).addClass("slider-move-right");
           
            break;

    }
   

 
    


});


$(".people-filter-controller .filter").change(function () {
    $(this).addClass("active");
    $("#people-search-result").html("");
    
    
})

$("#peopleName").change(function () {
    $(this).addClass("active");
    let content = $(this).val();
    $("#filterName ").val(content)
    $("#filterName ").addClass("active")

})

$("#filterName").change(function () {
    $(this).addClass("active");
    let content = $(this).val();
    $("#peopleName ").val(content)
    $("#peopleName ").addClass("active")
    let dataSearch = getDataSearchPeople();
    searchPeople(dataSearch);

})


function getDataFilterPeople() {
    let page = 1;
    /*let team = $("#Team").val();*/
    let ctid = $("#ctid").attr("ctid");
    let department = $(".people-filter-controller #filterDepartment").val();
    let firm = $(".people-filter-controller #filterFirm").val();
    let name = $(".people-filter-controller #filterName").val();
    let country = $(".people-filter-controller #filterLocation").val();
    let dataSearch = { name: name, page: page, department: department, country: country, firm:firm, ctid: ctid }

    return dataSearch;

    /*  searchPeople(dataSearch);*/
}

function getDataSearchCareer() {
    let page = 1;
    let ctid = $("#ctid").attr("ctid");
   /* let team = $("#jobTeam").val();*/
    let department = $("#jobDepartment .dropdown-toggle").attr("value");
    let country = $("#jobCountry .dropdown-toggle").attr("value");

    location_id = $("#jobCountry .dropdown-toggle").attr("location-id");


    console.log('location_id');
         console.log(location_id)

    if (location_id !== "1") {
        $("#job-location-select").addClass("active");
    }
     
    department_id = $("#jobDepartment .dropdown-toggle").attr("department-id");
      
    let departmentClick = $(".departments-list").find("a[department-id=" + department_id + "]");

    let locationClick = $("#job-location-select").find("li[location-id=" + location_id +"]");    

    
    departmentClick.click();

    locationClick.click();   

    
    
    setTimeout(function () {
        let dataSearch = { page: page, department: department, country: country, ctid: ctid }
        searchCareer(dataSearch);
    }, 300)
}


function getDataSearchPeople() {
    let page = 1;
/*let team = $("#Team").val();*/
    let ctid = $("#ctid").attr("ctid");
    let department = $("#peopleDepartment .dropdown-toggle").attr("value");
    let name = $("#peopleName").val();
    let country = $("#peopleLocation .dropdown-toggle").attr("value");
    let firm = $("#peopleFirm .dropdown-toggle").attr("value");
    
    let dataSearch = { name: name, page: page, department: department, country: country, firm: firm, ctid: ctid }
    console.log(dataSearch)
   
    return dataSearch;
   
  /*  searchPeople(dataSearch);*/
}
function searchCareer(data) {
    let windowWidth = $(window).width();
    let url = "/Umbraco/Api/Careers/GetProducts"; 
    let location = $("#job-location-select dropdown-toggle").attr("value");   
    $.ajax({
        type: "POST",
        url: url,
        dataType:"JSON",
        data: data,
        success: function (result) {
            $("#jobs-result").html("");                
            var listData = JSON.parse(result);       
            let Page = listData.Page;
            let Total = listData.Total;
            let totalResult = listData.totalResult;
            let dataResult = listData.Careers;
           
            $("#jobs-result").attr("total-result", totalResult);
            $("#jobs-result").attr("total-page", Total);
            $("#jobs-result").attr("current-page", Page);

        /*update location item check*/
            let allLocation = $(".department-item");     
           
           

            for (let i = 0; i < allLocation.length; i++) {
                let currentName = $(allLocation[i]).attr("department-title");
                $(allLocation[i]).text(currentName);
            }

            let loactionCurrent = $(".department-item.strong");
            let currentName = loactionCurrent.attr("department-title");
            
            loactionCurrent.text(currentName + " (" + totalResult + ")");     
            
            let renderPage = renderPagination(parseInt(Page), parseInt(Total));
            $("#paginationList").html(renderPage);
            $("#paginationList").attr("curentPage", 1);
          
            if (windowWidth <= 1024) {
                    $('#jobs-result').slick('removeSlide', null, null, true);
                } else {
                    $('#jobs-result').html("")
            }
            
             if (dataResult != null) {
                 dataResult.forEach(function (item) {
                        if (windowWidth > 1024) {
                            $("#jobs-result").append(renderItemCareers(item));
                        } else {                          
                            $('.jobs-result-all-mobile').slick('slickAdd', renderItemCareersMobile(item));
                        }
                    });
                }

         
          
           
          
          
          
        }       
    });
}

function searchCareerForMobileSwipe(data) {
    let windowWidth = $(window).width();
    let url = "/Umbraco/Api/Search/GetAllProducts";
    let location = $("#job-location-select .dropdown-toggle").attr("value");  
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        data: data,
        success: function (result) {
            $("#jobs-result").html("");

            var listData = JSON.parse(result);        
            let Page = listData.Page;
            let Total = listData.Total;
            let dataResult = listData.Careers;         

            $("#jobs-result").attr("total-page", Total);
            $("#jobs-result").attr("current-page", Page);

            dataResult.forEach(function (item) {   
                
                $('.jobs-result-all-mobile').slick('slickAdd', renderItemCareersMobile(item));
            });


        }
    });
}


/*Search people*/
function searchPeople(data) {
    let windowWidth = $(window).width();
    let url = "/Umbraco/Api/People/SearchPeople";
    let location = $("#job-location-select").val();
   
    $.ajax({
        type: "POST",
        url: url,
        dataType: "JSON",
        data: data,
        success: function (result) {
            var listData = JSON.parse(result);
           
            let Page = listData.Page;
            let Total = parseInt(listData.Total);
            let dataResult = listData.People;
            $(".load-more-list").show();
            if (Total == 0) {
                $("#people-search-result").html("");
                $(".load-more-list").addClass("hide");
            } else {
                if (Page == "1") {
                    $("#people-search-result").html("");
                }
               
                $("#people-search-result").attr("total-page", Total);
                $("#people-search-result").attr("current-page", Page);
                if (Total == Page) {
                    $(".load-more-list").hide();
                }
                if (windowWidth <= 1024) {
                    $('#people-search-result').slick('removeSlide', null, null, true);
                }
                dataResult.forEach(function (item) {
                  

                    if (windowWidth > 1024) {
                        $("#people-search-result").append(renderItemPeople(item));

                    } else {
                    
                        $("#people-search-result").slick('slickAdd', renderItemPeople(item));
                      
                    }


                });      
            }
            
              


          


        }
    });
}
/*Render Item people */
function renderItemPeople(data) {
    let socialList = data.SocialMedia;
    let htmlList = "";
    socialList.forEach(function (e, i) {
      
         htmlList += '<li><a href="' + e.Url + '"><i class="' + e.Icon + '"></i> </a></li>'
    });

      
    let content = '<div class="col-md-6 col-lg-3">       <div class="people-item" style="background-image:url()">' +
        '<div class="profile-image">' +
        '<img src="' + data.Image + '">' +
        '</div>' +

        '<div class="people-information">' +
        '  <div class="box">' +
        '<div class="top">'+
               ' <a href="'+ data.Url + '"><h4 class="name">' + data.Name + '</h4></a>'+
        ' <p class="position">' + data.Position + '</p>' +
        '<p> <i class="fas fa-map-marker"></i>&nbsp;' + data.Location + '</p>' + 
        '</div>'+
        '<div class="bottom">'+
               ' <p class="email">'+ data.Email + '</p>'+
               ' <p class="phone">'+ data.Phone + '</p>'+
               ' <div class="social-network">  '+
               '     <ul>' + htmlList +                     
                   '</ul>'+

        ' </div>' +
        '</div>'+
        ' </div>' +
            '</div>'+
        '</div>'+
        '</div>';

   
    return content;
}

$(".load-more-list").click(function () {
    let curentPage = parseInt($("#people-search-result").attr("current-page"));
    let totalPage = parseInt($("#people-search-result").attr("total-page"));
    let nextPage = (curentPage < totalPage + 1) ? + curentPage + 1 : totalPage;
    if (nextPage <= totalPage) {
        let dataSearch = getDataSearchPeople();
        dataSearch.page = nextPage;
        searchPeople(dataSearch);
        $("#people-search-result").attr("current-page", nextPage);
    }
    
    
})

$("#go-to-top").click (function () {
    $("#section-landing-1 span").click();
})
function scrollTo(id) {
    $('html, body').animate({ scrollTop: $('#'+id).offset().top }, 'slow');
    return false;
}

/*Load first */
if ($("#available-positions-section").length > 0) {
    let dataSearch = getDataToPostCareer();
    searchCareer(dataSearch);
}

/*Load all people*/
if ($("#people-search-result").length > 0) {
    let dataSearchPeople = getDataSearchPeople();
    searchPeople(dataSearchPeople);

}


   
$(".department-item").click(function () {  
    $(".departments-list").attr("department-current", $(this).attr("department-name"));

    let dataSearch = getDataToPostCareer();  
  
    if (dataSearch.departMent !== "all") {      
        searchCareer(dataSearch);
        $("#jobs-result-all").addClass("hide");
        $("#jobs-result").removeClass("hide");
    } else {
     
        $("#jobs-result-all").removeClass("hide");
        $("#jobs-result").addClass("hide");
    }

    $(".department-item").removeClass("strong");
    $(this).addClass("strong");
   

})

function getDataToPostCareer() {
    let ctid = $("#ctid").attr("ctid");
    let page = $("#paginationList").attr("curentpage");
    let department = $(".departments-list").attr("department-current");
    let country = $("#job-location-select .dropdown-toggle").attr("value"); 
   /* let team = "all";*/
    let dataSearch = { page: page, department: department, country: country,  ctid: ctid }  
    return dataSearch;
}
function renderItemCareers(item) {
    
    let result = '<div class="job-item">' +
        '<div class="left">'+
        '<h2 class="job-title"> <a  href = "' + item.Url + '" >' + item.Name + '</a> </h2>'+
        '<a class="job-location" href = "' + item.Url + '" >' + item.Location + '</a>'+
        '</div>'+
        '<div class="right">'+
        '    <p class="job-link"> <a href="' + item.Url + '"><i class="fas fa-chevron-right arrow arrow-1"></i><i class="fas fa-chevron-right arrow arrow-2"></i><i class="fas fa-chevron-right arrow arrow-3"></i></a> </p>'+
    '</div>' +

        '</div>';
    return result;
}



function renderItemCareersMobile(item) {

    let result = '<div class="job-item">' +
        '<div class="left">' +
        '<a href="' + item.Url + '"> <h2 class="job-title">' + item.Name + '</h2>' +
        '<a class="job-location" href = "' + item.Url + '" >' + item.Location + '</a>' +
        '</div>' +
        '</div>';
    return result;
}

function renderItemInsightsMobile(content) {
    console.log(content);
    let title = content.Name;
    let date = content.Date;
    let url = content.Url;
    let description = content.Sumary;
    let tags = content.Tags;
    let timeToRead = content.TimeRead;
    let author = content.Author;    
    var tagsContent = '';
    var image = content.Image;

    if (tags.length > 0) {
        tags.forEach(function (e, i) {
            if (i < 3) {
                tagsContent += '<li> #' + e + '</li >';

            }

        })
    }
    var authorCotent = '';
    if (author.length > 0) {
        author.forEach(function (e, i) {
            if (i == 0) {
                authorCotent += '<span>' + e.Name + '</span>';
            } else {
                authorCotent += ', <span>' + e.Name + '</span>';
            }

        })
    }

    var content =

        '<div class="col-xs-12 col-md-12 col-lg-9 news-banner item item-news " style="background:url(' + image + ')">' +
        ' <div class="item-content news-content-box">' +

        '<div class="title"> <a href="' + url + '">' + title + ' </a> </div>' +
        '<div class="description">' + description + '</div>'+
        '<p class="datetime">' + date + '</p>' +
      
        ' <p class="author">' +
        authorCotent +

        '</p>' +
      
            '<a href="' + url + '" class="readmore" tabindex="-1">READ MORE &nbsp; <i class="fas fa-chevron-right arrow arrow-1"></i><i class="fas fa-chevron-right arrow arrow-2"></i><i class="fas fa-chevron-right arrow arrow-3"></i></a>'+
       
            '</div>'+
        '</div>';

   
    return content;
}


function renderItemWebinarsMobile(content) {
    console.log(content);
    let title = content.Name;
    let date = content.Date;
    let url = content.Url;
    let description = content.Sumary;
    let tags = content.Tags;
    let timeToRead = content.TimeRead;
    let author = content.Author;
    var tagsContent = '';
    var image = content.Image;

    if (tags.length > 0) {
        tags.forEach(function (e, i) {
            if (i < 3) {
                tagsContent += '<li> #' + e + '</li >';

            }

        })
    }
    var authorCotent = '';
    if (author.length > 0) {
        author.forEach(function (e, i) {
            if (i == 0) {
                authorCotent += '<span>' + e.Name + '</span>';
            } else {
                authorCotent += ', <span>' + e.Name + '</span>';
            }

        })
    }

    var content =

        ' <div class="new-box col-xs-12 col-md-12 col-lg-4">' +
        '<div class="content-box">'+
        '<p class="title"> <a href="' + url + '" tabindex="-1">' + title +'</a> </p>'+
        '<p class="author">' + authorCotent +
               '   </p>'+
            '<p class="watch-now"><a href="'+url+'" tabindex="-1">Watch Now</a></p>'+
        '</div>'+
        '</div>';


    return content;
}


function renderPagination(page, totalPage) {
 
    let renderContent = "";
                if (page > 1)
                {
                    renderContent += "<li><a class='careersPageNum'   page='" + p + "'>Prev</a></li>";
                }
    for (var p = 1; p < totalPage + 1; p++)
    {
        let active = "active";
        if (page != p) {
            active = "";
        }
                    renderContent += "<li class='"+ active+"'> <a class='careersPageNum'   page='"+p+"'>"+ p +"</a> </li>";
                 }
    if (page < totalPage)
                {
        renderContent += "<li><a class='careersPageNum' page='" +p + "' >Next</a></li>";
                }
    return renderContent;
    
}

function checkAuthorStiky(scrollPosition) {
   
    if ($("#news-content-section").length) {
        var percent = 0;
        var newsContentPosition = $(".news-content").position().top;
        var newsEndPosition = $("#news-tags").position().top;
        let windowWidth = $(window).width();
        console.log(windowWidth)
        if (windowWidth >= 1920) {
            if ((scrollPosition >= (newsContentPosition - 200)) && (scrollPosition <= (newsEndPosition + 600))) {
                $("#author-sticky").fadeIn("slow");
                $("#author-sticky").removeClass('hide');

                percent = ((scrollPosition - newsContentPosition) / (newsEndPosition) + 0.1) * 100;
                $(".progress-bar").css("height", percent);

                if ($(".wrap-author-process .item-author").length > 5) {
                    $("#author-sticky").css("top", -(percent * 1.2 - 40) + "%")
                }


            } else {

                if (!$("#author-sticky").hasClass('hide')) {
                    $("#author-sticky").fadeOut("slow");
                    /* $("#author-sticky").addClass('hide');*/

                }
            }
        } else if (windowWidth < 1920 && windowWidth >= 1300) {
            if ((scrollPosition >= (newsContentPosition - 200)) && (scrollPosition <= (newsEndPosition + 200))) {
                $("#author-sticky").fadeIn("slow");
                $("#author-sticky").removeClass('hide');

                percent = ((scrollPosition - newsContentPosition) / (newsEndPosition) + 0.1) * 100;
                $(".progress-bar").css("height", percent);

                if ($(".wrap-author-process .item-author").length > 5) {
                    $("#author-sticky").css("top", -(percent * 1.2 - 40) + "%")
                }


            } else {

                if (!$("#author-sticky").hasClass('hide')) {
                    $("#author-sticky").fadeOut("slow");
                    /* $("#author-sticky").addClass('hide');*/

                }
            }
        }
       
    }
   

}

//$("#chinaServicesId").css("top", "2000px");

function processChinaServices(scroll) {  
    var number =  (scroll / 1000) * 50;
    var windowWidth = $(window).width();  
    if (windowWidth <= 1200) {        
        $(".china-section-content").removeClass("china-service-desktop-content");
        $(".china-section-content").addClass("china-service-mobile-content");
        return 0;
    }
   /* setAnimation(1, 13, scroll);*/
    if (windowWidth <= 2026) {
        
        if ($("#chinaServicesId").length > 0) {
            if (scroll < 1000) {
               /* $('.header').css({ 'position': 'absolute' });*/

            } else if (scroll > 1500 && scroll < 1600) {
              /*  $("#chinaServicesId").css("top", "600px");*/
                //$("#services-in-china-title").removeClass('title-fixed');
              /*  $('.header').css({ 'position': 'fixed' });*/

            } else if (scroll >= 1600 && scroll < 9800) {
            
                /*$(".image-item-services").css("transform", "translateY(" + number + "px) rotateZ(" + number + "deg)");*/
             
              /*  $('.header').css({ 'position': 'fixed' });*/
                $(".services-control").removeClass('hide');
          /*      $("#chinaServicesId").css("top", "-148px");*/
                //$("#services-in-china-title").removeClass('hide');
                //$("#services-in-china-title").addClass('title-fixed');
            } else if (scroll >= 9800) {
               
                $(".services-control").addClass('hide');
                //$("#services-in-china-title").addClass('hide');
                if (scroll > 10600) {
                  /*  $('.header').css({ 'position': 'absolute' });*/
                }

            } else {
                //$("#services-in-china-title").addClass('hide');
               /* $("#chinaServicesId").css("top", "900px");*/
                if (!$(".services-control").hasClass('hide')) {
                    $(".services-control").addClass('hide');
                }

            }
        }
    } else if (windowWidth >= 2027 && windowWidth < 2500 ) {
      
        if ($("#chinaServicesId").length > 0) {

            if (scroll < 400) {
                if (!$("#chinaServicesId").hasClass("hide")) {
                    $("#chinaServicesId").addClass("hide");
                }
               /* $('.header').css({ 'position': 'absolute' });*/

            } else if (scroll > 1500 && scroll < 1600) {
              /*  $("#chinaServicesId").css("top", "100px");*/
                //$("#services-in-china-title").removeClass('title-fixed');
   /*             $('.header').css({ 'position': 'fixed' });*/

            } else if (scroll >= 1600 && scroll < 9800) {
               /* $('.header').css({ 'position': 'fixed' });*/
                $(".services-control").removeClass('hide');
              /*  $("#chinaServicesId").css("top", "100px");*/
                //$("#services-in-china-title").removeClass('hide');
                //$("#services-in-china-title").addClass('title-fixed');
            } else if (scroll >= 9800) {
                
                $(".services-control").addClass('hide');
                //$("#services-in-china-title").addClass('hide');
                if (scroll > 10600) {
                  /*  $('.header').css({ 'position': 'absolute' });*/
                }

            } else {
                $("#chinaServicesId").removeClass("hide");
                //$("#services-in-china-title").addClass('hide');
             /*   $("#chinaServicesId").css("top", "100px");*/
                if (!$(".services-control").hasClass('hide')) {
                    $(".services-control").addClass('hide');
                }

            }
        }
    }
    else if (windowWidth >= 2500) {
      
        if ($("#chinaServicesId").length > 0) {

            if (scroll < 1400) {
              /*  if (!$("#chinaServicesId").hasClass("hide")) {
                    $("#chinaServicesId").addClass("hide");
                }*/
               /* $('.header').css({ 'position': 'absolute' });*/

            } else if (scroll > 1500 && scroll < 1600) {
              
               /* $("#chinaServicesId").css("top", "200px");*/
                //$("#services-in-china-title").removeClass('title-fixed');
               /* $('.header').css({ 'position': 'fixed' });*/

            } else if (scroll >= 1600 && scroll < 9800) {
             /*   $('.header').css({ 'position': 'fixed' });*/
                $(".services-control").removeClass('hide');
                /*$("#chinaServicesId").css("top", "100px");*/
                //$("#services-in-china-title").removeClass('hide');
                //$("#services-in-china-title").addClass('title-fixed');
            } else if (scroll >= 9800) {
                $(".services-control").addClass('hide');
                //$("#services-in-china-title").addClass('hide');
                if (scroll > 10600) {
                  /*  $('.header').css({ 'position': 'absolute' });*/
                }

            } else {
                $("#chinaServicesId").removeClass("hide");
                //$("#services-in-china-title").addClass('hide');
         /*       $("#chinaServicesId").css("top", "100px");*/
                if (!$(".services-control").hasClass('hide')) {
                    $(".services-control").addClass('hide');
                }

            }
        }
    }
    
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
var ramdomPosition = [];
for (let i = 0; i < 13; i++) {  
    let random_rotation = getRandomIntInclusive(1, 2);
    let object = {};
    object.way = random_rotation;
    object.data = getRandomIntInclusive(1, 10);
    ramdomPosition[i] = object; 
}
var lastservicePosition = 0; 


var scroll_top = 0;
function checkScrollWay(scroll) {
    let result = 0;
    if (scroll > scroll_top) {
        result = 1;
    } 
    scroll_top = scroll;
  
    return result;

}
function setAnimation(min, max, scroll, scroll_top) {
   
    let random = getRandomIntInclusive(1, 3);
    let scrollWay = checkScrollWay(scroll);
    if (scrollWay) {
       
        for (let i = min ; i <= max; i++) {
            let status = $("#item-image-" + i).attr('status') + "";
            let key = $("#item-image-" + i).attr("key");
           
            if (status === "0" && typeof key == "undefined") {              
                let key = getRandomIntInclusive(1, 6);              
                $("#item-image-" + i).removeClass("background-move-left-" + key);
                $("#item-image-" + i).addClass("background-move-right-" + key);
                $("#item-image-" + i).attr("status", "1");
                $("#item-image-" + i).attr('key', key);
            } else if (status === "0") {
                let key = $("#item-image-" + i).attr("key");
                $("#item-image-" + i).removeClass("background-move-left-" + key);
                $("#item-image-" + i).addClass("background-move-right-" + key);
                $("#item-image-" + i).attr("status", "1");
                $("#item-image-" + i).attr('key', key);
            }

        }

    } else {
       
        for (let i = min; i <= max; i++) {
            let status = $("#item-image-" + i).attr('status') + "";

            if (status == "1") {
              
                let key = $("#item-image-" + i).attr("key");
                $("#item-image-" + i).removeClass("background-move-right-" + key);
                $("#item-image-" + i).addClass("background-move-left-" + key);
                $("#item-image-" + i).attr("status", "0");
            }

        }

    }

}
function processSiteServices(scroll) {
    if (scroll <= 1000) {
        setAnimation(0, 3, scroll);
    } else if (scroll > 1500 && scroll < 3000) {
        setAnimation(4, 6, scroll);
    } else if (scroll >= 3000 && scroll < 5700) {
        setAnimation(7, 9, scroll);
    } else if (scroll >= 5700) {
        setAnimation(10, 13, scroll);
    }
   
    
  
   
    var windowWidth = $(window).width();
    if (windowWidth <= 1200) {
      
        $("header").removeClass("header");

    }
   
   
  /*  $(".image-item-services").css("transform", "translateY(" + number + "px) rotateZ(" + number + "deg)");*/
    if ($("#siteServicesId").length > 0) {

      
          
    }

    
}

/*Check Browser */
function checkBrowser(windowWidth) {
    var ua = window.navigator.userAgent;
   
    if (windowWidth <= 1024) {
        $("header").addClass("header-mobile");
    }
}

function CheckAcceptCookies() {
    let checked = getAcceptCookies();
   
    if (checked == "true") {
        $(".cookies-notification").hide();
    } else {
        $(".cookies-notification").show();
    } 
}

function getAcceptCookies() {
    var cookieValue = getCookie("acceptcookies")
    return cookieValue;
}

function AcceptCookies() {   
    setCookie("acceptcookies", "true", 10);
    CheckAcceptCookies();   
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}

var position = $(window).scrollTop(); 
    $(window).scroll(function () {  
        var scroll = $(window).scrollTop();  

    processChinaServices(scroll);
    processSiteServices(scroll);


    if(scroll > position) {  
        checkAuthorStiky(scroll);
        $(".main-image").addClass ('main-image-animation-down');
    } else {
        checkAuthorStiky(scroll);
    }  
});

$('html').bind('mousewheel DOMMouseScroll', function (e) {
    if ($("#section3").hasClass('active')) {
        $('header').css({ 'background-color': '#FFF' });   
        /*   $('.header-bar').css({ 'position': 'absolute' })*/
      /*  $('header').addClass("header-fixed");*/
        $("#fp-nav").addClass("hide");
    } else {
        var windowWidth = $(window).width();
        if (windowWidth > 1200) {
            $('header').css({ 'background-color': 'unset' }); 
        }
        
        if ($("#china-services").length == 0) {
           /* $('header').css({ 'background-color': 'unset' });*/
            $('.header-bar').css({ 'position': 'fixed' });
          /*  $('header').removeClass("header-fixed");*/
        }


        $("#fp-nav").removeClass("hide");
      
    }

});

$(".top-header .ul-menu .nav-item").each(function () {
    var nav_item = $(this);
    var dropdown = $(this).find('.dropdown-content').first();
    if (dropdown.length > 0) {
        var li = dropdown.find('.sub-menu-group li');
        var sub_menu = dropdown.find('.sub-menu-group').first();
        if (li.length > 0) {
            var max_width = 0;
            li.each(function () {
                var item = $(this);
                dropdown.css({ position: "absolute", visibility: "hidden", display: "block" });
                var item_width = $(this).innerWidth();
                dropdown.css({ position: "", visibility: "", display: "" });
                if (item_width > max_width) {
                    max_width = item_width;
                }
            });
            if (max_width > 0) {
                li.each(function () {
                    var item = $(this);
                    item.css('width', max_width);
                });
                sub_menu.css('width', max_width * 2);
            }
        }
    }
})
$(".people-filter-controller.mobile-version .title").click(function () {
    let isShow = $(this).attr("show-filter");
    if (isShow == "true") {
        $(this).text("Filter Results");
        $(this).attr("show-filter", "false");
        $("#clear-all").addClass("hide")
    } else {
        $(this).text("Filter By");
        $(this).attr("show-filter", "true");
        $("#clear-all").removeClass("hide")
    }
  
})