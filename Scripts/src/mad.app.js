/*
 * @author:indifer
 * @email:indifer@126.com
 * @version 0.0.1(2014/06/23 00:56)
 */

(function (global) {


	//#region app页面跳转历史

	//app页面历史
	function AppHistory() {

		this._values = [];
		return this;
	}

	//
	AppHistory.prototype.clear = function () {
		this._values = [];
	}


	//总数
	AppHistory.prototype.count = function () {
		return this._values.length;
	}

	//
	AppHistory.prototype.last = function () {
		if (this._values.length > 0) {
			return this._values[this._values.length - 1];
		}
		return null;
	}

	AppHistory.prototype.pop = function (count) {

		var result = [];
		count = count || 1;
		while (count > 0) {

			if (this._values.length > 0) {
				result.push(this._values.pop());
			}
			count--;
		}
		return result;
	}

	//添加
	AppHistory.prototype.add = function (val) {
		if (mad.util.isNullOrEmpty(val)) return false;
		val = val.toString().toLowerCase().trim();

		if (this._values.length == 0 || this._values[this._values.length - 1] != val) {
			this._values.push(val);
			return true;
		}
		return false;
	}

	//更新
	AppHistory.prototype.update = function (val, index) {
	    if (mad.util.isNullOrEmpty(val) || index < 0) return false;
		val = val.toString().toLowerCase().trim();

		if (this._values.length > index) {
			this._values[index] = val;
			return true;
		}
		return false;
	}

	//
	AppHistory.prototype.item = function (index) {

		if (index < 0 || index > this._values.length - 1) return null;
		return this._values[index];
	}

	AppHistory.prototype.backTo = function (name) {

	    if (mad.util.isNullOrEmpty(name)) return;

		var count = this.count();
		if (count > 1) {

			for (var i = count - 1; i >= 0; i--) {

				if (this.item(i).indexOf(name.toLowerCase()) > -1) {
					this.pop(count - i);
					return true;
				}
			}
		}

		return false
	}

	mad.constructor.prototype.history = new AppHistory();

	//#endregion

	mad.constructor.prototype.app = {
		views: {},
		transitionsFlag: 0,

		transitions: function (transition, show, hide, speed, transitionsCallback) {

			var browserVariables = mad.browserVariables;

			show = "#" + show;
			hide = "#" + hide;
			var w = $(window).width();
			var h = $(window).height();
			speed = speed || 300;
			s = speed / 1000.0 + "s";
			var translate3d;
			var easing = "ease-out";

			switch (transition) {
				case "slideLeft":
				case "slideRight":

					var option = {};
					for (var i in browserVariables.cssPrefixes) {
						var transform = browserVariables.cssPrefixes[i] + "transform";
						var transition_duration = browserVariables.cssPrefixes[i] + "transition-duration";
						option[transform] = "none";
						option[transition_duration] = "0s";
					}

					$(hide).css(option);
					$(show).css(option);

					$(hide).css({
						"top": 0,
						"left": 0,
						"width": w,
						"height": h,
						"opacity": 1
					});

					$(show).css({
						"display": "block",
						"top": 0,
						"left": transition == "slideLeft" ? w : -w,
						"width": w,
						"height": h,
						"opacity": 1
					});

					this.windowResize();

					if (transition == "slideLeft") {
						translate3d = "translate3d" + "(" + "-" + w + "px" + "," + "0px" + "," + "0px" + ")";
					} else {
						translate3d = "translate3d" + "(" + w + "px" + "," + "0px" + "," + "0px" + ")";
					}

					var option = {};
					for (var i in browserVariables.cssPrefixes) {
						var transform = browserVariables.cssPrefixes[i] + "transform";
						var transition_duration = browserVariables.cssPrefixes[i] + "transition-duration";
						var animation_timing_function = browserVariables.cssPrefixes[i] + "animation-timing-function";

						option[transform] = translate3d;
						option[transition_duration] = s;
						option[animation_timing_function] = easing;
					}

					var endFunc = function () {
						var $hide = $(hide);
						var $show = $(show);

						var _option = {};
						for (var i in browserVariables.cssPrefixes) {
							//var transform = browserVariables.cssPrefixes[i] + "transform";
							var transition_duration = browserVariables.cssPrefixes[i] + "transition-duration";
							//_option[transform] = "translate3d(0px,0px,0px)";
							_option[transition_duration] = "0s";
						}

						//_option["left"] = 0;
						//_option["top"] = 0;
						//_option["width"] = "100%";
						//_option["height"] = "100%";

						$hide.hide();
						$hide.css(_option);
						$show.css(_option);

						if (typeof transitionsCallback == "function") {
							transitionsCallback();
						}

					};

					var trans = setTimeout(function () {
						var _option2 = option;
						var $hide = $(hide);
						var $show = $(show);

						$hide.css(_option2);
						$show.css(_option2);

						clearTimeout(trans);
					}, 0);


					$(show).one(browserVariables.transitionEndEvent, function () {
						endFunc();

					});


					break;

					//#region fade

				case "fade":

					var _option = {
						"left": 0,
						"top": 0,
					};
					for (var i in browserVariables.cssPrefixes) {
						var transform = browserVariables.cssPrefixes[i] + "transform";
						var transition_duration = browserVariables.cssPrefixes[i] + "transition-duration";
						_option[transform] = "translate3d(0px,0px,0px)";
						_option[transition_duration] = "0s";
					}
					$(show).css(_option);
					$(hide).css(_option);

					$(hide).animate({ opacity: 0 }, 200, easing, function () {
						$(hide).hide();

					});

					$(show).css("opacity", "0").show();
					$(show).animate({ opacity: 1 }, 200, easing, function () {

						if (typeof transitionsCallback != "undefined") {
							transitionsCallback();
						}
					});

					this.windowResize();

					break;

					//#endregion

					//#region none

				case "none"://不执行任何动画
				default:
					$(hide).css({
						"left": 0,
						"top": 0,
						"opacity": 1
					});

					$(show).css({
						"left": 0,
						"top": 0,
						"opacity": 1
					});

					var _option = {};
					for (var i in browserVariables.cssPrefixes) {
						var transform = browserVariables.cssPrefixes[i] + "transform";
						var transition_duration = browserVariables.cssPrefixes[i] + "transition-duration";
						_option[transform] = "translate3d(0px,0px,0px)";
						_option[transition_duration] = "0s";
					}

					$(show).css(_option);
					$(hide).css(_option);
					$(hide).hide();
					$(show).show();

					//_option["left"] = 0;
					//_option["top"] = 0;
					//_option["width"] = "100%";
					//_option["height"] = "100%";

					this.windowResize();

					if (typeof transitionsCallback == "function") {
						transitionsCallback();
					}

					break;
					//#endregion
			}

		},

		toPage: function (toRoute, transition, reset, transitionsCallback, back) {
		    var _this = this;

		    if (mad.util.isNullOrEmpty(toRoute) || _this.transitionsFlag != 0) {
				return;
			}
		    _this.transitionsFlag = 2;
			//var fromRoute = this.controller.getRouteNameByRoute(fromRoute); 
			var fromRouteName = mad.currentRouteName;
			var toRoute = toRoute;
			var toRouteName = mad.getRouteNameByRoute(toRoute);
			if (toRouteName == "" || $("#" + toRouteName).css("display") == "block" && readyed) {
			    _this.transitionsFlag = 0;
				return;
			}

			reset = reset != null && reset.toString() == "true" ? true : false;
			back = back != null && back.toString() == "true" ? true : false;
			//history
			if (!back && mad.currentRoute) {
				mad.history.add(mad.currentRoute);
			}

			if (reset == true && typeof mad.routes[toRouteName].reset == "function") {

				mad.routes[toRouteName].reset();
			}
			//动画执行完的回调
			var callbackFunc = function () {
				if (fromRouteName !== "") {
					if (typeof mad.routes[fromRouteName].destroy == "function") {
						mad.routes[fromRouteName].destroy();
					}
				}

				mad.gotoRoute(toRoute.trim());

				_this.transitionsFlag = 0;

				if (typeof transitionsCallback == "function") {
					transitionsCallback();
				}
			}

			if (mad.routes[toRouteName].existBeforeAction) {
				mad.gotoRouteBefore(toRoute.trim());
			}
			this.transitions(transition, toRouteName, fromRouteName, null, callbackFunc);
		},
		windowResize: function () { },
		ready: function () {

		    var _this = this;

			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

			this.width = $(window).width();
			this.height = $(window).height();

			$("#outer").css("height", this.height);

			//page
			$("[data-role]").each(function () {

				var role = $(this).attr("data-role");
				if (!mad.util.isNullOrEmpty(role) && /(page)|(modal)/.test(role)) {

				    $(this).css({ "width": _this.width + "px", "height": _this.height + "px", "display": "none" });
					$(this).addClass(role);
					_this.views[$(this).attr("id")] = { role: role };

					$(this).find("[data-role='scrollerSection']").addClass("scrollerSection");

					if (_this.statusbar) {
						$(this).prepend('<div class="statusbar"></div>');
					}
				}
			});

			//route btn
			$("[data-forhash]").globalTapLive(function () {

				var forhash = $(this).attr("data-forhash");
				var transition = $(this).attr("data-transition");
				var reset = $(this).attr("data-reset");
				var back = $(this).attr("data-back");
				if (back == "true") {
				    _this.back(transition, reset, null);
				}
				else {
				    _this.toPage(forhash, transition, reset, null);
				}

				return false;
			});
		}
	};

})(this);