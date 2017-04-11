/*
 *  jquery-ryukyu - v1.0.0
 *  jQuery plugins development.
 *  https://ryukyu-i.vn/
 *
 *  Made by Ryukyu Interactive VietNam
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.

(function($, window, document, undefined) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "ryukyumenu",
        defaults = {
            addCloseButtonMobile: true,
            offsetTop: "45", //header mobile height
            hamburgerClass: "menu-icon", //global menu open icon
            subHamburgerClass: "sub-menu-icon", //sub menu open icon
            closeButtonClass: "close-menu-icon"
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function() {
            var $this = this,
                $menu = $(this.element),
                $settings = this.settings;

            //Create wrap menu
            var $menuWrapTemp = "<div class=\"js-menu-wrap\"></div>";
            $menu.before($menuWrapTemp);
            $menu.appendTo($menu.prev());

            //Create hamburger button to mobile
            var $hamburgerTemp =
                "<a href=\"javascript:void(0)\" class=\"" +
                $settings.hamburgerClass +
                " js-menu-hamburger-button\">" +
                "<span></span>" +
                "<span></span>" +
                "<span></span>" +
                "</a>";
            var $menuWrap = $menu.parent();
            $menuWrap.before($hamburgerTemp);

            var $hamburger = $(".js-menu-hamburger-button");
            $hamburger.on("click", function() {
                $this.setGlobalNav($menuWrap, $hamburger, $settings.offsetTop);
            });

            //Create sub button to mobile
            var $subButtonTemp =
                "<span class=\"" +
                $settings.subHamburgerClass +
                " js-menu-sub-button\">" +
                "<span></span>" +
                "<span></span>" +
                "</span>";
            var items = $menu.find("li");
            $(items).each(function() {
                var item = $(this),
                    child = item.find("ul"),
                    childWrap = "<div class=\"js-menu-sub-wrap\"></div>";
                if (child.length) {
                    child.before(childWrap);
                    child.appendTo(child.prev());
                    child.parent().before($subButtonTemp);
                }
            });

            //Add event for sub_menu_button
            var $subButton = $(".js-menu-sub-button");
            var $subWrap = $subButton.next();
            $subButton.on("click", function() {
                var $this = $(this);
                var $wrap = $this.next();
                var $label = $this.prev(); //親ラベル
                $wrap.toggleClass("open");

                if ($wrap.hasClass("open")) {

                    var $height = $wrap.children("ul").height();
                    $wrap.css({ height: $height + "px", "overflow": "hidden" });
                    $this.addClass("on");
                    $label.addClass("on");

                } else {
                    $wrap.css({ height: 0, "overflow": "hidden" });
                    $this.removeClass("on");
                    $label.removeClass("on");
                }
            });

            //if addCloseButtonMobile
            if ($settings.addCloseButtonMobile) {
                var $closeTemp =
                    "<a href=\"#\" class=\"" +
                    $settings.closeButtonClass +
                    " js-menu-close-mobile\">" +
                    "<span class=\"icon-close\">" +
                    "<span></span>" +
                    "<span></span>" +
                    "</span>" +
                    "</a>";

                $menuWrap.append($closeTemp);

                var $close = $(".js-menu-close-mobile");
                var $windowWidth = window.innerWidth ?
                    window.innerWidth : $(window).width();
                if ($windowWidth < 992) {
                    $close.show();
                } else {
                    $close.hide();
                }
                $(window).on("ready resize", function() {
                    $windowWidth = window.innerWidth ?
                        window.innerWidth : $(window).width();
                    if ($windowWidth < 992) {
                        $close.show();
                    } else {
                        $close.hide();
                    }
                });
                $(window).resize(function() {
                    $this.responsiveMenu($menuWrap, $hamburger, $subButton, $subWrap);
                });
                $close.on("click", function() {
                    $this.setGlobalNav($menuWrap, $hamburger, $settings.offsetTop);
                });

            }

            //Responsive mobile
            $this.responsiveMenu($menuWrap, $hamburger, $subButton, $subWrap);
            $(window).resize(function() {
                $this.responsiveMenu($menuWrap, $hamburger, $subButton, $subWrap);
            });
        },
        setGlobalNav: function($menu, $hamburger, $offsetTop) {

            // 状態管理クラスを適用
            $menu.toggleClass("open");
            if ($menu.hasClass("open")) {

                // オープン
                $hamburger.addClass("on");
                var $windowHeight = window.innerHeight ?
                    window.innerHeight : $(window).height();

                // 高さをウィンドウズに合わせる
                $menu.css({
                    "height": $windowHeight - $offsetTop + "px",
                    "overflow": "auto"
                });
                $("body").css({ "height": "100%", "overflow": "hidden" });

                this.removeIOSRubberEffect(document.querySelector(".js-menu-wrap"));

            } else {

                // クローズ
                $menu.css({ "height": 0, "overflow": "hidden" });
                $hamburger.removeClass("on");
            }
        },
        removeIOSRubberEffect: function(el) {
            el.addEventListener("touchstart", function() {
                var top = el.scrollTop,
                    totalScroll = el.scrollHeight,
                    currentScroll = top + el.offsetHeight;

                //If we're at the top or the bottom of the containers
                //scroll, push up or down one pixel.
                //
                //this prevents the scroll from "passing through" to
                //the body.
                if (top === 0) {
                    el.scrollTop = 1;
                } else if (currentScroll === totalScroll) {
                    el.scrollTop = top - 1;
                }
            });

            el.addEventListener("touchmove", function(evt) {

                //if the content is actually scrollable, i.e. the content is long enough
                //that scrolling can occur
                if (el.offsetHeight < el.scrollHeight) {
                    evt._isScroller = true;
                } else {
                    evt._isScroller = false;
                }
            });
            document.body.addEventListener("touchmove", function(evt) {

                //In this case, the default behavior is scrolling the body, which
                //would result in an overflow.  Since we don't want that, we preventDefault.
                if (evt._isScroller === false) {
                    evt.preventDefault();
                }
            });
        },
        responsiveMenu: function($menu, $hamburger, $subButton, $subWrap) {
            var $windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
            if ($windowWidth > 992) {
                $($menu).css({ "height": "auto", "overflow": "auto" });
                $($hamburger).hide();
                $($subButton).hide();
                $($subWrap).css("height", "auto");
            } else {
                $($menu).css({ "height": 0, "overflow": "hidden" });
                $($hamburger).show();
                $($subButton).show();
                $($subWrap).css({ height: 0, "overflow": "hidden" });
            }
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);