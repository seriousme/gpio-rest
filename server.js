var host = process.env.IP || 'localhost';
var port = process.env.PORT || 8080;


var staticSite = __dirname + '/public';

// start the serial reader in the same process
//require('./readSerial');




//var gpio = require("pi-gpio");
var hwPins=[7,11,12,13,15,16,18,22] // Physical pins as listed at: https://www.npmjs.com/package/pi-gpio
var gpios={}
var gpioList=[]

var maxGpio=0 //relays are numbered from 1 to 8
for (var pin in hwPins) {
    maxGpio++
    gpios[maxGpio]={ 'id':maxGpio,'gpio_pin':hwPins[pin] }
    gpioList.push(maxGpio)
}

// open gpio's as input for starters


// write
// read
// setDirection
// 

//gpio.open(16, "output", function(err) {     // Open pin 16 for output 
//    gpio.write(16, 1, function() {          // Set pin 16 high (1) 
//        gpio.close(16);                     // Close pin 16 
//    });
//});


var express = require('express');
var app = express();


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/gpios')
    .get(function (req,res,next) {
        res.json({ 'gpios': gpioList })
    });

router.route('/gpios/:gpio_id')
    .get(function (req,res,next) {
        var gpio_id=req.params.gpio_id
        if (gpios[gpio_id ]) {
            res.json({ 'gpio': gpios[gpio_id ]})
        }
        else {
            res.json({ 'error' : "invalid GPIO id"})
        }
        
    })
    .put(function (req,res,next) {
        var gpio_id=req.params.gpio_id
        if (gpios[gpio_id ]) {
            res.json({ 'gpio': gpios[gpio_id ]})
        }
        else {
            res.json({ 'error' : "invalid GPIO id"})
        }
    });

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});


app.use('/', express.static(staticSite));
app.use('/api', router )

if (! process.env.C9_PID) {
    console.log('Running at http://'+ host +':' + port)
}
app.listen(port, function() { console.log('Listening')});
