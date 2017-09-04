import {utils} from './utils'

var report = {
    clickStat: function (eventId) {
        setTimeout(function () {
            var MtaH5 = window.MtaH5;
            MtaH5 && MtaH5.clickStat && MtaH5.clickStat(eventId);
        }, 0);
    }
};

export { report }