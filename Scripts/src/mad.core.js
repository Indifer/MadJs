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
        this.routes = {};

        this.crossroads.bypassed.add(function (request) {
            console.log(request);
        });

        return this;
    }

    Mad.prototype.addRoute = function (r, options) {
        
        var _this = this;
        options = options || {};

        var action = options.action;
        var beforeAction = options.beforeAction;
        this.routes[r] = this.crossroads.addRoute(options.route, function () {

            if (_this.routeType == 0) {
                var _r = r;
                action.apply(options.action, arguments);
                _this.currentRouteName = _r;
            }
            else if (_this.routeType == 1 && typeof (beforeAction) == "function") {

                beforeAction.apply(options.beforeAction, arguments);
            }

        });
        if (options.rules) {
            this.routes[r].rules = options.rules;
        }
        this.routes[r].existBeforeAction = typeof (options.beforeAction) == "function";
        this.routes[r].reset = options.reset;
        this.routes[r].destroy = options.destroy;
        this.routes[r].module = options.module;

        if (typeof options.initialize == "function") {
            options.initialize();
        }

    };

    Mad.prototype.getRouteNameByRoute = function (route) {
        route = route.indexOf("#") > -1 ? route.substr(1) : route;

        for (var n in this.routes) {

            if (this.routes[n].match(route)) { return n; }
        }
        return "";
    };

    Mad.prototype.getRouteByParameter = function (routeName, parameter) {
        
        var route = this.routes[routeName];
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