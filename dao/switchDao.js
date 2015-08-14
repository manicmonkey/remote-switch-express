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

module.exports = {
  create: function (newSwitch) {
    withDatabase(function(err, db) {
      if (err)
        return callback(err)
      var collection = db.collection('switches')
      collection.insert(newSwitch)
      db.close()
    })
  },

  getOne: function (name, callback) {
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
  },

  getAll: function(callback) {
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
}