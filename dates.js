var moment = require('moment-timezone')

var exports = module.exports = {}

/** Returns a Moment object representing the end of the current drought
 * monitor period. That date is the previous Tuesday */
function droughtMonMoment () {
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

    return searchDate
}

/** Returns a formatted date string representing the end of current drought 
 * monitor valid period (the previous Tuesday) */
exports.getDroughtMonDate = function() {
    var droughtDate = droughtMonMoment()    
    return droughtDate.format('YYYYMMDD')
}

/** Returns a formatted date string representing the issue date of the current 
 * drought monitor product (the previous Thursday) */
exports.getDroughtMonIssueDateStr = function() {
    var droughtDate = droughtMonMoment()
    droughtDate.add(2, 'days')
    return droughtDate.format('MM/DD/YYYY')
}

// QPF dates below

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

exports.getQPFStartDateStr = function() {
    var currentUTCHr = moment().tz('UTC').hour()

    if (currentUTCHr < 10) {
        return moment().tz('UTC').format('MM/DD/YYYY 00:00 [UTC]')
    } else if (currentUTCHr >= 22) {
        return moment().tz('UTC').add(1, 'days').format('MM/DD/YYYY 00:00 [UTC]')
    } else {
        return moment().tz('UTC').format('MM/DD/YYYY 12:00 [UTC]')
    }
}

exports.getQPFEndDateStr = function() {
    var currentUTCHr = moment().tz('UTC').hour()
    var startDate = moment().tz('UTC').add(5, 'days')

    if (currentUTCHr < 10) {
        return startDate.format('MM/DD/YYYY 00:00 [UTC]')
    } else if (currentUTCHr >= 22) {
        return startDate.add(1, 'days').format('MM/DD/YYYY 00:00 [UTC]')
    } else {
        return startDate.format('MM/DD/YYYY 12:00 [UTC]')
    }
}