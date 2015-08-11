var express = require('express');
var router = express.Router();

var rcswitch = require('rcswitch');
var rcswitchDataPin = 0;
var canTransmit = rcswitch.enableTransmit(rcswitchDataPin)
console.log('Can transmit: ' + canTransmit)

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/switch-server'

function withDatabase(callback) {
  MongoClient.connect(url, function(err, db) {
    if (err)
      return callback(err)
    console.log('Connected to server')
    callback(null, db)
  })
}

function insertSwitch(aSwitch) {
  withDatabase(function(err, db) {
    if (err)
      return callback(err)
    var collection = db.collection('switches')
    collection.insert(aSwitch)
    db.close()
  })
}

function getSwitch(name, callback) {
  withDatabase(function(err, db) {
    if (err)
      return callback(err)
    var collection = db.collection('switches')
    collection.findOne({'name' : name}, {}, function(err, existingSwitch) {
      console.log('Got switch ' + existingSwitch)
      callback(null, existingSwitch)
      db.close()
    })
  })
}

function listSwitches(callback) {
  withDatabase(function(err, db) {
    if (err)
      return callback(err)
    var collection = db.collection('switches')
    collection.find({}).toArray(function(err, switches) {
      if (err)
        return callback(err)
      console.log('Found the following switches')
      console.dir(switches)
      callback(null, switches)
      db.close()
    })
  })
}

/* GET switches listing. */
router.get('/', function(req, res, next) {
  listSwitches(function(err, switches) {
    if (err) {
      res.sendStatus(500)
      return console.error(err)
    }
    res.send(switches)
  })
});

router.post('/', function(req, res, next) {
  var newSwitch = {
    'name' : req.body.name,
    'group' : req.body.group,
    'switch' : req.body.switch
  }
  insertSwitch(newSwitch)
  res.sendStatus(204)
});

router.patch('/:name', function(req, res, next) {
  var switchName = req.params.name
  console.log('Patching [' + switchName + ']')
  var switchOn = req.body.on
  console.dir(req.body)
  console.log('Switch on [' + switchOn + ']')
  getSwitch(switchName, function(err, existingSwitch) {
    if (err)
      return console.err(err)
    console.log('Working on switch: ' + existingSwitch)
    if (switchOn) {
      console.log('Switching on group[' + existingSwitch.group + '] switch[' + existingSwitch.switch + ']')
      rcswitch.switchOn(existingSwitch.group, Number(existingSwitch.switch))
    } else {
      console.log('Switching off')
      rcswitch.switchOff(existingSwitch.group, Number(existingSwitch.switch))
    }
  })
  res.sendStatus(204)
});

module.exports = router;
