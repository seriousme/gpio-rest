var async = require('async');


var gpio;
if (process.env.PORT) {	
	gpio=require("./pi-gpio-stub");	// not running on a PI
  
}
else { 
	gpio=require("pi-gpio");
}
var hwPins=[7,11,12,13,15,16,18,22]; // Physical pins as listed at: https://www.npmjs.com/package/pi-gpio


function makeGpio(pin,i){
	return ({ 'id':i+1,'gpioPin':pin });
}

var gpios=hwPins.map(makeGpio);

function gpioToggle(gpioID){
    if (gpios[gpioID ]) {
      var hwPin = gpios[gpioID].gpioPin;
  		try {
  			async.series([
  				function ( cb ){
  					gpio.open(hwPin, "output");
  					cb(null);
  				},
  				function ( cb ){
  					gpio.write(hwPin, 1);
  					cb(null);
  				},
  				function ( cb ){
  					setTimeout(cb, 500);  //millisecs
  					cb();
  				},
  				function ( cb ){
  					gpio.write(hwPin, 0);
  					cb();
  				},
  				function ( cb ){
  					gpio.close(hwPin);
  					cb();
  				},
  				function ( cb ){
  					gpio.close(hwPin);
  					cb();
  				}],
  				function (err){
  					if (err){
  						throw err
  					}
  				}
  			);
  			return (gpios[gpioID]);
  		}
  		catch (e) {
  			return ({'error': "operation on hwpin " + hwPin + "failed: "} );
  		}
    }
    else {
      return ({ 'error' : "Invalid ID supplied"});
    }
};


function gpioList(){
    return({'gpios': gpios});
};

exports.gpioList = gpioList
exports.gpioToggle = gpioToggle