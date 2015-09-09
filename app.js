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
  consumerKey: process.env.X_CONSUMER_KEY,
  consumerSecret: process.env.X_CONSUMER_SECRET,
  privateKey: fs.readFileSync('./keys/privatekey.pem')
};
var hellosignCredentials = {
  HELLOSIGN_KEY: process.env.HELLOSIGN_KEY
};
var dates = require('./dates.js');

var hellosign = require('@eda/hellosign-facade')(hellosignCredentials);
var xero = require('@eda/xero-facade')(xeroCredentials);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


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

//change to post
app.get('/newcontact',function(req,res){
  //Get contact from relate - Simulating a post request being made to this route
  relate.getContact("omalley.kerwin@gmail.com", function(response){
    var id  = response.objects[0].id;
    // this is really fragile, for some reason this contact has 3 names?
    var name = (response.objects[0].properties.name[3].value).split(" ");
    //this needs a method to pull it from relate IQ
    //Issue with the formatting of the date in my dates.js file
    var cohortYear = "2016";
    var cohortName = "Kakapo";
    var cohortDates = dates[cohortYear][cohortName];

    var firstName = name[0];
    var lastName = name[1];
    var email = "kerwin@enspiral.com";
    var contactToCreate = {
      firstName: firstName,
      lastName: lastName,
      emailAddress: email,
      relateId: id
    };
    var hellosignStudent = {
      name: firstName + lastName,
      email: email,
    };

    // xero.createContact(contactToCreate,
    //   function(err){
    //     console.log(err);
    //   },
    //   function(response){
    //     console.log(response);
    //   }
    // );
    hellosign.signTemplate("terms", hellosignStudent, function(response){
      console.log(response);
    });
  });
});

app.get('/studentlist', function (req,res){
  var studentListId = "55a70228e4b01fe8e5a3d93b";
  relate.getListItems(studentListId,function(response){

  });
});
