var express = require('express')
var morgan = require('morgan')
var app = express()

app.use(morgan('tiny'))
app.use('/static_data', express.static('static_data'))
app.use(express.static('static_web'))

app.set('port', (process.env.PORT || 8000));
app.listen(app.get('port'), () => {
    console.log("App started on port ", app.get('port'));
})