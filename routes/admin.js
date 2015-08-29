var express = require('express');
var router = express.Router();

var dao = require('../dao/switchDao.js');

router.param('switch', function(req, res, next, switchName) {
  console.log('Loading switch from database')
  dao.getOne(switchName, function(err, existingSwitch) {
    if (err)
      return next(err)
    req.switch = existingSwitch
    console.log('Got switch [' + existingSwitch.name + ']')
    next()
  })
})

router.post('/create', function(req, res, next) {
  var newSwitch = {
    name: req.body.name,
    group : req.body.group,
    'switch' : req.body.switch
  }
  dao.create(newSwitch)
  res.redirect('/admin?action=created&switch=' + req.body.name)
})

router.post('/update/:switch', function(req, res, next) {
  req.switch.name = req.body.name
  req.switch.group = req.body.group
  req.switch.switch = req.body.switch
  dao.update(req.switch, function(err) {
    if (err)
      return next(err)
    res.redirect('/admin?action=updated&switch=' + req.body.name)
  })
})

router.get('/', function(req, res, next) {
  dao.getAll(function(err, switches) {
    if (err)
      return next(err)
    res.render('admin', {
      title: 'Remote Switch Server',
      switches: switches,
      action: req.query.action,
      switchName: req.query.switch
    })
  })
})

router.post('/delete/:switch', function(req, res, next) {
  console.log('Deleting [' + req.switch.name + ']')
  dao.remove(req.switch.name)
  res.redirect('/admin?action=deleted&switch=' + req.switch.name)
})

module.exports = router;
