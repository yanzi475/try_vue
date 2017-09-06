import Vue from 'vue/dist/vue.min'
import { utils } from './utils'
import { share } from './share'

var STATISTIC_PAGE_URL = 'http://www.webank.com/';

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
        URL : "https://test-personal.webank.com/s/hj/",
        IMAGE_URL:"https://test-personal.webank.com/s/hj/weixinmp/img/share_school.png",
        WX_APPID: 'wxdc3dce3bdd8339a5',
        QQ_APPID: '101219330'
    },
    PROD: {
        URL: "https://personal.webank.com/s/hj/" ,
        IMAGE_URL:"https://www.webankcdn.net/s/hj/weixinmp/img/share_school.png",
        WX_APPID: 'wx90bfe8ac7aa1338a',
        QQ_APPID: '101219330'
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
                    "image_url": 'https://www.webankcdn.net/s/hj/weixinmp/img/share_school.png',
                    "share_url": STATISTIC_PAGE_URL,
                    "desc": "先完成缴费，可以提前选宿舍哦！",
                    "title": "武汉学院线上缴学费"
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
                title: '微众银行',
                content: '微众银行-try-vue',
                iconUrl: utils.isDevEnv() ? 'https://sit-hjdata.webank.com/tc-k/common/share-deposit/img/head.png' : 'https://hjdata.webank.com/querydata/html/sharePage/share-deposit/img/head.png'
            });

        }
    }
});

