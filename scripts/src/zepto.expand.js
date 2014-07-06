(function ($) {
    $.fn.outerHeight = function () {
        return $(this).height() + parseInt($(this).css("margin-top").replace("px", ""))
            + parseInt($(this).css("margin-right").replace("px", ""))
            + parseInt($(this).css("margin-bottom").replace("px", ""))
            + parseInt($(this).css("margin-left").replace("px", ""));
    }
    
    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
    var ontouchstartSupported = 'ontouchstart' in window && !isTouchPad;
    $.fn.globalTapLive = function (f) {
        if (ontouchstartSupported) {
            this.live("tap", f);
        }
        else {
            this.live("click", f);
        }
    };

    $.fn.globalTapDie = function (f) {
        if (ontouchstartSupported) {
            this.die("tap", f);
        }
        else {
            this.die("click", f);
        }
    };

    // one
    $.fn.globalTapOne = function (f) {
        if (ontouchstartSupported) {
            this.one("tap", f);
        }
        else {
            this.one("click", f);
        }
    };
})(Zepto || jQuery);