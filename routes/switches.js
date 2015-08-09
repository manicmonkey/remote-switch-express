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

/* GET switches listing. */
router.get('/', function(req, res, next) {
  res.send(switches);
});

router.post('/', function(req, res, next) {
  var newSwitch = {
    'name' : req.body.name,
    'group' : req.body.group,
    'switch' : req.body.switch
  }
  switches.push(newSwitch)
  res.sendStatus(204)
});

module.exports = router;
