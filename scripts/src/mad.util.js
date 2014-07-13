/*
 * @author:indifer
 * @email:indifer@126.com
 * @version 0.0.1(2014/06/22 16:00)
 */

(function (global) {
    	
	global.util = {

		//判断是否为空字符或null
		isNullOrEmpty: function (value) {

		    if (value == null || String.prototype.trim.call(value) === "") {
				return true;
			}
			else {
				return false;
			}
		},

		//数字格式化
		//@s:数字
		//@n:位数
		numFormat: function (s, n) {

			n = n > 0 && n <= 20 ? n : 2;
			s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
			var l = s.split(".")[0].split("").reverse(),
			r = s.split(".")[1];
			t = "";
			for (i = 0; i < l.length; i++) {
				t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
			}
			return t.split("").reverse().join("") + "." + r;
		},

		//千分位数字
		milliFormat: function (number) {

			if (number == null || number === "") return "";
			var num = number + "";
			if (num === "0") return num;
			num = num.replace(new RegExp(",", "g"), "");
			// 正负号处理   
			var symble = "";
			if (/^([-+]).*$/.test(num)) {
				symble = num.replace(/^([-+]).*$/, "$1");
				num = num.replace(/^([-+])(.*)$/, "$2");
			}

			if (/^[0-9]+(\.[0-9]+)?$/.test(num)) {
				var num = num.replace(new RegExp("^[0]+", "g"), "");
				if (/^\./.test(num)) {
					num = "0" + num;
				}

				var decimal = num.replace(/^[0-9]+(\.[0-9]+)?$/, "$1");
				var integer = num.replace(/^([0-9]+)(\.[0-9]+)?$/, "$1");

				var re = /(\d+)(\d{3})/;

				while (re.test(integer)) {
					integer = integer.replace(re, "$1,$2");
				}
				return symble + integer + decimal;

			} else {
				return number;
			}
		},

		dateFormat: function (date, format) {
			var o = {
				"M+": date.getMonth() + 1, //month
				"d+": date.getDate(),    //day
				"H+": date.getHours(),   //hour
				"m+": date.getMinutes(), //minute
				"s+": date.getSeconds(), //second
				"q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
				"S": date.getMilliseconds() //millisecond
			}
			if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o) if (new RegExp("(" + k + ")").test(format))
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
						("00" + o[k]).substr(("" + o[k]).length));
			return format;
		},

		//写cookies
		setCookie: function (name, value, exp) {

			var expDate = new Date();
			if (typeof (exp) == "number") {

				expDate.setTime(expDate.getTime() + (exp));
			}
			else if (Object.prototype.toString.call(exp) == "[object Date]") {
				expDate = exp;
			}
			document.cookie = name + "=" + escape(value) + ";expires=" + expDate.toGMTString();
		},

		//读取cookies
		getCookie: function (name) {

			var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
			if (arr = document.cookie.match(reg))
				return (arr[2]);
			else
				return null;
		},

		//删除cookies
		delCookie: function (name) {

			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval = getCookie(name);
			if (cval != null)
				document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
		},

		//获取本地存储的值
		getLocalData: function (key) {

			var val = "";
			if (window.localStorage) {
				val = window.localStorage.getItem(key);
			}
			else {
				val = getCookie(key);
			}
			if (isNullOrEmpty(val) || val == "undefined") return "";
			return val;
		},

		//设置本地存储的值
		setLocalData: function (key) {

			removeLocalData(key);
			if (window.localStorage) {
				window.localStorage.setItem(key, val);
			}
			else {
				setCookie(key, val);
			}
		},

		//删除本地存储
		removeLocalData: function (key) {

			if (window.localStorage) {
				window.localStorage.removeItem(key);
			}
			else {
				delCookie(key);
			}
		},

		//四舍五入
		round: function (v, e) {
			var t = 1;
			for (; e > 0; t *= 10, e--);
			for (; e < 0; t /= 10, e++);
			return Math.round(v * t) / t;
		},

		//计算字符串长度
		charLen: function (str) {

			var len = 0;
			for (var i = 0; i < str.length; i++) {
				if (str.charCodeAt(i) > 255 || str.charCodeAt(i) < 0) len += 2; else len++;
			}
			return len;
		},

		//截取汉子字符串（从start字节到end字节）		
		subCHString: function (str, start, end) {
			var len = 0;
			var str2 = "";
			str.strToChars();
			for (var i = 0; i < str.length; i++) {
				if (str.charsArray[i][1])
					len += 2;
				else
					len++;
				if (end < len)
					return str2;
				else if (start < len)
					str2 += str.charsArray[i][0]; shi
			}
			return str2;
		},

		//解析url参数
		decodeUrlParams: function (val) {
			val = val.split("&");
			var _temp;

			var data = {};
			for (var i in val) {
				if (!val.hasOwnProperty(i)) { continue; }
				_temp = val[i].split("=");
				if (_temp.length == 2) {
					data[_temp[0]] = _temp[1];
				}
			}

			return data;
		}
	};

})(this);