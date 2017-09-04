import {utils} from './utils'

var share = {
    init: function (config) {
        if (utils.isWeixinWebView()) {
            this.initWeixin(config);
        } else if (utils.isQQWebView()) {
            this.initQQ(config);
        } else {
        }
    },
    /**
     * 初始化微信 WebView 自带的分享
     * @param {{url: string, title: string, content: string, iconUrl: string}} config - 分享配置
     */
    initWeixin: function (config) {
        // 解析参数
        config = config || {};
        var url = config.url,
            title = config.title,
            content = config.content,
            iconUrl = config.iconUrl;

        var shareFriend = function () {
            WeixinJSBridge.invoke('sendAppMessage', {
                "appid": '',
                "img_url": iconUrl,
                "img_width": "200",
                "img_height": "200",
                "link": url,
                "desc": content,
                "title": title
            }, function (res) {
                //_report('send_msg', res.err_msg);
            })
        };

        var shareTimeline = function () {
            WeixinJSBridge.invoke('shareTimeline', {
                "appid": '',
                "img_url": iconUrl,
                "img_width": "200",
                "img_height": "200",
                "link": url,
                "desc": content,    //朋友圈中，这个字段无效
                "title": title
            }, function (res) {
                //_report('timeline', res.err_msg);
            });
        };
        var shareWeibo = function () {

            WeixinJSBridge.invoke('shareWeibo', {
                "content": content,
                "url": url
            }, function (res) {
                //_report('weibo', res.err_msg);
            });
        };

        // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            // 发送给好友
            WeixinJSBridge.on('menu:share:appmessage', function (argv) {
                shareFriend();
            });
            // 分享到朋友圈
            WeixinJSBridge.on('menu:share:timeline', function (argv) {
                shareTimeline();
            });
            // 分享到微博
            WeixinJSBridge.on('menu:share:weibo', function (argv) {
                shareWeibo();
            });
        }, false);
    },

    /**
     * 初始化 QQ WebView 自带的分享
     * 需要引入 JS 文件： http://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js
     * 文档参考 {@link https://open.mobile.qq.com/api/component/share}
     */
    initQQ: function (config) {
        // 解析参数
        config = config || {};
        var url = config.url,
            title = config.title,
            content = config.content,
            iconUrl = config.iconUrl;

        if (typeof window.setShareInfo === 'function') {
            window.setShareInfo({
                title: title,       // 分享标题
                summary: content, // 分享内容
                pic: iconUrl, // 分享图片
                url: url, // 分享链接
                WXconfig: {
                    swapTitleInWX: true,
                    appId: '',
                    timestamp: '',
                    nonceStr: '',
                    signature: ''
                }
            });
        }
    }
};

export { share }