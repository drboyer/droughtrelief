// object used to download and convert the soruce data to GeoJSON
// each method takes an output (Writeable) stream as a parameter 
'use strict'
const EventEmitter = require('events').EventEmitter
var ftp = require('ftp'),
    req = require('request'),
    fs = require('fs'),
    toJSON = require('shp2json'),
    stream = require('stream'),
    toString = require('stream-to-string'),
    tar = require('tar-fs'),
    Promise = require('bluebird'),
    dates = require('./dates')

var downloader = class Downloader extends EventEmitter {
    constructor() {
        super()
    }

    getQPFStream(outStream) {
        // Get formatted dates
        var tarDate = dates.getQPFTarDate(),
            shpDate = dates.getQPFShpDate()

        var ftp_client = new ftp()
        Promise.promisifyAll(ftp_client)

        ftp_client.on('ready', () => {
            ftp_client.getAsync('shapefiles/qpf/5day/95e_' + tarDate + '.tar').then( (ftpStream) => {
                // if (err) throw err;
                ftpStream.once('close', () => { ftp_client.end() })
                ftpStream.pipe(tar.extract('./data'))
                .on('finish', () => {
                    console.log("Finished download and extraction")
                    this.emit('extract')

                    toJSON.fromShpFile('./data/95e' + shpDate + '.shp')
                        .pipe(outStream)
                })
            })
        })

        ftp_client.connect({ host: 'ftp.wpc.ncep.noaa.gov' })
    }

    getQPFAsString() {
        // Get formatted dates
        var tarDate = dates.getQPFTarDate(),
            shpDate = dates.getQPFShpDate()

        var ftp_client = new ftp()
        Promise.promisifyAll(ftp_client)

        ftp_client.on('ready', () => {
            ftp_client.getAsync('shapefiles/qpf/5day/95e_' + tarDate + '.tar').then( (ftpStream) => {
                // if (err) throw err;
                ftpStream.once('close', () => { ftp_client.end() })
                ftpStream.pipe(tar.extract('./data'))
                .on('finish', () => {
                    console.log("Finished download and extraction")
                    this.emit('extract')

                    var pass = new stream.PassThrough()
                    toJSON.fromShpFile('./data/95e' + shpDate + '.shp')
                        .pipe(pass)

                    toString(pass).then((data) => {
                        this.emit('qpfJSON-done', data)
                    })
                })
            })
        })

        ftp_client.connect({ host: 'ftp.wpc.ncep.noaa.gov' })
    }

    getDroughtMonStream(outStream) {
        var pass = new stream.PassThrough() 

        req('http://droughtmonitor.unl.edu/data/shapefiles_m/USDM_' + dates.getDroughtMonDate() + '_M.zip')
        .pipe(pass)

        toJSON(pass).pipe(outStream)
    }

    getDroughtMonAsString() {
        var passStream = new stream.PassThrough()  // pass through stream to go between getDroughtMonStream() and toString()
        this.getDroughtMonStream(passStream)
        
        toString(passStream).then((data) => {
            this.emit('droughtJSON-done', data)
        })
    }
}

module.exports = downloader;