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
    name: req.body.name,
    group : req.body.group,
    'switch' : req.body.switch
  }
  switchDao.create(newSwitch)
  res.sendStatus(204)
})

router.get('/', function(req, res, next) {
  switchDao.getAll(function(err, switches) {
    if (err) {
      res.sendStatus(500) //todo send error page
      return next(err)
    }

    if (req.accepts('html')) {
      res.render('switches', { title: 'Switch listing', switches: switches })
      return
    }

    if (req.accepts('json')) {
      res.send(switches)
      return
    }

    res.sendStatus(406)
  })
})

router.get('/:switch', function(req, res, next) {
  console.log('Getting switch')
  console.dir(req.headers)
  if (req.accepts('html')) {
    res.render('switch', { title: 'Switch management', name: req.switch.name })
    return
  }

  if (req.accepts('json')) {
    res.send(req.switch)
    return
  }

  console.log("Content type not supported")
  res.sendStatus(406)
})

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
