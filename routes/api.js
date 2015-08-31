var express = require('express');
var router = express.Router();

var switchDao = require('../dao/switchDao.js');
var switchService = require('../services/switchService.js');

//enable cors for editor.swagger.io
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://editor.swagger.io");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/', function(req, res, next) {
  switchDao.getAll(function(err, switches) {
    if (err)
      return next(err);
    res.send(switches);
  });
});

router.post('/', function(req, res, next) {
  var newSwitch = {
    name: req.body.name,
    group : req.body.group,
    'switch' : req.body.switch
  };
  switchDao.create(newSwitch, function(err) {
    if (err)
      return next(err);
    res.sendStatus(204);
  });
});

router.param('switch', function(req, res, next, switchName) {
  console.log('Loading switch from database');
  switchDao.getOne(switchName, function(err, existingSwitch) {
    if (err)
      return next(err);
    req.switch = existingSwitch;
    console.log('Got switch [' + existingSwitch.name + ']');
    next(); //request stalls without this
  });
});

router.get('/:switch', function(req, res, next) {
  console.log('Getting switch');
  console.dir(req.headers);
  res.send(req.switch);
});

router.post('/:switch', function(req, res, next) {
  req.switch.name = req.body.name;
  req.switch.group = req.body.group;
  req.switch.switch = req.body.switch;
  switchDao.update(req.switch, function(err) {
    if (err)
      return next(err);
    res.sendStatus(204);
  });
});

router.delete('/:switch', function(req, res, next) {
  console.log('Deleting [' + req.switch.name + ']');
  switchDao.delete(req.switch.name, function(err) {
    if (err)
      return res.next(err);
    res.sendStatus(204);
  })
});

router.patch('/:switch', function(req, res, next) {
  console.log('Handling patch');
  console.dir(req.body);
  var existingSwitch = req.switch;
  var switchOn = req.body.on;
  console.log('Switch [' + existingSwitch.name + '] on [' + switchOn + ']');
  console.dir(existingSwitch);
  if (switchOn) {
    switchService.on(existingSwitch.group, Number(existingSwitch.switch));
  } else {
    switchService.off(existingSwitch.group, Number(existingSwitch.switch));
  }
  res.sendStatus(204);
});

module.exports = router;
