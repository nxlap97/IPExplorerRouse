/**
*	jQuery Plugin for simple vertical scrolling - horizontal movement parallax effect
*	I wrote this plugin for a project we have done.
*
*	License:
*	The MIT License (MIT)
*
*	@version 0.8.1
*
*   Copyright (c) 2013 pixxelfactory
*   
*   Permission is hereby granted, free of charge, to any person obtaining a copy
*   of this software and associated documentation files (the "Software"), to deal
*   in the Software without restriction, including without limitation the rights
*   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*   copies of the Software, and to permit persons to whom the Software is
*   furnished to do so, subject to the following conditions:
*   
*   The above copyright notice and this permission notice shall be included in
*   all copies or substantial portions of the Software.
*   
*   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*   THE SOFTWARE.
**/
(function ($) {
    'use strict';

    $.jInvertScroll = function(sel, options) {
        var defaults = {
            width: 'auto',		    // The horizontal container width
            height: 'auto',		    // How far the user can scroll down (shorter distance = faster scrolling)
            onScroll: function(percent) {  // Callback fired when the user scrolls down, the percentage of how far the user has scrolled down gets passed as parameter (format: 0.xxxx - 1.0000)
                // do whatever you like
            }
        };
        
        var config = $.extend(defaults, options);
        
        if(typeof sel === 'Object' && sel.length > 0) {
            return;
        }
        
        var elements = [],
            longest = 0,
            totalHeight,
            winHeight,
            winWidth;
        
        // Extract all selected elements from dom and save them into an array
        $.each(sel, function(i, val) {
            $(val).each(function(e) {
                var tmp = {
                    width: $(this).width(),
                    height: $(this).height(),
                    el: $(this)
                }
                
                elements.push(tmp);
                
                if(longest < tmp.width) {
                    longest = tmp.width;
                }
            });
        });
        
        // Use the longest elements width + height if set to auto
        if(config.width == 'auto') {
            config.width = longest;
        }
        
        if(config.height == 'auto') {
            config.height = longest;
        }
        
        // Set the body to the selected height
        $('body').css('height', config.height+'px');
        
        $([document, window]).on('ready resize', function (e) {
            totalHeight = $(document).height();
            winHeight = $(this).height();
            winWidth = $(this).width();
            
        });

        var title_china_to_top = 0;
        var section_china_to_top = 0
        var section_china_services_credentials_to_top = 0;
        var where_we_work_country_height = 0;
        var china_overview_height = 0;
        var title_china_height = 0;
        var header_height = 0;
        var main_height = 0;
        var total_height = 0;

        $(document).ready(function () {
            //where_we_work_country_height = $('#where-we-work-country').height();
            //china_overview_height = $('#china-overview').height();
            //title_china_height = $("#services-in-china-title").height();
            //title_china_to_top = $("#services-in-china-title").position().top;
            //section_china_to_top = where_we_work_country_height + china_overview_height + title_china_height;
            //section_china_services_credentials_to_top = $('.china-services-credentials').position().top;
            //var where_we_work_country_height = $('#where-we-work-country').outerHeight(true);
            //$("#chinaServicesId").css('top', section_china_to_top);
            //$("#chinaServicesId").css('left', 0);
            //header_height = $('header.header').first().outerHeight(true);
            //main_height = $('main.home-service').first().outerHeight(true);
            //var front_pages = $('#chinaServicesId > .page');
            //front_pages.map(function () {
            //    total_height += $(this).outerWidth(true);
            //});
            //total_height += header_height + main_height;
            //$('#chinaServicesId.front').css('width', (total_height - -420) + 'px');
            //$('body').css('height', (total_height - 420) + 'px');

            CheckHeight();
        });

        $(window).on('resize', function (e) {
            //CheckHeight();
        })

        function CheckHeight() {
            where_we_work_country_height = $('#where-we-work-country').height();
            china_overview_height = $('#china-overview').height();
            title_china_height = $("#services-in-china-title").height();
            title_china_to_top = $("#services-in-china-title").position().top;
            section_china_to_top = where_we_work_country_height + china_overview_height + title_china_height;
            section_china_services_credentials_to_top = $('.china-services-credentials').position().top;
            var where_we_work_country_height = $('#where-we-work-country').outerHeight(true);
            $("#chinaServicesId").css('top', section_china_to_top);
            $("#chinaServicesId").css('left', 0);
            header_height = $('header.header').first().outerHeight(true);
            main_height = $('main.home-service').first().outerHeight(true);
            var front_pages = $('#chinaServicesId > .page');
            front_pages.map(function () {
                total_height += $(this).outerWidth(true);
            });
            total_height += header_height + main_height;
            $('#chinaServicesId.front').css('width', (total_height - 490) + 'px');
            $('body').css('height', (total_height - 490) + 'px');
        }

        // Listen for the actual scroll event
        $(window).on('scroll resize', function (e) {
            var window_width = $(window).width();
            var window_height = $(window).height();
            var title_china_height = $("#services-in-china-title").outerHeight(true);

            var currY = $(this).scrollTop();

            var magic_top_section_china = section_china_to_top - currY;
            if (magic_top_section_china < -150) {
                magic_top_section_china = -150;
            }

            var magic_left_section_china = section_china_to_top - currY;
            console.log(magic_left_section_china);
            if (magic_left_section_china >= -150) {
                magic_left_section_china = -1600;
            } else {
                magic_left_section_china = -1600 + (magic_left_section_china + 150);
            }

            $("#chinaServicesId").css('top', magic_top_section_china + "px");
            $("#chinaServicesId").css('left', magic_left_section_china + "px");
            $("#chinaServicesId").css({
                transition: 'all 0.1s linear',
                WebkitTransition: 'all 0.1s linear',
                MozTransition: 'all 0.1s linear',
                MsTransition: 'all 0.1s linear',
                OTransition: 'all 0.1s linear',
            });

            

            if (currY >= (title_china_to_top -20) && currY < (section_china_services_credentials_to_top - window_height)) {

                $("#services-in-china-title").addClass('title-fixed');
                $("#services-in-china-title").removeClass('hide');
             
                $("#services-in-china-title").css({
                    transition: 'all 0.1s linear',
                    WebkitTransition: 'all 0.1s linear',
                    MozTransition: 'all 0.1s linear',
                    MsTransition: 'all 0.1s linear',
                    OTransition: 'all 0.1s linear',
                });
            } else if (currY >= (section_china_services_credentials_to_top - window_height)) {
                $("#services-in-china-title").addClass('hide');
                $("#services-in-china-title").addClass('title-fixed');
            } else {
                $("#services-in-china-title").removeClass('title-fixed');
                $("#services-in-china-title").removeClass('hide');
            }

            

            //




            //
            
            // Current percentual position
            var scrollPercent = (currY / (totalHeight - winHeight)).toFixed(4);
            
            // Call the onScroll callback
            if(typeof config.onScroll === 'function') {
                config.onScroll.call(this, scrollPercent);
            }
            
            // do the position calculation for each element
            //$.each(elements, function (i, el) {
                
            //    var pos = Math.floor((el.width - winWidth) * scrollPercent) * -1;
            //    var windowWidth = $(window).width(); 
            //    console.log('wind width');
            //    console.log(windowWidth);
            //    console.log('scrollPercent')
            //    console.log(scrollPercent);
            //    console.log('pos');
            //    console.log(pos);

               
            //    if ($("#chinaServicesId").length > 0) {               
            //    /*Screen  <= 1920*/               
            //        var min_top = -148;
            //        if (pos > -945) {
            //            el.el.css('top', 2000);
            //            pos = pos + 600;
            //            el.el.css('left', pos);
            //        } else if (pos < -1200 && pos > -2000) {
            //            console.log("nottttttttttttttttttttttttttt");
            //            el.el.css('top', 600);
            //            let temp_top = (600 - scrollPercent * 4000);
            //            if (temp_top <= min_top) {
            //                temp_top = min_top;
            //            }
            //            el.el.removeClass("china-service-custom");
            //            el.el.css('top', temp_top);

            //          /*  pos = -800;*/
            //            $("header").removeClass("background-unset");
            //            pos = pos + 600;
            //            el.el.css('left', pos);

            //        } else if (pos <= -2000 && pos > -2100 ) {
            //            $("header").addClass("background-unset");
            //            el.el.addClass("china-service-custom");
            //            el.el.css('top', 0);    
            //          /*  pos = -900;*/

            //        }else if (pos <= -2100 && pos > -8074) {
            //            $("header").addClass("background-unset");
            //            el.el.addClass("china-service-custom");
            //            el.el.css('top', min_top);                    
            //            pos = pos + 600;
            //            el.el.css('left', pos);
            //        }
            //        else if (pos < -8074 && pos > -8300) {
            //            $("header").removeClass("background-unset");
            //            el.el.removeClass("china-service-custom");
            //            $("#services-in-china-title").addClass("hide");
                            
            //            el.el.css('top', -(scrollPercent * 300));
            //            console.log('el');
                      
            //            pos = -7474;
            //            el.el.css('left', pos);

            //        }
            //        else if (pos < -8300 && pos > -8600) {
            //            $("header").removeClass("background-unset");
            //            el.el.removeClass("china-service-custom");
            //            $("#services-in-china-title").addClass("hide");

            //            el.el.css('top', -(scrollPercent * 500));
                    
            //            pos = -7474;
            //            el.el.css('left', pos);

            //        }
            //        else if (pos < -8600 && pos > -10000) {
            //            $("header").removeClass("background-unset");
            //            el.el.removeClass("china-service-custom");
            //            $("#services-in-china-title").addClass("hide");

            //            el.el.css('top', -(scrollPercent * 900));
            //            console.log('el');
            //            console.log(scrollPercent * 500);
            //            pos = -7474;
            //            el.el.css('left', pos);

            //        }

            //     /*   else if (pos < -9000 && pos > -10000) {
            //            $("header").removeClass("background-unset");
            //            el.el.removeClass("china-service-custom");
            //            $("#services-in-china-title").addClass("hide");
            //            *//*$("header").addClass("hide");*//*
            //            pos = -7400;
            //            el.el.css('top', -(100 + scrollPercent * 500));
            //            console.log('el');
            //            console.log(scrollPercent * 500);

            //        }*/
            //        else if (pos <= -10000) {
            //            el.el.removeClass("china-service-custom");
            //            pos = -7474;
            //            el.el.css('top', -(100 + scrollPercent * 1200));
            //            console.log('el');
            //            console.log(scrollPercent * 1000);
            //            console.log('pos newwwwwwwwwwwwwwwwwwww');
            //            console.log(pos);
            //            pos = pos;
            //            el.el.css('left', pos);


            //        } else {
            //        /*   $("header").removeClass("hide");*/

            //        }

                        
                 
               
               
                
               
            //    }
            //});
        });
    };
}(jQuery));