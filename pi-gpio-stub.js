"use strict";
function noop(){}

var gpio = {
	rev: 1,
	
	open: function(pinNumber, options, callback) {
		if(!callback && typeof options === "function") {
			callback = options;
			options = "out";
		}
		(callback || noop)();
	},

	setDirection: function(pinNumber, direction, callback) {
		(callback || noop)();
	},

	getDirection: function(pinNumber, callback) {
		(callback)(null, "out");
	},

	close: function(pinNumber, callback) {
		(callback || noop)();
	},

	read: function(pinNumber, callback) {
		(callback || noop)(null, 1);
	},

	write: function(pinNumber, value, callback) {
		(callback || noop)();
	}
};

gpio.export = gpio.open;
gpio.unexport = gpio.close;

module.exports = gpio;
