var express = require('express'),
  http = require('http'),
  mongoose = require('mongoose'),
  path = require('path'),
  dir = require('chokidar'),
  fs = require('fs'),
  db = mongoose.connect('mongodb://localhost/comics'),
  app = express(),
  schema = mongoose.Schema,
  cpath = '/root/pics/public/comics/';

var comic = new schema({
  title: String,
  date: Number,
  hits: Number,
  issue: Number,
  path: String
}), c = db.model('comic', comic);

var watcher = dir.watch(cpath, 
  {ignored:/^\./, ignoreInitial: true, persistent: true});

watcher.on('add', function(p, stats){
  fs.readdir(cpath, function(err, files){
    var n = new c;
    n.title = path.basename(p);
    n.issue = files.length;
    n.hits = 0;
    n.date = stats.atime.getTime();
    n.save(function(n, err){if (err) throw err;});
  });
});

app.configure(function() {
  app.set('port', process.env.PORT || 80);
  app.set('views','./views');
  app.set('views','./views');
  app.set('view engine', 'jade');
  app.use(app.router);
  app.use('/public', express.static(__dirname+'/public'));
});

c.find({}, function(err, docs){
  console.log(docs)
});

app.get('/', function(req, res){
  //res.render('layout.jade', {pageTitle:'test'});
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('listening on port ' + app.get('port'));
});
