import Vue from 'vue/dist/vue.min'
import { utils } from './utils'
import { report } from './report'
import { constants } from './constatns'
import { share } from './share'


// 年利率
var annualRate = 0.08,
    // 年月数
    monthsOfYear = 12;

var defaultPrincipalTip = '自定义金额，最低1000元',
    defaultInterestTip = '自定义金额，最低1元',
    calculatingTip = '计算中...';
window.vm = new Vue({
    el: '#app',
    data: {
        scenes: [{
            text: '',
            interest: 200
        }, {
            text: '经费',
            interest: 520
        }],
        interest: '',
        _principalInputDot: false
    },
    computed: {
        // 利息错误
        composeData: function () {
            //todo
            }
    },
    methods: {
        onSelect: function (val) {
            this.interest = utils.toFixed(val);
            this.interestFocus = true;
            this.onInterestChange();
        },
        _isInterestCalculating: function () {
            return this.interestTip === calculatingTip;
        }
    },
    mounted: function () {
        // 预加载图片
        for (var i = 0; i < this.scenes.length; ++i) {
            var banner = this.scenes[i].banner;
            (function (banner) {
                setTimeout(function () {
                    new Image().src = banner;
                }, 1);
            })(banner);
        }

        // 默认选中第一个标签
        this.onSelect(this.scenes[0].interest);
    }
});


var principalDetailUrl = utils.addQueryParams(PRINCIPAL_DEPOSIT_DETAIL_URL,
    // 活动号
    'activity_id', utils.getActivityId(),
    // 下载渠道号
    'channel_id', utils.getChannelId(),
    // MTA来源渠道统计
    'ADTAG', utils.getADTAG()
);


// 初始化分享
var shareUrl = utils.addQueryParams(STATISTIC_PAGE_URL,
    'activity_id', utils.getActivityId(),
    'channel_id', utils.getChannelId(),
    'ADTAG', utils.getADTAG(),
    'jump_url', encodeURIComponent(window.location.href)
);

share.init({
    url: shareUrl,
    title: '',
    content: '',
    iconUrl: ''
});



window.addEventListener("resize", function()
    if(window.innerHeight + 20 < _winHeight) {
        $eleAppBtn.style.display = 'none';
    }
    else {
        $eleAppBtn.style.display = 'block';
    }
});
