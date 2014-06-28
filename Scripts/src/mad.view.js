/*
 * @author:indifer
 * @email:indifer@126.com
 * @version 0.0.1(2014/06/18 20:00)
 */

(function (global) {

    mad.constructor.prototype.view = {
        tempCached: true,
        templates: {},
        pages: {},
        //����page
        addPage: function (id, url, data) {
            this.pages[id] = {
                url: url,
                data: data
            };
        },
        getPage: function (id) {
            if (pages[id]) {
                return render({
                    cache: false,
                    url: pages[id].url
                }, pages[id].data);
            }
            return null;
        },
        //������ͼ
        addTemp: function (name, text) {
            this.templates[name] = text;
        },

        //��Ⱦ
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
    };


})(this);