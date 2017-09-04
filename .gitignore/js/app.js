import Vue from 'vue/dist/vue.min'
import { utils } from './utils'
import { report } from './report'
import { constants } from './constatns'
import { share } from './share'
import { PageSlider } from './pager_slider'

// 年利率
var annualRate = 0.04875,
    // 年月数
    monthsOfYear = 12;

var defaultPrincipalTip = '自定义金额，最低5000元',
    defaultInterestTip = '自定义金额，最低20.83元',
    calculatingTip = '计算中...';
window.vm = new Vue({
    el: '#app',
    data: {
        scenes: [{
            text: '自己的梦想',
            interest: 200,
            banner: 'img/banner-1.jpg'
        }, {
            text: '恋爱的经费',
            interest: 520,
            banner: 'img/banner-2.jpg'
        }, {
            text: '孩子的生活费',
            interest: 1000,
            banner: 'img/banner-3.jpg'
        }, {
            text: '爸妈的养老金',
            interest: 2000,
            banner: 'img/banner-4.jpg'
        }],
        interest: '',
        principal: '',
        // 利息输入框是否获得焦点， true 表示利息输入框作为输入，false表示本金输入框作为输入
        interestFocus: true,
        principalTip: defaultPrincipalTip,
        interestTip: defaultInterestTip,
        _timerId1: null,
        _timerId2: null,
        _interestInputDot: false,        // 标记利息输入框是否已输入了小数点
        _principalInputDot: false
    },
    computed: {
        // 利息错误
        interestError: function () {
            // 利息输入框获得焦点 && 计算结果已出 && 数值符合条件
            return this.interestFocus && !this._isInterestCalculating() && this.interest !== '' && this.interest < 20.83;
        },
        principalError: function () {
            return !this.interestFocus && !this._isPrincipalCalculating() && this.principal !== '' && this.principal < 5000;
        },
        // 利息计算结果就绪
        interestResultReady: function () {
            return !this.interestFocus && !this._isInterestCalculating() && this.interest !== '';
        },
        principalResultReady: function () {
            return this.interestFocus && !this._isPrincipalCalculating() && this.principal !== '';
        },
        banner: function () {
            var foundIndex = 0;
            for (var i = 0; i < this.scenes.length; ++i) {
                if (this.scenes[i].interest === parseFloat(this.interest)) {
                    foundIndex = i;
                    break;
                }
            }
            return this.scenes[foundIndex].banner;
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
        },
        _isPrincipalCalculating: function () {
            return this.principalTip === calculatingTip;
        },
        onFocus: function (interestFocus) {
            this.interestFocus = interestFocus;
            if (interestFocus) {
                this.principal = utils.toFixed(this.principal);
            } else {
                this.interest = utils.toFixed(this.interest);
            }
        },
        onInterestChange: function (event) {
            // 清除计时器
            if (this._timerId1) {
                clearTimeout(this._timerId1);
                this._timerId1 = null;
            }

            // 清空
            if (this.interest === '' || this.interestError) {
                this.principal = '';
                this.principalTip = defaultPrincipalTip;
                return;
            }

            this.principal = '';
            this.principalTip = calculatingTip;
            this._timerId1 = setTimeout(function () {
                this.principal = utils.toFixed(this.interest * monthsOfYear / annualRate);
                if (parseFloat(this.interest) === 20.83) {
                    this.principal = 5000;
                }
                this.principalTip = defaultPrincipalTip;
            }.bind(this), 800);
        },
        onPrincipalChange: function (event) {
            if (this._timerId2) {
                clearTimeout(this._timerId2);
                this._timerId2 = null;
            }

            if (this.principal === '' || this.principalError) {
                this.interest = '';
                this.interestTip = defaultInterestTip;
                return;
            }

            this.interest = '';
            this.interestTip = calculatingTip;
            this._timerId2 = setTimeout(function () {
                this.interest = utils.toFixed(this.principal * annualRate / monthsOfYear);
                this.interestTip = defaultInterestTip;
            }.bind(this), 800);
        },
        valid: function (event, amount) {
            var keyCode = event.keyCode;
            utils.log('keyCode:' + keyCode);

            var amountStr = String(amount);
            // 按键白名单
            if (utils.isDigitKey(event)) {
                if (this.interestFocus) {   // 利息
                    var dotIndex = amountStr.indexOf('.');
                    if (this._interestInputDot) {   // 包含小数点
                        if (dotIndex === -1 || amountStr.slice(dotIndex + 1).length < 2) {  // 小数位位数小于 2 才能输入
                            return;
                        }
                    } else {
                        if (String(amount).length < '123456789'.length) {
                            return;
                        }
                    }
                } else {        // 本金输入
                    var dotIndex = amountStr.indexOf('.');
                    if (this._principalInputDot) {
                        if (dotIndex === -1 || amountStr.slice(dotIndex + 1).length < 2) {
                            return;
                        }
                    } else {
                        if (String(amount).length < '123456789'.length) {
                            return;
                        }
                    }
                }
            }

            // 小数点
            if (utils.isDigitDotKey(event)) {
                // 利息输入框没有输入小数点
                if (this.interestFocus && !this._interestInputDot) {
                    this._interestInputDot = true;
                    return;
                }
                // 本金输入框没有输入小数点
                if (!this.interestFocus && !this._principalInputDot) {
                    this._principalInputDot = true;
                    return;
                }
            }

            // 删除键
            if (keyCode === 8) {
                // 删除是更新小数点输入标识
                if (this.interestFocus) {
                    this._interestInputDot = /\./.test(amount);
                } else {
                    this._principalInputDot = /\./.test(amount);
                }
                return ;
            }

            // 阻止所有按键
            if (event.preventDefault) {
                event.preventDefault();
            }
            event.returnValue = false;
            return false;
        },
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

// App 下载地址
// var APP_DOWNLOAD_PAGE_URL = 'https://www.webank.com/app/common/bridge-download/index.html';
// 统计页（接受参数 activity_id, channel_id, jump_url 三个参数, jump_url不能带参数，如果带参数先转换成短链接）
var STATISTIC_PAGE_URL = 'https://personal.webank.com/s/hj/op/pre-reg/index.html';
    // 存本取息产品详情页
var PRINCIPAL_DEPOSIT_DETAIL_URL = 'https://www.webankcdn.net/s/hj/weixinmp/index.html?op=principalDetail';

// 微信公众号存本取息详情页地址（带参）
var principalDetailUrl = utils.addQueryParams(PRINCIPAL_DEPOSIT_DETAIL_URL,
    // 活动号
    'activity_id', utils.getActivityId(),
    // 下载渠道号
    'channel_id', utils.getChannelId(),
    // MTA来源渠道统计
    'ADTAG', utils.getADTAG()
);

/**
 * 跳转到存本取息页
 * 通过 URL 查询参数尝试唤起 App 的存本取息详情页，唤起失败则跳转到存本取息公众号购买页
 */
window.onClickGo = function () {
    // 唤起 App 的 URL SCHEMA 地址
    var APP_URL_SCHEMA = 'webank://?subType=1&moduleType=2&jumpParam=eyJhbmRyaWRNaW5WZXIiOiIyMjgwIiwiaW9zTWluVmVyIjoiMzQwIiwiYWN0aW9uX3BhcmFtIjoiMTEyMDE0MDEtMSJ9';

    // 上报点击
    report.clickStat('share_ck_cbqx_click_go_btn');

    if (utils.isWeixinWebView() || utils.isQQWebView()) {   
      var targetUrl = principalDetailUrl;
      // try open app and navigator to principal deposit purchase page
      if (utils.isAndroid() || utils.isIOS()) {
        utils.tryOpenApp(APP_URL_SCHEMA);
        setTimeout(function () {
          window.location.href = targetUrl;
        }, 800);
      } else {
        window.location.href = targetUrl;
      }
    } else {      // 非微信和QQ环境
      var targetUrl = utils.getDownloadPageUrl();
      if (utils.isAndroid() || utils.isIOS()) {
        utils.tryOpenApp(APP_URL_SCHEMA);
        setTimeout(function () {
          window.location.href = targetUrl;
        }, 800);
      } else {
        window.location.href = targetUrl;
      }
    }
}

// 初始化分享
var shareUrl = utils.addQueryParams(STATISTIC_PAGE_URL,
    'activity_id', utils.getActivityId(),
    'channel_id', utils.getChannelId(),
    'ADTAG', utils.getADTAG(),
    'jump_url', encodeURIComponent(window.location.href)
);

share.init({
    url: shareUrl,
    title: '我想存下一笔钱，每月还能收获小确幸',
    content: '微众银行存本取息存款，年利率4.875%，一次存入，月月取息',
    iconUrl: utils.isDevEnv() ? 'https://sit-hjdata.webank.com/tc-k/common/share-deposit/img/head.png' : 'https://hjdata.webank.com/querydata/html/sharePage/share-deposit/img/head.png'
});

var _winHeight = window.innerHeight,
    $eleAppBtn = document.getElementsByClassName('app_btn')[0],
    $elePlans = document.getElementsByClassName('plans')[0],
    $eleInputs = document.getElementsByTagName('input'),
    $eleLongPage = document.getElementById('long_page'),
    longPageHeiht = $elePlans.clientHeight;

$eleLongPage.setAttribute("data-height", longPageHeiht);
document.getElementsByClassName('page__inner')[0].style.height = longPageHeiht + 'px';

new PageSlider({
    pages: $('.page-wrap .page'),
    onbeforechange: function () {
        $eleAppBtn.style.display = 'none';
    },
    onchange: function () {
        if ($eleLongPage.classList.contains("current")) {
            $eleAppBtn.style.display = 'block';
        } else {
            $eleAppBtn.style.display = 'none';
        }
    }
});

// Fix - 移动设备上弹起输入框时，底部按钮浮动在输入框之上，解决方法是输入框获得焦点时隐藏按钮，失去焦点时显示按钮
$eleInputs[0].addEventListener("focus", function(){
    $eleAppBtn.style.display = 'none';
});

$eleInputs[0].addEventListener("blur", function(){
    $eleAppBtn.style.display = 'block';
});

$eleInputs[1].addEventListener("focus", function(){
    $eleAppBtn.style.display = 'none';
});

$eleInputs[1].addEventListener("blur", function(){
    $eleAppBtn.style.display = 'block';
});

window.addEventListener("resize", function(){
    if(window.innerHeight + 20 < _winHeight) {
        $eleAppBtn.style.display = 'none';
    }
    else {
        $eleAppBtn.style.display = 'block';
    }
});
