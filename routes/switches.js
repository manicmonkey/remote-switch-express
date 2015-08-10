var express = require('express');
var router = express.Router();

var switches = [{
      'name' : 'light',
      'group' : '11111',
      'switch' : 1
    }, {
      'name' : 'chair',
      'group' : '11111',
      'switch' : 2
    }]

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
//  switches.push(newSwitch)
  res.sendStatus(204)
});

module.exports = router;
