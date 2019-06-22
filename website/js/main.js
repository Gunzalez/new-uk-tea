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

    

    // init calls

    main.navigation.init();




    window.onresize = function() {
        var newWidth = window.innerWidth,
            oldWidth = props.screenWidth;

        if (oldWidth !== newWidth) {
            props.screenWidth = newWidth;
            main.navigation.resize();
        }
    };
});
