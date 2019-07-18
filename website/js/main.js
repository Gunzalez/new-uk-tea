DomReady.ready(function() {
    'use strict';

    var main = {};

    var props = {
        screenWidth: window.innerWidth
    };

    var utils = {
        show: function(el) {
            el.classList.add("enter");
            var timer = setTimeout(function() {
                el.classList.add("active");
                el.classList.remove("enter");
                clearTimeout(timer);
            }, 250);
        },

        hide: function(el) {
            el.classList.add("leave");
            var timer = setTimeout(function() {
                el.classList.remove("active", "leave");
                clearTimeout(timer);
            }, 250);
        },

        isValidEmail: function(value) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value);
        },

        isEmptyOrNull: function(value) {
            return value.trim().length < 1;
        },

        reportError: function(field) {
            field.parentNode.classList.add("error");
        },

        preLoad: function(Images, Callback){

            // Keep the count of the verified images
            var allLoaded = 0;

            // The object that will be returned in the callback
            var _log = {
                success: [],
                error: []
            };

            // Executed every time an img is successfully or wrong loaded
            var verifier = function(){
                allLoaded++;

                // triggers the end callback when all images has been tested
                if(allLoaded === Images.length){
                    Callback.call(undefined, _log);
                }
            };

            for (var index = 0; index < Images.length; index++) {

                // Prevent that index has the same value by wrapping it inside an anonymous fn
                (function(i){
                    // Image path provided in the array e.g image.png
                    var imgSource = Images[i],
                        img = new Image();

                    img.addEventListener("load", function(){
                        _log.success.push(imgSource);
                        verifier();
                    }, false);

                    img.addEventListener("error", function(){
                        _log.error.push(imgSource);
                        verifier();
                    }, false);

                    img.src = imgSource;
                })(index);
            }
        },
    };

    main.contact = {
        el: document.getElementById("contact-form"),

        props: {
            error: false
        },

        validate: function(field) {
            if (field.type === "checkbox") {
                if (!field.checked) {
                    this.props.error = true;
                    utils.reportError(field.parentNode);
                }
            } else if (field.type === "email") {
                if (!utils.isValidEmail(field.value)) {
                    this.props.error = true;
                    utils.reportError(field);
                }
            } else {
                if (utils.isEmptyOrNull(field.value)) {
                    this.props.error = true;
                    utils.reportError(field);
                }
            }
        },

        init: function() {
            if (this.el) {
                this.el.addEventListener("submit", function(event) {
                    main.contact.props.error = false;
                    var errorFields = document.querySelectorAll(".error");
                    for (var e = 0; e < errorFields.length; e++) {
                        errorFields[e].classList.remove("error");
                    }

                    var requiredFields = document.querySelectorAll("[required]");
                    for (var r = 0; r < requiredFields.length; r++) {
                        main.contact.validate(requiredFields[r]);
                    }

                    if (main.contact.props.error) {
                        event.preventDefault();
                    }
                });
            }
        }
    };

    main.navigation = {

        init: function(){
            var menu = new Mmenu( "#nav-main", {
                    "extensions": [
                       "position-right",
                    //    "shadow-page",
                       "theme-dark"
                    ],
                    // "counters": true,
                    "navbars": [
                        {
                           "position": "bottom",
                           "content": [
                              "<a class='fab fa-facebook-f' href='#/'></a>",
                              "<a class='fab fa-twitter' href='#/'></a>",
                              "<a class='fab fa-instagram' href='#/'></a>"
                           ]
                        }
                     ]
                });

            var api = menu.API;

            document.querySelector( "#open-nav")
                .addEventListener(
                    "click", function(evnt){
                        evnt.preventDefault();
                        api.open();
                });

            this.footerInit();
        },

        footerInit: function(){
            document.querySelector( "#nav-footer-trigger")
                .addEventListener(
                    "click", function(evnt){
                        evnt.preventDefault();
                        var $list = document.querySelector('#nav-footer');
                        if($list.classList.contains('mm-wrapper_opened')){
                            $list.classList.remove('mm-wrapper_opened');
                        } else {
                            $list.classList.add('mm-wrapper_opened');
                        }
                        
                });
        },

        resize: function(){

        }
    };

    main.carousel = {
        el: {
            stage: document.querySelectorAll('#carousel-main .stage')[0],
            slide: document.querySelectorAll('#carousel-main .slide')[0],
            content: document.querySelectorAll('#carousel-main .content')[0],
            controls: document.querySelectorAll('#carousel-main .controls')
        },

        data: [],
        imgsToPreload: [],
        curIndex: 0,
        timer: null,

        getBackgroundStyle: function(string){
            return "background: url('" + string + "') left 15px no-repeat, url('" + string + "') right 15px no-repeat;";
        },

        setImage: function(newIndex) {
            var newSlide = this.data[newIndex];
            this.el.stage.style = this.getBackgroundStyle(newSlide.image);
            this.el.slide.style = "background-image: url('" + newSlide.image + "')";
            this.el.content.innerHTML = newSlide.content;
            var anchor = document.createElement('A');
            anchor.href = newSlide.href;
            anchor.innerHTML = newSlide.link;
            anchor.classList.add('big-link');
            this.el.content.appendChild(anchor);
            this.curIndex = newIndex;
        },

        attachActions: function(carousel) {

            carousel.el.controls.forEach(function(control){
                control.onclick = function(event){
                    event.preventDefault();
                    if(event.target.parentNode.nodeName === 'A'){
                        var newIndex;
                        if(event.target.parentNode.classList.contains('prev')){ 
                            newIndex = carousel.curIndex - 1;
                            if(newIndex < 0){
                                newIndex = carousel.data.length - 1;
                            }
                        }
                        if(event.target.parentNode.classList.contains('next')){
                            newIndex = carousel.curIndex + 1;
                            if(newIndex > carousel.data.length - 1){
                                newIndex = 0;
                            }                           
                        }
                        carousel.setImage(newIndex);
                        event.target.blur();
                    }
                    if(carousel.timer){
                        clearInterval(carousel.timer);
                    }
                };
            });
        },

        autoStart: function(carousel, delay) {

            carousel.el.stage.onmouseenter = function(){
                carousel.el.stage.classList.add('hovering');
            };         

            carousel.el.stage.onmouseleave = function(){
                carousel.el.stage.classList.remove('hovering');
            };          
            
            this.timer = setInterval(function(){
                if(!carousel.el.stage.classList.contains('hovering')){
                    var newIndex = carousel.curIndex + 1;
                    if(newIndex > carousel.data.length - 1){
                        newIndex = 0;
                    }                    
                    carousel.setImage(newIndex);
                }
            }, delay * 1000);
        },

        fetchData: function(carousel){                   
            carousel.el.stage.parentNode.querySelectorAll('.item').forEach(function(elment){
                carousel.data.push({
                    image: elment.getAttribute('data-image'),
                    href: elment.getAttribute('data-href'),
                    link: elment.getAttribute('data-link-text'),
                    content: elment.innerHTML
                });
                carousel.imgsToPreload.push(elment.getAttribute('data-image'));
            });

            utils.preLoad(carousel.imgsToPreload, function(){
                carousel.el.controls.forEach(function(el){
                    el.classList.remove('display-none');
                });
            });
        },

        init: function(options){
            if(this.el.stage){                
                this.fetchData(this);
                this.attachActions(this);

                if(options.auto){
                    var carousel = this;
                    utils.preLoad(carousel.imgsToPreload, function(){
                        carousel.autoStart(carousel, options.delay);
                    });
                }
            }
        }
    };

    main.sections = {
        
        el: {
            sections: []
        },

        setUpLinks: function(){
            this.el.sections.forEach(function(section){
                const $trigger = section.querySelectorAll('.trigger')[0];
                $trigger.onclick = function(evnt){
                    evnt.preventDefault();
                    var $parent = evnt.target.parentNode;
                    if($parent.classList.contains('open')){
                        $parent.classList.remove('open');
                    } else {
                        $parent.classList.add('open');
                    }
                }
            })
        },

        init: function(options) {
            var that = this;
            options.classNames.forEach(function(className){
                document.querySelectorAll(className).forEach(function(item){
                    that.el.sections.push(item);    
                });
            })
            if(this.el.sections.length){
                this.setUpLinks()
            }
        }
    };

    main.slider = {

        slider: null,

        highLightCurrentSlide: function(slider){
            var $parent = slider.selector.parentNode;
            $parent.querySelectorAll('.dots span').forEach(function($dot){
                $dot.classList.remove('active');
            });
            $parent.querySelectorAll('.dots span')[slider.currentSlide].classList.add('active');
        },

        addPagination: function(slider){
            var $parent = slider.selector.parentNode;
            var slides = slider.innerElements.length;
            var curIndex = slider.currentSlide;
            var $pagination = document.createElement('DIV');
            for(var s=0; s<slides; s++){
                var $dot = document.createElement('SPAN');
                if(s === curIndex){
                    $dot.classList.add('active');
                }
                $pagination.appendChild($dot);
            }
            $pagination.classList.add('dots');
            $parent.appendChild($pagination);
        },

        attachActions: function(slider){
            var $parent = slider.selector.parentNode;
            $parent.querySelectorAll('.controls').forEach(function($control){
                $control.addEventListener('click', function(event){
                    event.preventDefault();
                    if(event.target.parentNode.classList.contains('prev')){
                        slider.prev();
                    }
                    if(event.target.parentNode.classList.contains('next')){
                        slider.next();
                    }
                });
            });
        },

        init: function(options){

            var slider = document.querySelectorAll(options.selector);
            if(slider.length){                    
                this.slider = new Siema({
                    selector: '.stage-mini',
                    duration: 200,
                    easing: 'ease-out',
                    perPage: 1,
                    startIndex: 0,
                    draggable: true,
                    multipleDrag: true,
                    threshold: 20,
                    loop: true,
                    rtl: false,
                    onInit: function(){
                        main.slider.attachActions(this);
                        main.slider.addPagination(this);
                    },
                    onChange: function(){
                        main.slider.highLightCurrentSlide(this);
                    }
                });
            }                    
        }
    };

    main.lightbox = {
        init: function(){
            new SimpleLightbox({elements: '.hotel-photos a'});
        }
    };
  
    // init calls
    main.carousel.init({ 
        auto: true, 
        delay: 7 
    });

    main.slider.init({
        selector: '.stage-mini'
    });

    main.navigation.init();

    main.sections.init({
        classNames: ['.sub-section', '.sub-sub-section']
    });

    main.lightbox.init();

    // resize calls
    window.onresize = function() {
        var newWidth = window.innerWidth,
            oldWidth = props.screenWidth;

        if (oldWidth !== newWidth) {
            props.screenWidth = newWidth;
            main.navigation.resize();
        }
    };
});
