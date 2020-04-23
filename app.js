// code taken from my lecturer Mikhail https://github.com/mikhail-cct/CA1-In-class-Demo
//sanitisation taken from https://medium.com/@antonioramirezofficial/automatic-and-painless-sanitization-for-all-express-routes-ae24cbe653c8

var http = require('http'), //This module provides the HTTP server functionalities
    path = require('path'), //The path module provides utilities for working with file and directory paths
    express = require('express'), //This module allows this app to respond to HTTP Requests, defines the routing and renders back the required content
    fs = require('fs'), //This module allows to work witht the file system: read and write files back
    xmlParse = require('xslt-processor').xmlParse, //This module allows us to work with XML files
    xsltProcess = require('xslt-processor').xsltProcess, //The same module allows us to utilise XSL Transformations
    xml2js = require('xml2js'); //This module does XML to JSON conversion and also allows us to get from JSON back to XML
    expAutoSan = require('express-autosanitizer');//This module will us to add some security

var router = express(); //The set our routing to be handled by Express
var server = http.createServer(router); //This is where our server gets created

//To Get The item model schema
require('./models/db');

//Body Parser
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const Item = mongoose.model('Item');

router.use(express.static(path.resolve(__dirname, 'views'))); //We define the views folder as the one where all static content will be served
router.use(express.urlencoded({extended: true})); //We allow the data sent from the client to be coming in as part of the URL in GET and POST requests
router.use(express.json()); //We include support for JSON that is coming from the client
// code taken from https://medium.com/@antonioramirezofficial/automatic-and-painless-sanitization-for-all-express-routes-ae24cbe653c8
router.use(expAutoSan.allUnsafe);//some security added to the data coming from the user

// Function to read in XML file and convert it to JSON
function xmlFileToJs(filename, cb) {
  var filepath = path.normalize(path.join(__dirname, filename));
  fs.readFile(filepath, 'utf8', function(err, xmlStr) {
    if (err) throw (err);
    xml2js.parseString(xmlStr, {}, cb);
  });
}

//Function to convert JSON to XML and save it
function jsToXmlFile(filename, obj, cb) {
  var filepath = path.normalize(path.join(__dirname, filename));
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(obj);
  fs.writeFile(filepath, xml, cb);
}
//We define the root of our website and render index.html located inside the views folder
router.get('/', function(req, res){

    res.render('index');

})

//This is where we as the server to be listening to user with a specified IP and Port
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});