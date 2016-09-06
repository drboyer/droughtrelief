var express = require('express'),
    morgan = require('morgan'),
    redis = require('redis')
    Promise = require('bluebird'),
    toString = require('stream-to-string')

var Downloader = require('./Downloader'),
    dates = require('./dates')

// set up application objects
var app = express()
var dataDownloader = new Downloader()
// set up redis client
var redisClient = redis.createClient(process.env.REDIS_URL || 'redis://localhost/')
Promise.promisifyAll(redis.RedisClient.prototype)
redisClient.on('error', (err) => {
    console.log("Redis error: " + err)
})

// basic web app setup
app.use(morgan('tiny'))
app.use(express.static('static_web'))

app.set('port', (process.env.PORT || 8000));
app.listen(app.get('port'), () => {
    console.log("App started on port", app.get('port'));
})

/* Route handlers for datasets */

app.get('/qpf.geojson', (req, res) => {
    var qpf_key = 'qpf_' + dates.getQPFTarDate()

    redisClient.getAsync(qpf_key).then((result) => {
        if (result == null) {
            console.log('Downloading new QPF forecast data')
            dataDownloader.getQPFStream(res)
            updateRedisQPF()
        } else {
            console.log('Getting QPF data from Redis')
            res.end(result)
        }
    })
})

app.get('/drought.geojson', (req, res) => {
    var drought_key = 'drought_' + dates.getDroughtMonDate()

    redisClient.getAsync(drought_key).then((result) => {
        if (result == null) {
            console.log('Downloading new Drought Monitor data')
            dataDownloader.getDroughtMonStream(res)
            updateRedisDrought()
        } else {
            console.log('Getting Drought Monitor data from Redis')
            res.end(result)
        }
    })
})

/* Below are two helper functions used to update Redis with the new data
   and remove the outdated entries */

function updateRedisQPF() {
    var qpf_key = 'qpf_' + dates.getQPFTarDate()

    redisClient.keysAsync('qpf_*').then((replyKeys) => {
        replyKeys.forEach((replyKey, i) => {
            redisClient.delAsync(replyKey)
        })
    }).then( () => {
        dataDownloader.getQPFAsString()
        dataDownloader.on('qpfJSON-done', (data) => {
            redisClient.setAsync(qpf_key, data).then(() => {
                console.log('Added QPF data to Redis. Key: ' + qpf_key)
            })
        })
    })
}

function updateRedisDrought() {
    var drought_key = 'drought_' + dates.getDroughtMonDate()

    redisClient.keysAsync('drought_*').then((replyKeys) => {
        replyKeys.forEach((replyKey, i) => {
            redisClient.delAsync(replyKey)
        })
    }).then( () => {
        dataDownloader.getDroughtMonAsString()
        dataDownloader.on('droughtJSON-done', (data) => {
            redisClient.setAsync(drought_key, data).then(() => {
                console.log('Added QPF data to Redis. Key: ' + drought_key)
            })
        })
    })
}