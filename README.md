# Remote Control Switch Server

Express.js based app for controlling remote control sockets

MVC style frontend utilizing Jade for creating, viewing, updating and deleting switches

REST API with CRUD and the abilty to switch lights on / off by name

MongoDB backend

The 'send' command which is part of rcswitch-pi can be used to test basic connectivity with the remote control switch

433mhz transmitter wired in to following pins (RPi 1 model B)
PWR -> Pin 2
GND -> Pin 6
DATA -> Pin 11

# Dependencies

- [WiringPi](https://github.com/WiringPi/WiringPi)
- [RCSwitch-Pi](https://github.com/r10r/rcswitch-pi)
- [Node-RCSwitch](https://github.com/marvinroger/node-rcswitch)

# References

I came across [this blog post[(https://blog.codecentric.de/en/2013/03/home-automation-with-angularjs-and-node-js-on-a-raspberry-pi) which does a good job of describing a similar project.

[This](https://www.raspberrypi.org/documentation/usage/gpio/) is a useful GPIO pin reference.