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
        }
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
                    "counters": true,
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
        curIndex: 0,
        timer: null,

        getBackgroundStyle: function(string){
            return "background: url('" + string + "') left 20px no-repeat, url('" + string + "') right 20px no-repeat;";
        },

        setImage: function(newIndex){
            var newSlide = this.data[newIndex];
            this.el.stage.style = this.getBackgroundStyle(newSlide.image);
            this.el.slide.style = "background-image: url('" + newSlide.image + "')";
            this.el.content.innerHTML = newSlide.content;
            var anchor = document.createElement('A');
            anchor.href = newSlide.href;
            anchor.innerHTML = newSlide.link;
            this.el.content.appendChild(anchor);
            this.curIndex = newIndex;
        },

        attachActions: function(carousel){
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
            }           
            carousel.el.stage.onmouseleave = function(){
                carousel.el.stage.classList.remove('hovering');
            }           
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
                var slide = {
                    image: elment.getAttribute('data-image'),
                    href: elment.getAttribute('data-href'),
                    link: elment.getAttribute('data-link-text'),
                    content: elment.innerHTML
                };
                carousel.data.push(slide);
            });
        },

        init: function(options){
            if(this.el.stage){                
                this.fetchData(this);
                this.attachActions(this);

                if(options.auto){
                    this.autoStart(this, options.delay);
                }
            }
        }
    };

    
    // init calls
    main.carousel.init({ 
        auto: true, 
        delay: 7 
    });

    main.navigation.init();

    // resize
    window.onresize = function() {
        var newWidth = window.innerWidth,
            oldWidth = props.screenWidth;

        if (oldWidth !== newWidth) {
            props.screenWidth = newWidth;
            main.navigation.resize();
        }
    };
});
