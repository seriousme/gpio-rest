var toggleTime = 500; //millisecs


var gpio;
if (! process.env.C9_PID) {
  gpio=require("pi-gpio");
}
else { 
  gpio=require("./pi-gpio-stub");
}
var hwPins=[7,11,12,13,15,16,18,22]; // Physical pins as listed at: https://www.npmjs.com/package/pi-gpio
var gpios={};
var gpioList=[];

var maxGpio=0; //relays are numbered from 1 to 8
for (var pin in hwPins) {
    maxGpio++;
    gpios[maxGpio]={ 'id':maxGpio,'gpioPin':hwPins[pin] };
    gpioList.push(maxGpio);
}

exports.gpioToggle = function gpioToggle(gpioID){
      if (gpios[gpioID ]) {
        var hwPin= gpios[gpioID].gpioPin;
        gpio.open(hwPin, "output", function(err) {    // Open pin for output 
          if (err) {
              return ({"error":"Opening hw pin " + hwPin + " failed"});
          }
          gpio.write(hwPin, 1, function( err) {           // Set pin high (1)
              if (err) {
                  return ({"error":"Setting pin " + hwPin + " failed"});
              }
              setTimeout(function (){                     // wait for toggleTime milliseconds and then execute
                  gpio.write(hwPin, 0, function() {       // Set pin low (0)
                      if (err) {
                          return ({"error":"Setting pin " + hwPin + " failed"});
                      }
                      gpio.close(hwPin);                  // Close pin 
                  });
              },toggleTime);
              });
        });
        return (gpios[gpioID]);
    }
    else {
      return ({ 'error' : "Invalid ID supplied"});
    }
};

exports.gpioList = function gpioList(){
    return({'gpios': gpios});
};
