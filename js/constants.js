

var constants = {
    VIRTUAL_DOMAIN: 'www.google.com.hk',
    // 生产环境 下载页面（不能用https，因为页面里面的MTA脚本使用的是 http 协议）
    DOWNLOAD_PAGE_URL: 'http://www.google.com.hk',
    // 测试环境 下载页面
    DOWNLOAD_PAGE_URL_FOR_TEST: '',
};


export {constants}
