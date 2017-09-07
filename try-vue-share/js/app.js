import Vue from 'vue/dist/vue.min'
import { utils } from './utils'
import { share } from './share'

var STATISTIC_PAGE_URL = 'https://www.google.com.hk/';

// 初始化分享
var shareUrl = utils.addQueryParams(STATISTIC_PAGE_URL,
    'activity_id', utils.getActivityId(),
    'channel_id', utils.getChannelId(),
    'ADTAG', utils.getADTAG(),
    'jump_url', encodeURIComponent(window.location.href)
);

// 环境的判断
var ENV = {
    SIT: {
        URL : "https://www.google.com.hk/",
        IMAGE_URL:" ",
        WX_APPID: '',
        QQ_APPID: ''
    },
    PROD: {
        URL: "https://www.google.com.hk/",
        IMAGE_URL:" ",
        WX_APPID: '',
        QQ_APPID: ''
    }
};

// var display =  true;
// var   down=  true;


window.vm = new Vue({
    el: '#app',
    data: {
        detail: [{
            text: '住宿费',
            amount: '25,000.00'
        }, {
            text: '教材费',
            amount: '25,000.00'
        }, {
            text: '体检',
            amount: '25,000.00'
        }, {
            text: '医保',
            amount: '25,000.00'
        }],
        display: false,
        down: true,
        share: true
    },
    computed: {

        reversedDisplayState: function () {
            // `this` points to the vm instance
            return this.display
        }
    },
    watch: {
        // 如果 state 发生改变，这个函数就会运行
        reversedState: function (newQuestion) {
            this.getAnswer()
        }
    },
    methods: {
        clickDisplay: function () {
            this.display = !this.display;
            this.down = !this.down;

        },
        clickShare: function () {
            this.share = !this.share;

            //
            var onBridgeReady = function () {

                WeixinJSBridge.call('hideOptionMenu');
            }


            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {

                // util.openShareWXPay(redirectUrl);

                if (typeof WeixinJSBridge == 'undefined') {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }

            }
            else {

                var param = {
                    "share_type": 0,
                    "image_url": '',
                    "share_url": STATISTIC_PAGE_URL,
                    "desc": "",
                    "title": ""
                };

                // mqq.data.setShareInfo(param);

                mqq.invoke('data', 'setShareInfo', param);


            }
        },

        clickMask: function (){
            this.share = !this.share;

        },
        mounted: function () {
            // 进入页面初始化分享

            share.init({
                url: shareUrl,
                title: 'try-vue',
                content: 'try-vue',
                iconUrl: utils.isDevEnv() ? 'test2.png' : 'test1.png'
            });

        }
    }
});

