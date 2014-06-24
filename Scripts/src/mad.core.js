/*
 * @author:indifer
 * @email:indifer@126.com
 * @version 0.0.1(2014/06/18 20:00)
 */

(function (global) {

    function Mad() {
        
        this.crossroads = crossroads || global["crossroads"];

        this.currentRouteName = "";
        this.currentRoute = "";
        this.currentRefresh = false;

        this.lastRoute = "";
        this.lastRouteName = "";

        //0:Õý³££»1£ºbeforeAction
        this.routeType = 0;
        this.controllers = {};

        this.crossroads.bypassed.add(function (request) {
            console.log(request);
        });

        return this;
    }

    /*
     * add controller
     */
    Mad.prototype.addController = function (route, options) {
        
        var _this = this;
        options = options || {};

        var action = options.action;
        var beforeAction = options.beforeAction;
        var _route = this.crossroads.addRoute(options.route, function () {

            if (_this.routeType == 0) {
                var _r = route;
                action.apply(options.action, arguments);
                _this.currentRouteName = _r;
            }
            else if (_this.routeType == 1 && typeof (beforeAction) == "function") {

                beforeAction.apply(options.beforeAction, arguments);
            }

        });

        if (options.rules) {
            _route.rules = options.rules;
        }
        _route.existBeforeAction = typeof (options.beforeAction) == "function";
        _route.reset = options.reset;
        _route.destroy = options.destroy;
        _route.module = options.module;

        this.controllers[route] = _route;

        if (typeof options.init == "function") {
            options.init();
        }

    };

    Mad.prototype.getRouteNameByRoute = function (route) {
        route = route.indexOf("#") > -1 ? route.substr(1) : route;

        for (var n in this.controllers) {

            if (this.controllers[n].match(route)) { return n; }
        }
        return "";
    };

    Mad.prototype.getRouteByParameter = function (routeName, parameter) {
        
        var route = this.controllers[routeName];
        if (!route) return "";

        return route.interpolate(parameter);
    };

    Mad.prototype.onRouteChange = function (reset) {
        reset = reset || false;
        if (reset) {
            crossroads.resetState();
        }

        var n = this.currentRoute.indexOf("#") > -1 ? this.currentRoute.substr(1) : this.currentRoute;
        crossroads.parse(n);
    };

    Mad.prototype.gotoRoute = function (toRoute, reset) {
        this.routeType = 0;
        this.lastRoute = this.currentRoute;
        this.lastRouteName = this.currentRouteName;

        var n = toRoute.toLowerCase();
        this.currentRoute = n;

        this.onRouteChange(reset);
    };

    Mad.prototype.gotoRouteBefore = function (toRoute) {

        this.routeType = 1;
        var n = toRoute.toLowerCase();
        n = n.indexOf("#") > -1 ? n.substr(1) : n;
        crossroads.parse(n);
        crossroads.resetState();
    };    

    var mad = new Mad();
    global['mad'] = mad;

    return mad;

})(this);