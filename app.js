var express = require('express');
var app = express();
require('dotenv').load();
var fs = require('fs');
var relateCredentials = {
  user: process.env.R_APIKEY,
  pass:process.env.R_APISECRET,
  sendImmediately: true
};
var relate = require('@eda/relate-facade')(relateCredentials);
var xeroCredentials = {
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  privateKey: fs.readFileSync('./keys/privatekey.pem')
};
var xero = require('@eda/xero-facade')(xeroCredentials);


var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var hellosign = require('@eda/hellosign-facade');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started on port: ' + port);
});

app.get('/',function(res,req){

});

app.get('/newcontact',function(req,res){
  //Get contact from relate - Simulating a post request being made to this route
  console.log(relateCredentials);
  relate.getContact("omalley.kerwin@gmail.com", function(response){
    // console.log(response);
    console.log(response.objects[0].properties.address[0].value);
    console.log(response.objects[0].properties.phone[0].value);
    //name
    console.log(response.objects[0].properties.name[0].value);
    //email
    console.log(response.objects[0].properties.email[0].value);
  });
  //Create contact in Xero - set contact number as the relateiq id
});
