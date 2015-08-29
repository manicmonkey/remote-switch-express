var express = require('express');
var router = express.Router();

var switchDao = require('../dao/switchDao.js')
var switchService = require('../services/switchService.js')

router.param('switch', function(req, res, next, switchName) {
  console.log('Loading switch from database')
  switchDao.getOne(switchName, function(err, existingSwitch) {
    if (err)
      return next(err)
    req.switch = existingSwitch
    console.log('Got switch [' + existingSwitch.name + ']')
    next()
  })
})

router.get('/', function(req, res, next) {
  switchDao.getAll(function(err, switches) {
    if (err)
      return next(err)
    res.render('index', {
      title: 'Remote Switch Server',
      switches: switches,
      action: req.query.action,
      switchName: req.query.switch
    })
  })
})

router.post('/switchOn/:switch', function(req, res, next) {
  console.dir(req.body)
  var existingSwitch = req.switch
  console.log('Switching on [' + existingSwitch.name + ']')
  console.dir(existingSwitch)
  switchService.on(existingSwitch.group, Number(existingSwitch.switch))
  res.redirect('/?action=switchedon&switch=' + req.switch.name)
})

router.post('/switchOff/:switch', function(req, res, next) {
  console.dir(req.body)
  var existingSwitch = req.switch
  console.log('Switching off [' + existingSwitch.name + ']')
  console.dir(existingSwitch)
  switchService.off(existingSwitch.group, Number(existingSwitch.switch))
  res.redirect('/?action=switchedoff&switch=' + req.switch.name)
})

module.exports = router;
