/*
 * @author:indifer
 * @email:indifer@126.com
 * @version 0.0.1(2014/06/18 20:00)
 */

(function (global) {

    mad.constructor.prototype.view = {
        tempCached: true,
        templates: {}
    };

    //ÃÌº” ”Õº
    mad.view.add = function (name, text) {
        this.templates[name] = text;
    };

    //‰÷»æ
    mad.view.render = function (options, data) {

        var isTempCached = this.tempCached;
        options = typeof options == "string" ? { text: options } : options;
        if (options.name) {
            options.text = this.templates[options.name];
        }
        options.cache = options.cache || this.tempCached;

        var html = new EJS(options).render(data);
        return html;
    }

    mad.view.create = function (options) {

        var isTempCached = this.tempCached;
        options = typeof options == "string" ? { text: options } : options;
        if (options.name) {
            options.text = this.templates[options.name];
        }
        options.cache = options.cache || this.tempCached;

        return new EJS(options);
    }

})(this);