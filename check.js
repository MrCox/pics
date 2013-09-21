var mongoose = require('mongoose'),
  db = mongoose.connect('mongodb://localhost/comics'),
  schema = mongoose.Schema,
  fs = require('fs');

var comic = schema({
  title: String,
  date: Number,
  hits: Number,
  issue: Number
});

var c = db.model('comic',comic);

fs.readdir('/root/pics/public/images/', function(err, files){
  if (!files) return;
  files.forEach(function(file){
    //don't do this
    var parts = file.split('.'),
      f = +parts[2];
    c.find({}, function(err, docs){
      var docs = docs.filter(function(d){return d.issue == f});
      if (!docs.length){
        var n = new c;
        //don't do this
        n.title = parts[0];
        n.issue = f;
        n.hits = 0;
        n.date = new Date().getTime();
        n.save(function(n, err){if (err) console.log(err)});
      };
    });
  });
});
