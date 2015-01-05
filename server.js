var express = require('express');

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('./public'));

app.get('/', function(req, res, next) {
    res.render('index');
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
