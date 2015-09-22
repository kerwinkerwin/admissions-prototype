var express = require('express');
var testObject = require('./test.js')();
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
  apiKey: process.env.HELLOSIGN_KEY
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
app.disable('etag');

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
  req.send("hello");
});

//change to post
app.get('/newcontact',function(req,res){
});

app.get('/onboard', function (req,res){
  relate.studentsToOnboard(function(response){
    response.forEach(function(student){
      var studentDetails = {
        contactId: student.contactIds[0],
        email: (student.fieldValues['138'][0].raw),
        name: (student.name),
        relateId: student.contactIds[0]
      };

      hellosign.signTemplate(studentDetails,
      function(response){
        if(response.statusCode === 200){
          var updateItem = {
            fieldValues:{
              ////this is a test id, waiting on an actual field from malcolm
              '64':[
                {
                  "raw": "yay"
                }
              ]
            }
          };
          relate.updateStudentList(student.id,updateItem, function(response){
            res.status(200).json("all worked");
          });
        }
        else{
          console.log(response);
        }
      });

      xero.createContact(studentDetails,
        function(err){
          console.log(err);
        },
        function(xeroResponse){
        //update relateiq field with xero id
        studentDetails.contactId = xeroResponse.Response.Contacts.Contact.ContactID;
          xero.createAnInvoice(studentDetails,
            function(err){
              console.log(err);
            },
            function(success){
              console.log("success");
              console.log(success.Response.Invoices.Invoice);
              //
              // Update relateiq fields with date invoice was drafted
            }
          );
        // send off invoice
      });
    });
  });

  //need the dates from somewhere, maybe a separate date npm?
  //get cohortDate, if confirmed cohort, check cohort date npm
  // and retrieve date.
});
