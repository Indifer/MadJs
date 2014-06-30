/*
 * @author:indifer
 * @email:indifer@126.com
 * @version 0.0.1(2014/06/18 20:00)
 */

(function (global) {

    mad.fn.view = {
    };

    mad.view.tempCached = true;
    mad.view.templates = {};
    mad.view.pages = {};
    
    mad.extend(mad.fn.view, { //添加page
        addPage: function (id, url, data) {
            this.pages[id] = {
                url: url,
                data: data
            };
        },
        getPage: function (id) {

            var page = this.pages[id];

            if (page) {
                return this.render({
                    cache: false,
                    url: page.url
                }, page.data);
            }
            return null;
        },
        //添加视图
        addTemp: function (name, text) {
            this.templates[name] = text;
        },

        //渲染
        render: function (options, data) {

            var isTempCached = this.tempCached;
            options = typeof options == "string" ? { text: options } : options;
            if (options.name) {
                options.text = this.templates[options.name];
            }
            options.cache = options.cache || this.tempCached;

            var html = new EJS(options).render(data);
            return html;
        },

        //
        create: function (options) {

            var isTempCached = this.tempCached;
            options = typeof options == "string" ? { text: options } : options;
            if (options.name) {
                options.text = this.templates[options.name];
            }
            options.cache = options.cache || this.tempCached;

            return new EJS(options);
        }
    });

})(this);