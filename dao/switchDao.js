var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://mongo:27017/switch-server'
//var url = 'mongodb://localhost:27017/switch-server'

function withDatabase(callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) return callback(err)
    console.log('Connected to server')
    callback(null, db)
  })
}

withDatabase(function(err, db) {
  console.log('Creating unique index on switch name')
  if (err) {
    console.error(err)
    return
  }
  db.collection('switches').createIndex({name: 1}, {unique: true})
})

module.exports = {
  create: function (newSwitch) {
    withDatabase(function(err, db) {
      if (err) return callback(err)
      var collection = db.collection('switches')
      collection.insert(newSwitch)
      db.close()
    })
  },

  getOne: function (name, callback) {
    withDatabase(function(err, db) {
      if (err) return callback(err)
      var collection = db.collection('switches')
      collection.findOne({name : name}, {}, function(err, existingSwitch) {
        console.log('Got switch ' + existingSwitch)
        callback(null, existingSwitch)
        //db.close()
      })
    })
  },

  getAll: function(callback) {
    withDatabase(function(err, db) {
      if (err) return callback(err)
      var collection = db.collection('switches')
      collection.find({}).toArray(function(err, switches) {
        if (err) return callback(err)
        console.log('Found the following switches')
        console.dir(switches)
        callback(null, switches)
        db.close()
      })
    })
  },

  update: function(existingSwitch, callback) {
    withDatabase(function(err, db) {
      if (err) return callback(err)
      var collection = db.collection('switches')
      collection.update({_id: existingSwitch._id}, existingSwitch)
      callback(null)
      db.close()
    })
  },

  remove: function(name, callback) {
    withDatabase(function(err, db) {
      if (err) return callback(err)
      var collection = db.collection('switches')
      collection.remove({name: name})
      db.close()
    })
  }
}
