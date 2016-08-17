var express = require('express')
var morgan = require('morgan')
var app = express()

app.use(morgan('tiny'))
app.use('/static_data', express.static('static_data'))
app.use(express.static('static_web'))

app.listen(8000, () => {
    console.log("App started on port 8000");
})