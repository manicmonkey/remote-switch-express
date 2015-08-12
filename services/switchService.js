var rcswitch = require('rcswitch');
var rcswitchDataPin = 0;
rcswitch.enableTransmit(rcswitchDataPin)

module.exports = {
  // Switch socket on - requires group pin (string) and switch (number)
  on: function(group, switchNumber) {
    rcswitch.switchOn(group, switchNumber)
  },
  // Switch socket off - requires group pin (string) and switch (number)
  off: function(group, switchNumber) {
    rcswitch.switchOff(group, switchNumber)
  }
}
