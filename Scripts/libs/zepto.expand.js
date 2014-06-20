(function ($) {
    $.fn.outerHeight = function () {
        return $(this).height() + parseInt($(this).css("margin-top").replace("px", ""))
            + parseInt($(this).css("margin-right").replace("px", ""))
            + parseInt($(this).css("margin-bottom").replace("px", ""))
            + parseInt($(this).css("margin-left").replace("px", ""));
    }

})(Zepto);