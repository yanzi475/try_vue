

var constants = {
    VIRTUAL_DOMAIN: 'www.webank.com',
    // 生产环境 下载页面（不能用https，因为页面里面的MTA脚本使用的是 http 协议）
    DOWNLOAD_PAGE_URL: 'http://www.webank.com/app/common/bridge-download/index.html',
    // 测试环境 下载页面
    DOWNLOAD_PAGE_URL_FOR_TEST: 'http://sit-hjdata.webank.com/k/common/bridge-download/index.html',
};


export {constants}