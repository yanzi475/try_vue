import {constants} from './constatns'

// 可重用的工具方法
var utils = {
    isAndroid: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf('android') > -1 || ua.indexOf("linux") > -1;
        return isAndroid;
    },
    isIOS: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        var isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i);
        return isIOS;
    },
    isWeixinWebView: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        return /micromessenger/.test(ua);
    },
    isQQWebView: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        return /v1_and_sq_([\d\.]+)/.test(ua) || /qq\/([\d\.]+)/i.test(ua);
    },
    isDevEnv: function () {
        return /sit-/.test(window.location.host);
    },
    log: function () {
        if (this.isDevEnv()) {
            console && console.log && console.log.apply(console, arguments);
        }
    },
    /**
     * 给指定 URL 添加查询参数， 返回新的 URL 字符串
     * 不会进行编码，需要自行编码后传入参数
     */
    addQueryParams: function (url) {
        if (arguments.length <= 1) {
            return url;
        }

        if (!/\?/.test(url)) {
            url += '?';
        } 

        var key, value;
        for (var i = 1; i < arguments.length; i += 2) {
            key = arguments[i];
            value = arguments[i+1] || '';
            if (key) {
                var lastChar = url.charAt(url.length - 1);
                if (lastChar !== '?' && lastChar !== '&') {
                    url += '&';
                } 

                url += (key + '=' + value);
            }
        }
        return url;
    },
    // 获取 URL 查询参数
    getQuery: function (name, url) {
        try {
            url = url || window.location.search.substr(1).replace(/\+/g, " ");
            var regex = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var parts = url.match(regex);
            if (parts != null) {
                return decodeURIComponent(parts[2]);
            } else {
                return "";
            }
        } catch (e) {
            return "";
        }
    },
  
    // 尝试在android下打开app
    tryOpenApp: function (appUrlSchema) {
        var ifr = document.createElement('iframe');
        ifr.src = appUrlSchema;
        ifr.style.cssText = "display:none;width:0;height:0";
        document.body.appendChild(ifr);
        setTimeout(function () {
            document.body.removeChild(ifr);
        }, 0);
    },

    // 活动id
    getActivityId: function () {
        return this.getQuery('activity_id') || 'null';
    },
    // 下载渠道号
    // 由两部分 y 和 c 组成，中间使用'$'符号链接，例如'y$c'，必须保证 CDN 上有 yc 命名的安装包
    // 例如 CDN 上下载包为 'beiyong53'， URL 中的 channel_id 命名为 'beiyong$53'
    getChannelId: function () {
        return this.getQuery('channel_id') || 'null';
    },
    // 营销渠道ID（用于MTA统计，需要事先在MTA上新建渠道号, 格式: a.b.c.d 最多支持四级，每级用点分割）
    getADTAG: function () {
        return this.getQuery('ADTAG');
    },
    // 获取下载页面地址，使用当前页面的渠道id和业务id，
    // 存本取息存款分享页配置的下载渠道号，与运营同学约定：渠道号由两部分组成，中间使用"$"符号分割
    getDownloadPageUrl: function () {
        var url = constants.DOWNLOAD_PAGE_URL;
        var arr = this.getChannelId().split('$')
        var y = arr[0] || '';
        var c = arr[1] || '';
        url = url + '?y=' + y + '&c=' + c;
        return url;
    },
    // 按键是数字键
    isDigitKey: function (event) {
        var keyCode = event.keyCode,
            keyIdentifier = event.keyIdentifier;
        if (keyCode === 229) {
            if (keyIdentifier) {
                return keyIdentifier >= 'U+0030' && keyIdentifier <= 'U+0039';
            } else {
                return false;
            }
        } else {
            return (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105);
        }
    },
    // 按键是小数点
    isDigitDotKey: function (event) {
        var keyCode = event.keyCode;
        return keyCode === 110 || keyCode === 190 ;
    },
    // 包含小数点
    includeDot: function (num) {
        return String(num).indexOf('.') > -1;
    },
    isNumber: function (val) {
        return typeof val === 'number';
    },
    isFunction: function (val) {
        return typeof val === 'function';
    },
    // 精确到指定小数位（默认2位），最后一位四舍五入
    toFixed: function(num, digit) {
        var _num = parseFloat(num);
        digit = typeof(digit) !== 'number' ? 2 : digit;
        if (!isNaN(_num)) {
            return _num.toFixed(digit + 1e-8);
        } else {
            return num;
        }
    }
};

export {utils}
