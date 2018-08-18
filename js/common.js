"use strict";

$(document).ready(function() {

    // better hover for mobile devices
    if (Modernizr.touch) {
        // run the forEach on each figure element
        [].slice.call(document.querySelectorAll('a, button')).forEach(function(el, i) {
            // check if the user moves a finger
            var fingerMove = false;
            el.addEventListener('touchmove', function(e) {
                e.stopPropagation();
                fingerMove = true;
            });
            // always reset fingerMove to false on touch start
            el.addEventListener('touchstart', function(e) {
                e.stopPropagation();
                fingerMove = false;
            });
        });
    };

    var animationDuration = 1200; // set animation durations (for circles and bars) in milliseconds
    var portfolioGrid = '#portfolio-masonry-grid'; // portfolio masonry grid selector
    var blogGrid = '#blog-masonry-grid';

    // circle skills function
    function circleInit(element) {
        var getPercent = $(element).data('progress-percent');
        $(element).circleProgress({
            value: getPercent / 100,
            size: 126,
            startAngle: Math.PI * 1.5,
            animation: {
                duration: animationDuration,
            },
            fill: {
                color: themecolor
            }
        }).on('circle-animation-progress', function(event, progress) {
            $(this).find('strong').html(parseInt(getPercent * progress) + '<i>%</i>');
        });
    };

    // progressbars function
    function moveProgressBar(element) {
        var elemPure = element;
        var elem = element + ' .skillbar-wrapper .skillbar-container';
        var getPercent = ($(elem).data('progress-percent') / 100);
        var getProgressWrapWidth = $(elem).width();
        var progressTotal = getPercent * getProgressWrapWidth;
        // on page load, animate percentage bar to data percentage length
        // .stop() used to prevent animation queueing
        $(elem + ' .bar-skill').stop().animate({
            left: progressTotal,
            percent: getPercent * 100
        }, {
            duration: animationDuration,
            progress: function(now, fx) {

                $(elemPure + ' .skillbar-exp').html(parseInt(this.percent) + '<i>%</i>');
            },
            complete: function() {
                //do not forget to reset percent at the end of the animaton
                //so on the next animation it can be calculated from starting value of 0 again
                this.percent = 0;
            }
        });
    };

    function onScrollInit( items, trigger ) {
      items.each( function() {
        var osElement = $(this),
            osAnimationClass = osElement.attr('data-os-animation'),
            osAnimationDelay = osElement.attr('data-os-animation-delay');
     
        osElement.css({
            '-webkit-animation-delay':  osAnimationDelay,
            '-moz-animation-delay':     osAnimationDelay,
            'animation-delay':          osAnimationDelay
        });
     
        var osTrigger = ( trigger ) ? trigger : osElement;
     
        osTrigger.waypoint(function() {
            osElement.addClass('animated').addClass(osAnimationClass);
        },{
            triggerOnce: true,
            offset: '90%'
        });
      });
    }    

    // scroll to top plugin init
    scrollToTop({
        linkName: '#sstt',
        hiddenDistance: '700'
    });

    // smooth in-page anchor scrolling
    $('#section-intro .btn-cta, .top-menu li > a').smoothScroll({
        offset: -20
    });

    // responsive off-canvas menu handling
    $('#menu-toggle').on('touchstart click', function(e) {
        $('#page-wrapper').toggleClass('toggled');
        $('#sstt').removeClass('is-visible').addClass('is-hidden');
        return false;
    });

    // close the menu when link or page overlay is clicked
    $('.top-menu li:not(.has-child-menu) > a, #page-content-overlay').on('click', function(e) {
        //e.preventDefault();
        $('#page-wrapper').removeClass('toggled');
    });

    // handle child menus
    $('.top-menu li.has-child-menu .menu-next-btn').on('click', function(e) {
        e.preventDefault();
        $(this).parent().toggleClass('menu-expanded');
        $(this).css('display', 'none');
        $(this).parent().find('.menu-prev-btn').css('display', 'inline-block');
        return false;
    });
    $('.top-menu li.has-child-menu .menu-prev-btn').on('click', function(e) {
        e.preventDefault();
        $(this).parent().toggleClass('menu-expanded');
        $(this).css('display', 'none');
        $(this).parent().find('.menu-next-btn').css('display', 'inline-block');
        return false;
    });

    // init masonry & magnific popup only when all images are loaded (or confirmed broken)
    $(portfolioGrid).imagesLoaded().always(function(instance) {
        $(portfolioGrid).masonry({ // masonry init
            columnWidth: '.portfolio-grid-sizer',
            itemSelector: '.portfolio-item',
            percentPosition: true
        }).magnificPopup({ // magnific popup gallery init
            delegate: 'a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-fade',
            removalDelay: 300,
            overflowY: 'scroll',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1]
            },
            image: {
                cursor: null,
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function(item) {
                    return item.el.attr('title') + '<small>by Stelan Briyan Simonsz</small>';
                }
            }
        });
    });

    // blog grid masonry init
    $(blogGrid).imagesLoaded().always(function(instance) {
        $(blogGrid).masonry({ // masonry init
            columnWidth: '.blog-grid-sizer',
            itemSelector: '.blog-post-preview',
            percentPosition: false,
        })        
    });

    // waypoints triggering for bars
    $('.block-skillbars').waypoint(function() {
        moveProgressBar('#skillbar1');
        moveProgressBar('#skillbar2');
        this.destroy();
    }, {
        offset: '90%',
        triggerOnce: true
    });

    // waypoints triggering for circle bars
    $('.block-circles-skills').waypoint(function() {
        circleInit('#circle1');
        circleInit('#circle2');
        circleInit('#circle3');
        this.destroy();
    }, {
        offset: '90%',
        triggerOnce: true
    });

    // progress button init
    [].slice.call(document.querySelectorAll('button.progress-button')).forEach(function(bttn) {
        new ProgressButton(bttn, {
            callback: function(instance) {
                var progress = 0,
                interval = setInterval(function() {
                    progress = Math.min(progress + Math.random() * 0.25, 1);
                    instance._setProgress(progress);

                    if (progress === 1) {
                        instance._stop(1);
                        clearInterval(interval);
                    }
                }, 200);
            }
        });
    });

    // contact form. Documentation: http://api.jquery.com/jquery.ajax/
    $('#contact-form-btn').on('click', function(e) {
        $.ajax({
            type: 'POST',
            url: 'mail.php',
            data: $('#contact-form').serialize()
        }).done(function() {
            setTimeout(function() {
                $('#contact-form-btn').removeClass('state-loading').addClass('state-success');
                $('#contact-form').trigger('reset');
                alert('Thanks for your message! I will reply you as soon as possible.');
            }, 1500);
        }).fail(function() {
            setTimeout(function() {
                $('#contact-form-btn').addClass('state-error').removeClass('state-success');
                alert('Something went wrong :( Please contact me directly to my email.');
            }, 1500);
        });
    });

    // video bg init
    $('#bgndVideo').YTPlayer({
        videoURL: 'https://www.youtube.com/watch?v=KgMVSldVlTE',
        containment: '#section-intro',
        autoPlay: true,
        mute: true,
        startAt: 0,
        opacity: 1,
        showControls: false
    });

    // on scroll animations
    onScrollInit($('.os-animation'));
});