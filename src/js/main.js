DomReady.ready(function() {
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
        el: document.querySelector("#page-navigation"),

        init: function() {
            var trigger = document.querySelector("#trigger"),
                closeBtn = document.querySelector("#close");

            if (trigger) {
                trigger.addEventListener("click", function(e) {
                    e.preventDefault();
                    main.navigation.show();
                });
            }

            if (closeBtn) {
                closeBtn.addEventListener("click", function(e) {
                    e.preventDefault();
                    main.navigation.hide();
                });
            }
        },

        show: function() {
            if (main.navigation.el) {
                var screenWidth = window.innerWidth,
                    pageWith = document.querySelectorAll(".page")[0].offsetWidth;

                var rightMargin = (screenWidth - pageWith) / 2 - 7;
                rightMargin = rightMargin > 0 ? rightMargin : 0;

                main.navigation.el.style.marginRight = rightMargin + "px";

                main.navigation.el.classList.add("show");
                setTimeout(function() {
                    main.navigation.el.classList.add("on");
                }, 0);
            }
        },

        hide: function() {
            if (main.navigation.el) {
                main.navigation.el.classList.remove("on");
                setTimeout(function() {
                    main.navigation.el.classList.remove("show");
                }, 250);
            }
        },

        resize: function() {
            if (
                main.navigation.el &&
                main.navigation.el.classList.contains("show")
            ) {
                main.navigation.hide();
            }
        }
    };

    

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
