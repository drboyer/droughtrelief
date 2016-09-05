var express = require('express')
var morgan = require('morgan')
var Downloader = require('./Downloader')

var app = express()
var dataDL = new Downloader()

app.use(morgan('tiny'))
// app.use('/static_data', express.static('static_data'))
app.use(express.static('static_web'))

app.get('/qpf.geojson', (req, res) => {
    dataDL.getQPFStream(res)
})

app.get('/drought.geojson', (req, res) => {
    dataDL.getDroughtMonStream(res)
})

app.set('port', (process.env.PORT || 8000));
app.listen(app.get('port'), () => {
    console.log("App started on port", app.get('port'));
})