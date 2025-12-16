/* main js */
(function ($) {
    "use strict";

    /* Loader */
    $(window).on("load", function () {
        $(".bix-loader").fadeOut("slow");
    });

    /* Aos animation on scroll */
    AOS.init({
        once: true,
    });

    /* Header fixed */
    $(function () {
        var header = $(".bix-static");
        $(window).scroll(function () {
            var scroll = $(window).scrollTop();

            if (scroll >= 10) {
                header.removeClass('bix-static').addClass("bix-fixed");
            } else {
                header.removeClass("bix-fixed").addClass('bix-static');
            }
        });
    });

    /* Mobaile menu slider */
    $('.navbar-toggler').on("click", function () {
        $('.bix-sidebar-overlay').fadeIn();
        $('.bix-mobile-menu').addClass("bix-menu-open");
    });

    $('.bix-sidebar-overlay, .bix-close').on("click", function () {
        $('.bix-sidebar-overlay').fadeOut();
        $('.bix-mobile-menu').removeClass("bix-menu-open");
    });

    function ResponsiveMobilemsMenu() {
        var $msNav = $(".bix-menu-content, .overlay-menu"),
            $msNavSubMenu = $msNav.find(".sub-menu");
        $msNavSubMenu.parent().prepend('<span class="menu-toggle"></span>');

        $msNav.on("click", "li a, .menu-toggle", function (e) {
            var $this = $(this);
            if ($this.attr("href") === "#" || $this.hasClass("menu-toggle")) {
                e.preventDefault();
                if ($this.siblings("ul:visible").length) {
                    $this.parent("li").removeClass("active");
                    $this.siblings("ul").slideUp();
                    $this.parent("li").find("li").removeClass("active");
                    $this.parent("li").find("ul:visible").slideUp();
                } else {
                    $this.parent("li").addClass("active");
                    $this.closest("li").siblings("li").removeClass("active").find("li").removeClass("active");
                    $this.closest("li").siblings("li").find("ul:visible").slideUp();
                    $this.siblings("ul").slideDown();
                }
            }
        });
    }

    ResponsiveMobilemsMenu();

    /* hero parallaxmouse */
    if (matchMedia('only screen and (min-width: 991px)').matches) {
        $(window).on('mousemove', function (e) {
            var w = $(window).width();
            var h = $(window).height();
            var offsetX = 0.5 - e.pageX / w;
            var offsetY = 0.5 - e.pageY / h;

            $(".hero-parallax").each(function (i, el) {
                var offset = parseInt($(el).data('offset'));
                var translate = "translate3d(" + Math.round(offsetX * offset) + "px," + Math.round(offsetY * offset) + "px, 0px)";

                $(el).css({
                    '-webkit-transform': translate,
                    'transform': translate,
                    'moz-transform': translate
                });
            });
        });
    }

    /* Portfolio */
    $(function () {
        var filterList = {
            init: function () {
                $('.item-grid').mixItUp({
                    selectors: {
                        target: '.item',
                        filter: '.filter'
                    },
                    load: {
                        filter: 'all'
                    }
                });
            }
        };
        filterList.init();
    });

    /* Testimonials */
    $('.testimonials-slider').owlCarousel({
        loop: true,
        margin: 24,
        responsiveClass: true,
        dots: false,
        nav: false,
        pagination: false,
        autoplay: true,
        autoplaySpeed: 2000,
        autoplayHoverPause: false,
        responsive: {
            0: {
                items: 1,
            }
        }
    });

    /* blog */
    $('.bix-blog-wrap').owlCarousel({
        loop: true,
        margin: 24,
        responsiveClass: true,
        dots: false,
        nav: false,
        pagination: false,
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 2,
            }
        }
    });

    /*----------- modal ----------------*/
    $(".bix-modal-toggle").on("click", function () {
        $(".bix-modal-overlay").fadeIn();
        $(".bix-modal").fadeIn();
        $("body").addClass("bix-overflow-hidden")
        $(".bix-modal-dialog").addClass("bix-fadeOutUp");
        $(".bix-modal-dialog").removeClass("bix-fadeInDown");
    });

    $(".bix-close-modal, .bix-modal-overlay").on("click", function () {
        $(".bix-modal-overlay").fadeOut();
        $(".bix-modal").fadeOut();
        $("body").removeClass("bix-overflow-hidden")
        $(".bix-modal-dialog").removeClass("bix-fadeOutUp");
        $(".bix-modal-dialog").addClass("bix-fadeInDown");
    });

    /* Achievement tabs */
    $("#bix_activity li:nth-child(1)").addClass("active");
    $(".tab-activity-pane").hide();
    $(".tab-activity-pane:nth-child(1)").show();
    $("#bix_activity li").click(function () {
        $("#bix_activity li").removeClass("active");
        $(this).addClass("active");
        $(".tab-activity-pane").hide();
        var activeTab = $(this).find("a").attr("href");
        $(activeTab).fadeIn();
        return false;
    });

    /* Accordians toggle (faq) */
    $(".bix-accordion-header").click(function () {
        if ($(".bix-accordion-body").is(":visible")) {
            $(".bix-accordion-body").slideUp(300);
            $("h4").removeClass("active-arrow");
        }
        if ($(this).next(".bix-accordion-body").is(":visible")) {
            $(this).next(".bix-accordion-body").slideUp(300);
            $("h4").removeClass("active-arrow");
        } else {
            $(this).next(".bix-accordion-body").slideDown(300);
            $(this).addClass("active-arrow");
        }
    });

    /* contact tabs */
    $("#contact_tabs li:nth-child(1)").addClass("active");
    $(".tab-contact-pane").hide();
    $(".tab-contact-pane:nth-child(1)").show();
    $("#contact_tabs li").click(function () {
        $("#contact_tabs li").removeClass("active");
        $(this).addClass("active");
        $(".tab-contact-pane").hide();
        var activeTab = $(this).find("a").attr("href");
        $(activeTab).fadeIn();
        return false;
    });

    /* Tab to top */
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $(".back-to-top").fadeIn();
        } else {
            $(".back-to-top").fadeOut();
        }
    });

    var progressPath = document.querySelector('.back-to-top-wrap path');
    var pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
    var updateProgress = function () {
        var scroll = $(window).scrollTop();
        var height = $(document).height() - $(window).height();
        var progress = pathLength - (scroll * pathLength / height);
        progressPath.style.strokeDashoffset = progress;
    }
    updateProgress();
    $(window).scroll(updateProgress);
    var offset = 50;
    var duration = 550;
    jQuery(window).on('scroll', function () {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('.back-to-top-wrap').addClass('active-progress');
        } else {
            jQuery('.back-to-top-wrap').removeClass('active-progress');
        }
    });
    jQuery('.back-to-top-wrap').on('click', function (event) {
        event.preventDefault();
        jQuery('html, body').animate({ scrollTop: 0 }, duration);
        return false;
    })

    /* Date */
    var date = new Date().getFullYear();
    document.getElementById("copyright_year").innerHTML = date;

    /* Tools Sidebar */
    $('.bix-tools-sidebar-toggle').on("click", function () {
        $('.bix-tools-sidebar').addClass("open-tools");
        $('.bix-tools-sidebar-overlay').fadeIn();
        $('.bix-tools-sidebar-toggle').hide();
    });
    $('.bix-tools-sidebar-overlay, .close-tools').on("click", function () {
        $('.bix-tools-sidebar').removeClass("open-tools");
        $('.bix-tools-sidebar-overlay').fadeOut();
        $('.bix-tools-sidebar-toggle').fadeIn();
    });

    /* color show */
    $(".bix-color li").on("click", function () {
        $("li").removeClass("active-variant");
        $(this).addClass("active-variant");
    });

    $(".color-primary").on("click", function () {
        $("#add_class").remove();
    });

    $(".color-1").on("click", function () {
        $("#add_class").remove();
        $("head").append(
            '<link rel="stylesheet" href="assets/css/color-1.css" id="add_class">'
        );
    });
    $(".color-2").on("click", function () {
        $("#add_class").remove();
        $("head").append(
            '<link rel="stylesheet" href="assets/css/color-2.css" id="add_class">'
        );
    });
    $(".color-3").on("click", function () {
        $("#add_class").remove();
        $("head").append(
            '<link rel="stylesheet" href="assets/css/color-3.css" id="add_class">'
        );
    });
    $(".color-4").on("click", function () {
        $("#add_class").remove();
        $("head").append(
            '<link rel="stylesheet" href="assets/css/color-4.css" id="add_class">'
        );
    });
    $(".color-5").on("click", function () {
        $("#add_class").remove();
        $("head").append(
            '<link rel="stylesheet" href="assets/css/color-5.css" id="add_class">'
        );
    });
    $(".color-6").on("click", function () {
        $("#add_class").remove();
        $("head").append(
            '<link rel="stylesheet" href="assets/css/color-6.css" id="add_class">'
        );
    });
    $(".color-7").on("click", function () {
        $("#add_class").remove();
        $("head").append(
            '<link rel="stylesheet" href="assets/css/color-7.css" id="add_class">'
        );
    });
    $(".color-8").on("click", function () {
        $("#add_class").remove();
        $("head").append(
            '<link rel="stylesheet" href="assets/css/color-8.css" id="add_class">'
        );
    });
    $(".color-9").on("click", function () {
        $("#add_class").remove();
        $("head").append(
            '<link rel="stylesheet" href="assets/css/color-9.css" id="add_class">'
        );
    });

    /* RTL-LTR Modes */
    $(".bix-tools-rtl .bix-tools-item").on("click", function () {
        $(".active-mode").removeClass("active-mode");
        $(this).addClass("active-mode");
    });
    $(".ltr").on("click", function () {
        $("#add_rtl").remove();
    });
    $(".rtl").on("click", function () {
        $("#add_rtl").remove();
        $("head").append(
            '<link rel="stylesheet" href="assets/css/rtl.css" id="add_rtl">'
        );
    });

    /*Dark Light Modes */
    $(".bix-tools-dark .bix-tools-item").on("click", function () {
        $(".active-dark-mode").removeClass("active-dark-mode");
        $(this).addClass("active-dark-mode");
    });
    $(".light").on("click", function () {
        $("#add_dark").remove();
    });
    $(".dark").on("click", function () {
        $("#add_dark").remove();
        $("head").append(
            '<link rel="stylesheet" href="assets/css/dark.css" id="add_dark">'
        );
    });

    var forEach = function (array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]);
        }
    };

    /* Skill Circle */
    var progress = $('#progress');
    $(window).scroll(function () {
        var a = 0;
        var b = 0;
        var oTop = 0;
        if (progress.length) {
            var oTop = progress.offset().top - window.innerHeight;
            if (b == 0 && $(window).scrollTop() > oTop) {

                var max = -219.99078369140625;
                forEach(document.querySelectorAll('.progress'), function (index, value) {
                    var percent = value.getAttribute('data-progress');
                    value.querySelector('.fill').setAttribute('style', 'stroke-dashoffset: ' + ((100 - percent) / 100) * max);
                    value.querySelector('.value').innerHTML = percent + '%';
                });

                b = 1;
            }
        }
    });

})(jQuery);