var expect = require("chai").expect;
var request = require("request");
require('dotenv').load();
var hellosignCredentials = {
  apiKey: process.env.HELLOSIGN_KEY
};
var hellosign = require('@eda/hellosign-facade')(hellosignCredentials);

describe('something',function(){

  it("does",function(done){
    this.timeout(5000);
    var tester = {
            email: "kerwin@enspiral.consumerSecret",
            name: "Kerwin"
          };

    hellosign.signTemplate(tester,function(response){
      console.log(response);
      done();
    });
  });
});
