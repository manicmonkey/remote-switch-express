var express = require('express');
var router = express.Router();

var switchDao = require('../dao/switchDao.js')
var switchService = require('../services/switchService.js')

router.param('switch', function(req, res, next, switchName) {
  console.log('Loading switch from database')
  switchDao.getOne(switchName, function(err, existingSwitch) {
    if (err) {
      return next(err)
    }
    req.switch = existingSwitch
    next()
  })
})

router.post('/', function(req, res, next) {
  var newSwitch = {
    'name' : req.body.name,
    'group' : req.body.group,
    'switch' : req.body.switch
  }
  switchDao.create(newSwitch)
  res.sendStatus(204)
});

router.get('/', function(req, res, next) {
  switchDao.getAll(function(err, switches) {
    if (err) {
      res.sendStatus(500)
      return console.error(err)
    }
    res.send(switches)
  })
});

router.patch('/:switch', function(req, res, next) {
  console.dir(req.body)
  var existingSwitch = req.switch
  var switchOn = req.body.on
  console.log('Switch [' + existingSwitch.name + '] on [' + switchOn + ']')
  console.dir(existingSwitch)
  if (switchOn) {
    switchService.on(existingSwitch.group, Number(existingSwitch.switch))
  } else {
    switchService.off(existingSwitch.group, Number(existingSwitch.switch))
  }
  res.sendStatus(204)
});

module.exports = router;
