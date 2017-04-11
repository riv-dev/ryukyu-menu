/*
 *  jquery-boilerplate - v4.1.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;( function( $, window, document, undefined ) {

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
				offsetTop:'45', //header mobile height
				hamburgerClass:'menu-icon', //global menu open icon
				subHamburgerClass: 'sub-menu-icon', //sub menu open icon
				closeButtonClass: 'close-menu-icon'
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = element;

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {
				var $this = this,
					$menu = $(this.element),
					$settings = this.settings;


				//Create wrap menu
				var $menu_wrap_temp = '<div class="js-menu-wrap"></div>';
				$menu.before($menu_wrap_temp);
				$menu.appendTo($menu.prev());

				//Create hamburger button to mobile
				var $hamburger_temp = '<a href="javascript:void(0)" class="' + $settings.hamburgerClass +' js-menu-hamburger-button">' +
								'<span></span>' +
								'<span></span>' +
								'<span></span>' +
								'</a>';
				var $menu_wrap = $menu.parent();
				$menu_wrap.before($hamburger_temp);

				var $hamburger = $('.js-menu-hamburger-button');
				$hamburger.on('click', function(e) {
					$this.setGlobalNav($menu_wrap, $hamburger, $settings.offsetTop);
				});

				//Create sub button to mobile
				var $sub_button_temp = '<span class="' + $settings.subHamburgerClass +' js-menu-sub-button">' +
								'<span></span>' +
								'<span></span>' +
								'</span>';
				var items = $menu.find('li');
				$(items).each(function () {
					var item = $(this),
                		child = item.find('ul'),
						child_wrap = '<div class="js-menu-sub-wrap"></div>';
					if(child.length){
						child.before(child_wrap);
						child.appendTo(child.prev());
						child.parent().before($sub_button_temp);
					}
				});
				//Add event for sub_menu_button
				var $sub_button = $('.js-menu-sub-button');
				var $sub_wrap = $sub_button.next();
				$sub_button.on('click', function(){
					var $_this = $(this);
					var $wrap = $_this.next();
					var $label = $_this.prev();		//親ラベル
					$wrap.toggleClass('open');

					if($wrap.hasClass('open')){

						var $height = $wrap.children("ul").height();
						$wrap.css({height: $height + "px",'overflow':"hidden"});
						$_this.addClass('on');
						$label.addClass('on');

					} else {
						$wrap.css({height:0,'overflow':"hidden"});
						$_this.removeClass('on');
						$label.removeClass('on');
					}
				});

				//if addCloseButtonMobile
				if($settings.addCloseButtonMobile){
					var $close_temp = '<a href="#" class="'+ $settings.closeButtonClass +' js-menu-close-mobile">' +
									'<span class="icon-close">' +
									'<span></span>' +
									'<span></span>' +
									'</span>' +
									'</a>';

					$menu_wrap.append($close_temp);

					var $close = $('.js-menu-close-mobile');
					$close.on('click', function(e) {
						$this.setGlobalNav($menu_wrap, $hamburger, $settings.offsetTop);
					});
				}

				//Responsive mobile
				$this.responsiveMenu($menu_wrap,$hamburger,$sub_button,$sub_wrap);

				$(window).resize(function(){

					$this.responsiveMenu($menu_wrap,$hamburger,$sub_button,$sub_wrap);
				})
			},
			setGlobalNav($menu, $hamburger, $offsetTop){
				// 状態管理クラスを適用
				$menu.toggleClass('open');

				if($menu.hasClass('open')){
					// オープン
					$hamburger.addClass('on');
					var $window_height = window.innerHeight ? window.innerHeight: $(window).height();
					// 高さをウィンドウズに合わせる
					$menu.css({"height":$window_height - $offsetTop +"px","overflow":"auto"});
					$('body').css({'height':'100%','overflow':'hidden'});

					this.removeIOSRubberEffect(document.querySelector('.js-menu-wrap'));

				}else{
					// クローズ
					$menu.css({"height":0,"overflow":"hidden"});
					$hamburger.removeClass('on');
				}
			},
			removeIOSRubberEffect(el) {
				el.addEventListener('touchstart', function() {
					var top = el.scrollTop
						, totalScroll = el.scrollHeight
						, currentScroll = top + el.offsetHeight

					//If we're at the top or the bottom of the containers
					//scroll, push up or down one pixel.
					//
					//this prevents the scroll from "passing through" to
					//the body.
					if(top === 0) {
						el.scrollTop = 1
					} else if(currentScroll === totalScroll) {
						el.scrollTop = top - 1
					}
				})

				el.addEventListener('touchmove', function(evt) {
					//if the content is actually scrollable, i.e. the content is long enough
					//that scrolling can occur
					if(el.offsetHeight < el.scrollHeight) evt._isScroller = true;
					// else
						else evt._isScroller = false;
				})
				//
				document.body.addEventListener('touchmove', function(evt) {
					//In this case, the default behavior is scrolling the body, which
					//would result in an overflow.  Since we don't want that, we preventDefault.
					if(evt._isScroller === false) {
						evt.preventDefault()
					}
				})
			},
			responsiveMenu($menu,$hamburger,$sub_button,$sub_wrap){
				var $window_width = window.innerWidth ? window.innerWidth: $(window).width();
				if($window_width > 992){
					$($menu).css({"height":'auto',"overflow":"auto"});
					$($hamburger).hide();
					$($sub_button).hide();
					$($sub_wrap).css('height','auto');
				}else{

					$($menu).css({"height":0,"overflow":"hidden"});
					$($hamburger).show();
					$($sub_button).show();
					$($sub_wrap).css({height:0});
				}
			}
		} );

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );
