var express = require('express'),
  app = express(),
  http = require('http'),
  mongoose = require('mongoose'),
  db = mongoose.connect('mongodb://localhost/comics'),
  schema = mongoose.Schema;

var comic = new schema({
  title: String,
  date: Number,
  hits: Number,
  issue: Number
});

var c = db.model('comic', comic);

c.find({'title':'test'}, function(err, docs){
});

app.configure( function() {
  app.set('port', process.env.PORT || 80);
  app.set('views','./views');
  app.set('views','./views');
  app.set('view engine', 'jade');
  app.use(app.router);
  app.use('/public', express.static(__dirname+'/public'));
})
app.get('/', function(req, res){
  res.render('layout.jade', {pageTitle:'test'});
})

http.createServer(app).listen(app.get('port'), function() {
  console.log('listening on port ' + app.get('port'));
})
