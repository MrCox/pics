var express = require('express'),
  http = require('http'),
  mongoose = require('mongoose'),
  path = require('path'),
  dir = require('chokidar'),
  fs = require('fs'),
  db = mongoose.connect('mongodb://localhost/comics'),
  app = express(),
  schema = mongoose.Schema,
  cpath = '/root/pics/public/comics/',
  newest;

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
      n.save(function(err, n){if (err) console.log(err);});
      newest = n.title;
    });
  }).on('unlink', function(p, stats){
    c.findOne({'title':path.basename(p)}, function(err, doc){
      doc.remove();
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

c.findOne().sort({'issue':-1}).exec(function(err, doc){
  newest = doc && doc.title;
});

app.get('/', function(req, res){
  res.sendfile(cpath + newest);
  c.findOne({'title':newest}, function(err, doc){
    res.render('layout.jade', {pageTitle:newest, data: doc});
    doc.hits = doc.hits + 1;
    doc.save();
  });
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('listening on port ' + app.get('port'));
});
