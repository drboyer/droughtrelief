var moment = require('moment-timezone')

var exports = module.exports = {}

exports.getDroughtMonDate = function() {
    var targetDay = 'Tue'
    var searchDate = moment().tz('UTC')
    var now = moment().tz('UTC') // current date

    while (searchDate.format('ddd') !== targetDay) {
        searchDate.subtract(1, 'days')
    }

    // drought monitor comes out about 1230z on Thursdays, so go back to previous week
    // if between Tuesday and Thursday 1230z
    var now_day = now.day()
    if (now_day == 2 || now_day == 3 || (now_day == 4 && now.hour() < 13)) {
        searchDate.subtract(1, 'week')
    }

    return searchDate.format('YYYYMMDD')
}

exports.getQPFTarDate = function() {
    var currentUTCHr = moment().tz('UTC').hour()

    if (currentUTCHr < 10) {
        return moment().tz('UTC').format('YYYYMMDD00')
    } else if (currentUTCHr >= 22) {
        return moment().tz('UTC').add(1, 'days').format('YYYYMMDD00')
    } else {
        return moment().tz('UTC').format('YYYYMMDD12')
    }
}

exports.getQPFShpDate = function() {
    var currentUTCHr = moment().tz('UTC').hour()

    if (currentUTCHr < 10) {
        return moment().tz('UTC').format('DD00')
    } else if (currentUTCHr >= 22) {
        return moment().tz('UTC').add(1, 'days').format('DD00')
    } else {
        return moment().tz('UTC').format('DD12')
    }
}