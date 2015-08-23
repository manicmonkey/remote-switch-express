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
    next() //request stalls without this
  })
})

router.post('/create', function(req, res, next) {
  var newSwitch = {
    name: req.body.name,
    group : req.body.group,
    'switch' : req.body.switch
  }
  switchDao.create(newSwitch)
  res.redirect('/switches?action=created&switch=' + req.body.name)
})

router.post('/update/:switch', function(req, res, next) {
  req.switch.name = req.body.name
  req.switch.group = req.body.group
  req.switch.switch = req.body.switch
  switchDao.update(req.switch, function(err) {
    if (err)
      return next(err)
    res.redirect('/switches?action=updated&switch=' + req.body.name)
  })
})

router.get('/', function(req, res, next) {
  switchDao.getAll(function(err, switches) {
    if (err)
      return next(err)
    res.render('switches', { title: 'Switch listing', switches: switches, action: req.query.action, switchName: req.query.switch })
  })
})

router.get('/view/:switch', function(req, res, next) {
  console.log('Getting switch')
  console.dir(req.headers)
  res.render('switch', { title: 'Switch management', name: req.switch.name })
})

router.post('/switchOn/:switch', function(req, res, next) {
  console.dir(req.body)
  var existingSwitch = req.switch
  console.log('Switch [' + existingSwitch.name + '] on [' + switchOn + ']')
  console.dir(existingSwitch)
  switchService.on(existingSwitch.group, Number(existingSwitch.switch))
  res.redirect('/switches?action=switchedon&switch=' + req.switch.name)
})

router.post('/switchOff/:switch', function(req, res, next) {
  console.dir(req.body)
  var existingSwitch = req.switch
  console.log('Switch [' + existingSwitch.name + '] on [' + switchOn + ']')
  console.dir(existingSwitch)
  switchService.off(existingSwitch.group, Number(existingSwitch.switch))
  res.redirect('/switches?action=switchedoff&switch=' + req.switch.name)
})

router.post('/delete/:switch', function(req, res, next) {
  console.log('Deleting [' + req.switch.name + ']')
  switchDao.remove(req.switch.name)
  res.redirect('/switches?action=deleted&switch=' + req.switch.name)
})

module.exports = router;
