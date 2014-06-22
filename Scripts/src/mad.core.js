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

        //0:正常；1：beforeAction
        this.routeType = 0;
        this.routes = {};

        this.crossroads.bypassed.add(function (request) {
            console.log(request);
        });

        return this;
    }

    /*
     * add route
     */
    Mad.prototype.addRoute = function (rroute, options) {
        
        var _this = this;
        options = options || {};

        var action = options.action;
        var beforeAction = options.beforeAction;
        var _route = this.crossroads.addRoute(options.route, function () {

            if (_this.routeType == 0) {
                var _r = rroute;
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

        this.routes[rroute] = _route;

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
        if (isNullOrEmpty(val)) return false;
        val = val.toString().toLowerCase().trim();

        if (this._values.length == 0 || this._values[this._values.length - 1] != val) {
            this._values.push(val);
            return true;
        }
        return false;
    }

    //更新
    AppHistory.prototype.update = function (val, index) {
        if (isNullOrEmpty(val) || index < 0) return false;
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

        if (isNullOrEmpty(name)) return;

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

    Mad.prototype.appHistory = new AppHistory();

    //#endregion

    var mad = new Mad();
    global['mad'] = mad;

    return mad;

})(this);