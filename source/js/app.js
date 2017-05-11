'use strict';
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Forms
// Mail Form
var mailForm = document.querySelector('#mail-form');

if (mailForm) {
    mailForm.addEventListener('submit', prepareSendMail);
}

function prepareSendMail(e) {
    e.preventDefault();
    var form = $(this);
    var popup = $('.l-section__popup');
    var resultContainer = popup.find('.l-section__status');
    var data = {
        username: mailForm.username.value,
        email: mailForm.email.value,
        message: mailForm.message.value
    };
    resultContainer.text('Отправка сообщения...');
    popup.delay(200).fadeIn(1000);
    sendAjaxJson('works', data, function (data) {
        console.log(data);
        resultContainer.text(data);
        popup.fadeOut(1000);
        form[0].reset();
    });
}


function sendAjaxJson(url, data, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (e) {
        var result = JSON.parse(xhr.responseText);
        cb(result.status);
    };
    xhr.send(JSON.stringify(data));
}

function sendGetAjaxJson(url, data, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (e) {
        var result = JSON.parse(xhr.responseText);
        cb(result);
    };
    xhr.send(JSON.stringify(data));
}


// Modules
var parallax = (function () {
    var bg = document.querySelector('.l-parallax__bg'),
        user = document.querySelector('.l-developer__container .c-user'),
        userBg = document.querySelector('.l-developer__container .c-developer__bg');

    return {
        move: function (block, windowScroll, strafeCoefficient) {
            var strafe = -(windowScroll / strafeCoefficient) + '%';
            var style = block.style;
            // Var for rendering by video processor (z-axis)
            var transformString = 'translate3d(0, ' + strafe + ', 0)';
            style.transform = transformString;
            style.webkitTransform = transformString;
        },
        init: function (winScroll) {
            if (user == null) {
                return;
            }
            console.log($(window).innerWidth());
            if ($(window).innerWidth() > 768) {
                this.move(bg, winScroll, 100);
                this.move(user, -winScroll, 9);
                this.move(userBg, -winScroll, 13);
            }
        }
    }
})();


var skills = (function () {
    var skillGroups = null;
    return {
        init: function () {
            skillGroups = $('.c-skills__group');
            console.log(skillGroups);
            if (skillGroups.length === 0) {
                return;
            }
            skillGroups.each(function (i, skillGroup) {
                var skillItems = $(skillGroup).find('.c-skill__circle_outer');
                skillItems.each(function (i, skill) {
                    skill.value = $(skill).attr('stroke-dashoffset');
                    $(skill).attr('stroke-dashoffset', '100');
                });
            });
        },
        grow: function (wScroll) {
            if (skillGroups.length === 0)
                return;
            var windowMargin = window.innerHeight * 0.9;
            skillGroups.each(function (i, skillGroup) {
                var groupOffset = skillGroup.getBoundingClientRect().top;
                console.log('wScroll:' + wScroll);
                console.log('windowMargin:' + windowMargin);
                console.log('groupOffset:' + groupOffset);
                //var startAnimate = wScroll - groupOffset + windowMargin;
                var startAnimate = -groupOffset + windowMargin;
                console.log('startAnimate:' + startAnimate);
                var pixelsElapsed = groupOffset - wScroll;
                var percentsElapsed = 100 - Math.ceil(pixelsElapsed / windowMargin * 100);
                // 100/100 because we have 100 dasharray. It can be different!
                var percentsDrawn = 100 / 100 * percentsElapsed;
                var skillItems = $(skillGroup).find('.c-skill__circle_outer');
                if (startAnimate >= 0) {
                    var drawAmount = 100 - percentsDrawn;
                    skillItems.each(function (i, skill) {
                        var value = 100 - parseInt(skill.value);
                        var skillOpacity = value / 200 + 0.6;
                        if (skillOpacity >= 1) {
                            skillOpacity = 1
                        }
                        skill.setAttribute('stroke-dashoffset', skill.value);
                        $(skill).css('opacity', skillOpacity);
                    });
                } else {
                    skillItems.each(function (i, skill) {
                        skill.setAttribute('stroke-dashoffset', '100');
                    });
                }
            });
        }
    };
})();

// map

var map;
function initMap() {
    if (!document.getElementById('map'))
        return;
    var latLngCenter = {lat: 55.902, lng: 37.7375};
    // if ($(window).width()<600){
    //     latLngCenter = {lat: 55.902, lng: 37.7375};
    // }
    map = new google.maps.Map(document.getElementById('map'), {
        center: latLngCenter,
        zoom: 17,
        draggable: !("ontouchend" in document),
        scrollwheel: false,
        disableDefaultUI: true,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#444444"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.attraction",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.station.rail",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#4369aa"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "hue": "#005eff"
                    }
                ]
            }
        ]
    });
// marker
    var latLngHome = {lat: 55.90085, lng: 37.73885};
    var image = 'assets/img/marker.png';
    var marker = new google.maps.Marker({
        position: latLngHome,
        map: map,
        icon: image
    });
}

// slider initialization

// for slider
var removeActiveClass = (function (reqClass) {
    reqClass.addClass('active').siblings().removeClass('active');
});

var changeDescription = (function (description, index) {
    var sliderTitle = description.find('.c-slider-title'),
        sliderSkills = description.find('.c-slider-item__skills'),
        sliderLink = description.find('.c-slider-btn');
    var data = {}
    sendGetAjaxJson('api/works', data, function (data) {
        // var jsonObject = JSON.parse(data);
        //
        console.log(data);
        var worksArray = $.map(data, function (el) {
            return el
        });
        console.log(worksArray);
        sliderTitle.css('opacity', '0');
        setTimeout(function () {
            sliderTitle.text(worksArray[index].name);
            sliderTitle.css('opacity', '1');
        }, 400);
        sliderSkills.css('opacity', '0');
        setTimeout(function () {
            sliderSkills.text(worksArray[index].technologies);
            sliderSkills.css('opacity', '1');
        }, 400);
        sliderLink.attr('href', (worksArray[index].link));
        console.log(worksArray[index].title);
        console.log(index);
    });
});

$(document).ready(function () {
    console.log('document.ready');
    //slider.init();
    parallax.init();
    skills.init();
    // preloader
    (function () {
        var imgs = [];
        $('*').each(function () {
            var $this = $(this);
            var background = $this.css('background-image');
            var isImg = $this.is('img');
            var path = '';
            if (background !== 'none') {
                path = background.replace('url("', '').replace('")', '');
                if (path.indexOf('-gradient(') !== -1)
                    return;
                imgs.push(path);
            }
            if (isImg) {
                path = $this.attr('src');
                if (!path)
                    return;
                imgs.push(path);
            }
        });
        var percentsTotal = 1;
        for (var i = 0; i < imgs.length; i++) {
            var image = $('<img>', {
                attr: {
                    src: imgs[i]
                }
            });
            image.one({
                load: function () {
                    setPercents(imgs.length, percentsTotal);
                    percentsTotal++;
                },
                error: function () {
                    percentsTotal++;
                }
            });
        }
        function setPercents(total, current) {
            var percent = Math.ceil(current / total * 100);
            if (percent >= 100) {
                $('.preloader').fadeOut();
            }
            $('.preloader__value').text(percent);
        }
    })();


    // flipper&parallax
    (function () {
        var welcomeSection = $('.l-welcome');
        console.log(welcomeSection);
        if (welcomeSection.length == 0) {
            return;
        }
        console.log('in welcome');
        // flipper
        welcomeSection.on('click', '[data-flip="toggle"]', function (e) {
            console.log('clicked');
            e.preventDefault();
            var trigger = welcomeSection.find('.l-welcome__auth-btn')
            var flipper = welcomeSection.find('.l-flipper');
            console.log(flipper);
            var duration = 600;
            flipper.toggleClass('l-flipper_back');
            if (flipper.hasClass('l-flipper_back')) {
                trigger.removeClass('active');
            } else {
                trigger.addClass('active');
            }
        });
        // parallax
        var layerAll = $('.l-parallax__bg');
        var clouds = $('.c-stars-parallax__layer');

        $(window).on('mousemove', function (e) {
            var mouseX = e.pageX;
            var mouseY = e.pageY;
            var w = (window.innerWidth / 2) - mouseX;
            var h = (window.innerHeight / 2) - mouseY;
            layerAll.map(function (i, item) {
                var wPos = w * ((i + 1) / 40);
                var hPos = h * ((i + 1) / 30);
                $(item).css({
                    'transform': 'translate3d(' + wPos + 'px,' + hPos + 'px, 0)'
                });
            });
            clouds.map(function (i, item) {
                var wPos = w * ((i * 9 + 1) / 90);
                var hPos = h * ((i * 4 + 1) / 120);
                $(item).css({
                    'transform': 'translate3d(' + wPos + 'px,' + hPos + 'px, 0)'
                });
            });
        });

    })();


    // slider prev_next buttons
    $('.c-slider__button').on('click', function (e) {
        e.preventDefault();
        var
            $this = $(this),
            slider = $(this).closest('.c-slider'),
            // view vars
            slides = slider.find('.c-slider__slides'),
            items = slider.find('.c-slides__item'),
            activeSlide = items.filter('.active'),
            nextSlide = activeSlide.next(),
            prevSlide = activeSlide.prev(),
            firstSlide = items.first(),
            lastSlide = items.last(),
            // description vars
            description = slider.find('.c-slider__description'),

            // pager vars
            pagerList = slider.find('.c-pager__list'),
            pages = slider.find('.c-pager__item'),
            activePage = pages.filter('.active'),
            nextPage = activePage.next(),
            prevPage = activePage.prev(),
            firstPage = pages.first(),
            lastPage = pages.last()
            ;
        if ($this.hasClass('c-slider__button_next')) {
            if (nextSlide.length) {
                removeActiveClass(nextSlide);
                removeActiveClass(nextPage);
                changeDescription(description, nextSlide.index())
            } else {
                removeActiveClass(firstSlide);
                removeActiveClass(firstPage);
                changeDescription(description, firstSlide.index())
            }

        } else {
            if (prevSlide.length) {
                removeActiveClass(prevSlide);
                removeActiveClass(prevPage);
                changeDescription(description, prevSlide.index())
            } else {
                removeActiveClass(lastSlide);
                removeActiveClass(lastPage);
                changeDescription(description, lastSlide.index())
            }
        }
    });

    // slider pager buttons
    $('.c-pager__item').on('click', function (e) {
        e.preventDefault();
        var
            $this = $(this),
            index = $this.index(),
            slider = $(this).closest('.c-slider'),
            // view vars
            slides = slider.find('.c-slider__slides'),
            items = slider.find('.c-slides__item'),
            slideToShow = items.eq(index),
            // description vars
            description = slider.find('.c-slider__description'),
            sliderTitle = description.find('.c-slider-title'),
            sliderSkills = description.find('.c-slider-item__skills'),
            sliderLink = description.find('.c-slider-btn'),
            // pager vars
            pagerList = slider.find('.c-pager__list'),
            pages = slider.find('.c-pager__item'),
            clickedPage = pages.eq(index)
            ;
        console.log(index);
        if (!$this.hasClass('active')) {
            removeActiveClass(slideToShow);
            removeActiveClass(clickedPage);
            changeDescription(description, slideToShow.index())
        }
    });

    // nav
    (function () {
        $(document).on('click', '.c-menu-icon', function (e) {
            var trigger = $(this);
            var wrapper = trigger.closest('.c-menu-wrapper_main');
            var menu = wrapper.find('.c-menu');
            console.log(wrapper);
            if (wrapper.hasClass('open')) {
                menu.fadeOut(500, function () {
                    wrapper.removeClass('open');
                });
            } else {
                menu.show(0, function () {
                    wrapper.addClass('open');
                });
            }
        });
    })();

    // template

    (function () {
        var container = $('.c-template');
        var sidebar = container.find('.c-template-sidebar');
        if (sidebar.length === 0 || isMobile)
            return;
        //var containerBottom = container.offset().top + container.height() - 40;
        var edgeTop = sidebar.offset().top;
        //var sidebarHeight = sidebar.height();
        console.log($(window).innerWidth);
        if ($(window).innerWidth() > 768) {
            $(window).on('scroll', function () {
                if (edgeTop < $(window).scrollTop()) {
                    sidebar.addClass('c-template-sidebar_fixed');
                } else {
                    sidebar.removeClass('c-template-sidebar_fixed');
                }
            });
        }
    })();

    (function () {
        var articleAll = $('.c-article');
        var linksAll = $('.c-template-sidebar__link');
        if (articleAll.length === 0)
            return;
        showSection(window.location.hash, false);
        function showSection(section, isAnimate) {
            var target = section.replace('#', '');
            var reqSection = articleAll.filter('[data-id="' + target + '"]');
            var duration = 750;
            if (reqSection.length === 0)
                return;
            var reqSectionPos = reqSection.offset().top;
            if (isAnimate) {
                $('body, html').animate({
                    scrollTop: reqSectionPos
                }, duration);
            } else {
                $('body, html').scrollTop(reqSectionPos);
            }
        }

        function checkSection() {
            articleAll.each(function (i, item) {
                var article = $(item);
                var topEdge = article.offset().top - 0.55 * $(window).innerHeight();

                var bottomEdge = topEdge + article.height();
                var topScroll = $(window).scrollTop();
                if (topEdge < topScroll && bottomEdge > topScroll) {
                    var currentId = article.data('id');
                    var reqLink = linksAll.filter('[href="#' + currentId + '"]');
                    reqLink.closest('.c-template-sidebar__item').addClass('active').siblings().removeClass('active');
                    window.location.hash = currentId;
                }
            });
        }

        $(window).on('scroll', function () {
            checkSection();
        });
        $(document).on('click', '.c-template-sidebar__link', function (e) {
            e.preventDefault();
            var sidebar = $(this).closest('.c-template-sidebar');
            if (sidebar.hasClass('active')) sidebar.removeClass('active');
            showSection($(this).attr('href'), true);
        });

        $(document).on('click', '.c-template-sidebar__button', function (e) {
            e.preventDefault();
            var trigger = $(this);
            var sidebar = trigger.closest('.c-template-sidebar');
            sidebar.toggleClass('active');
        });
    })();

    // next/prev sections scroll
    (function () {
        $(document).on('click', '[data-move]', function (e) {
            e.preventDefault();
            var btn = $(this);
            var target = btn.attr('data-move');
            var container = null;

            function scrollToPosition(position, duration) {
                console.log(position);
                var position = position || 0;
                var duration = duration || 1000;
                $("body, html").animate({
                    scrollTop: position
                }, duration);
            }

            if (target == 'top') {
                scrollToPosition();
            }
            if (target == 'next') {
                container = btn.closest('.l-section');
                console.log(container.height());
                scrollToPosition(container.height());
            }
        });
    })();

// ADMIN TABS
    // tabs manager
    $('.c-tabs__item').on('click', function (e) {
        e.preventDefault();
        var
            $this = $(this),
            index = $this.index(),
            adminSection = $(this).closest('.l-admin'),
            //tabs = adminSection.find('.c-tabs__item'),
            contents = adminSection.find('.c-content-panel__item'),
            contentToShow = contents.eq(index)

            ;
        if (!$this.hasClass('active')) {
            $this.addClass('active').siblings().removeClass('active');
            contentToShow.addClass('active').siblings().removeClass('active');
        }
    });
    // Upload trigger
    $('#uploadfile').on('click', function (e) {
        e.preventDefault();
        $("#file").trigger('click');
    });


    function fileUpload(url, data, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onload = function (e) {
            var result = JSON.parse(xhr.responseText);
            cb(result.status);
        };
        xhr.send(data);
    }

    // Upload work
    const worksForm = $('#admin-works');

    if (worksForm) {
        worksForm.on('submit', prepareSendFile);
    }

    function prepareSendFile(e) {
        e.preventDefault();
        var form = $(this);
        var popup = $('.l-admin__popup');
        var resultContainer = popup.find('.l-admin__status');
        var formData = new FormData();
        var file = $('#file').get(0).files[0];
        var name = $('#name').val();
        var technologies = $('#technologies').val();
        var link = $('#link').val();
        formData.append('image', file, file.name);
        formData.append('name', name);
        formData.append('technologies', technologies);
        formData.append('link', link);
        console.log(resultContainer);
        resultContainer.text('Uploading...');
        popup.delay(200).fadeIn(1000);
        fileUpload('/admin/works', formData, function (data) {
            console.log(data);
            resultContainer.text(data);
            popup.fadeOut(1000);
            form[0].reset();
        });
    }

    // Blog Form
    var blogForm = document.querySelector('#admin-template');

    if (blogForm) {
        blogForm.addEventListener('submit', prepareSendPost);
    }

    function prepareSendPost(e) {
        e.preventDefault();
        var form = $(this);
        var popup = $('.l-admin__popup');
        var resultContainer = popup.find('.l-admin__status');
        var data = {
            title: blogForm.title.value,
            date: blogForm.date.value,
            content: blogForm.content.value
        };
        resultContainer.text('Saving data...');
        popup.delay(200).fadeIn(1000);
        sendAjaxJson('/admin/template', data, function (data) {
            console.log(data);
            resultContainer.text(data);
            popup.fadeOut(1000);
            form[0].reset();
        });
    }

    // Skills form

    var skillsForm = document.querySelector('#admin-skills');

    if (skillsForm) {
        skillsForm.addEventListener('submit', prepareSendSkills);
    }

    function prepareSendSkills(e) {
        e.preventDefault();
        var popup = $('.l-admin__popup');
        var resultContainer = popup.find('.l-admin__status');
        var skills = $('.c-admin-skills');
        var skillGroups = skills.find('.c-admin-skills__group');
        var data = {};

        skillGroups.each(function () {

            var skillGroup = $(this);
            var groupTitle = skillGroup.find('.c-admin-group__title').text();
            var items = skillGroup.find('.c-admin-skill');
            var itemObj = {};

            items.each(function () {
                var item = $(this);
                var skillName = item.find('.c-admin-skill__title').text();
                var skillValue = item.find('.c-admin-form__input_skills').val();

                itemObj[skillName] = skillValue;
            });
            data[groupTitle] = itemObj;

        });

        resultContainer.text('Saving data...');
        popup.delay(200).fadeIn(1000);
        console.log(data);
        sendAjaxJson('/admin/about', data, function (data) {
            console.log(data);
            resultContainer.text(data);
            popup.fadeOut(1000);
        });
    }

    // Auth form

    // Checkbox
    var checkbox = document.querySelector('.c-checkbox__input');

    if (checkbox) {
        checkbox.addEventListener('change', function () {
            $(this).removeClass('field_error').removeClass('field_ok');
        });
    }

    var authForm = document.querySelector('#auth-form');

    // ВРЕМЕННО УДАЛЕНО!

    // if (authForm) {
    //     authForm.addEventListener('submit', prepareSendAuth);
    // }

    function prepareSendAuth(e) {
        e.preventDefault();
        var popup = $('.l-section__popup');
        var resultContainer = popup.find('.l-section__status');
        var form = $(this);
        var validationInfo = validateAuth(form);
        if (!validationInfo.isValidated) {
            console.log(validationInfo.errors);
            popup.delay(200).fadeIn(1000);
            $(validationInfo.errors).each(function (i, err) {
                console.log(err);
                resultContainer.text(err);
            });
            popup.fadeOut(1000);
            return;
        }
        var data = {
            username: authForm.username.value,
            password: authForm.password.value,
        };
        resultContainer.text('Проверка данных...');
        popup.delay(200).fadeIn(1000);

        sendAjaxJson('/admin', data, function (data) {
            console.log(data);
            resultContainer.text(data);
            popup.fadeOut(1000);
            console.log(data.redirect);
            if (data == 'Авторизация успешна!')
                window.location = '/admin';
        });
    }

    function validateAuth(form) {
        var inputs = form.find('[required]');
        var isValidated = true;
        var errors = [];
        var flag1 = false;
        var flag2 = false;
        inputs.removeClass('field--error');
        inputs.each(function (i, item) {
            var input = $(item);
            var value = input.val();
            var type = input.attr('type');
            if (type == 'checkbox') {
                if (!input.is(':checked')) {

                    input.addClass('field_error');
                    isValidated = false;
                    if (!flag1)
                        errors.push('Вы точно не робот?');
                    flag1 = true;
                }
            } else if (value.trim() == '') {
                input.addClass('field_error');
                isValidated = false;
                if (!flag2)
                    errors.push('Вы забыли ввести данные');
                flag2 = true;
            } else {
                input.removeClass('field_error').addClass('field_ok');
            }

        });
        return {
            "isValidated": isValidated,
            "errors": errors
        };
    }


});

// Events
$(window).on('load', function () {
    $('body').addClass('loaded');
});

window.onscroll = function () {
    var winScroll = window.pageYOffset;
    parallax.init(winScroll);
    //if (winScroll > innerHeight / 1.8) {
    skills.grow(winScroll);
    //}
};

$(document).on('focus', '.c-form__input', function (e) {
    $(this).removeClass('field_error').removeClass('field_ok');
});

$(document).on('reset', '.c-form', function (e) {
    $(this).find('.c-form__input').removeClass('field_error').removeClass('field_ok');
});