/*
 * @author:indifer
 * @email:indifer@126.com
 * @version 0.0.1(2014/06/18 18:00)
 */

(function (global) {

    var _browserVariables = {
        cssPrefixes: ['-webkit-', '-moz-', '-o-', '-ms-', '']
    };

    var thisBody = document.body || document.documentElement, thisStyle = thisBody.style;
    _browserVariables.transitionEndEvent = 'webkitTransitionEnd oTransitionEnd transitionend';

    if (thisStyle.WebkitTransition !== undefined) {
        _browserVariables.transitionEndEvent = 'webkitTransitionEnd';
        _browserVariables.transform = "-webkit-transform";
        _browserVariables.transition_duration = "-webkit-transition-duration";
        _browserVariables.animation_timing_function = "-webkit-animation-timing-function";
    }
    else if (thisStyle.MozTransition !== undefined) {
        _browserVariables.transitionEndEvent = 'transitionend';
        _browserVariables.transform = "-moz-transform";
        _browserVariables.transition_duration = "-moz-transition-duration";
        _browserVariables.animation_timing_function = "-moz-animation-timing-function";
    }
    else if (thisStyle.OTransition !== undefined) {
        _browserVariables.transitionEndEvent = 'oTransitionEnd';
        _browserVariables.transform = "-o-transform";
        _browserVariables.transition_duration = "-o-transition-duration";
        _browserVariables.animation_timing_function = "-o-animation-timing-function";
    }
    else {
        _browserVariables.transitionEndEvent = 'transitionend';
        _browserVariables.transform = "transform";
        _browserVariables.transition_duration = "transition-duration";
        _browserVariables.animation_timing_function = "animation-timing-function";
    }

    _browserVariables.cssTransitionsSupported = thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.OTransition !== undefined || thisStyle.transition !== undefined;
    _browserVariables.has3D = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());

    mad.constructor.prototype.browserVariables = _browserVariables;

})(this);