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
//We define a new route /get/html to be rendering our HTML table that is being generated by applying XSL file to XML
router.get('/get/html', function(req, res) {

  //This is Section Category of Items
  var secOb=[
    {sec_n:0,sec:"Dairy Products"},
    {sec_n:1,sec:"Can Food"},
    {sec_n:2,sec:"Home"},
    {sec_n:3,sec:"Drinks"}
  ];

  //This method is used to find all record from MongoDB Altas
 Item.find((err,data)=>{
    if(!err){     
      var xmlStr="<tescostock>";
      for(var i=0;i<secOb.length;i++){
        var filter_sec_n=data.filter(function(v, ind) {
          return (v["sec"] == secOb[i].sec_n);
        });
        
        if(filter_sec_n.length>0){
          xmlStr+="<section name='"+secOb[i].sec+"' secid='"+secOb[i].sec_n+"'>";
          for(var j=0;j<filter_sec_n.length;j++){
            xmlStr+="<entree><sec_n>"+secOb[i].sec_n+"</sec_n><_id>"+filter_sec_n[j]._id+"</_id><item>"+filter_sec_n[j].item+"</item><price>"+filter_sec_n[j].price+"</price></entree>";
          }
          xmlStr+="</section>";
        }
      }

    xmlStr+="</tescostock>";      

    res.writeHead(200, {'Content-Type': 'text/html'}); //We are responding to the client that the content served back is HTML and the it exists (code 200)
    var xml =xmlStr; //fs.readFileSync('TescoStore.xml', 'utf8'); //We are reading in the XML file
    var xsl = fs.readFileSync('TescoStore.xsl', 'utf8'); //We are reading in the XSL file
    var doc = xmlParse(xml); //Parsing our XML file
    var stylesheet = xmlParse(xsl); //Parsing our XSL file
    var result = xsltProcess(doc, stylesheet); //Execute Transformation

    res.end(result.toString()); //We render the result back to the user converting it to a string before serving
    }
    else{
      console.log("Error on Data Fetch")
      res.end("");
    }
  })
});

  //Function to Add new record in MongoDB Altas 
  function updateRecord(req, res) {
    var item = new Item();
    item.sec = req.body.sec_n;
    item.item = req.body.item;
    item.price = req.body.price;
    req.body.sec=req.body.sec_n;
    Item.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
      if (!err)
        console.log("Updated Item");
      else
        console.log('Error during record update : ' + err);
    });
  }

  if(req.body._id!="")
  {
    //Update record to MongoDB Altas
  updateRecord(req,res);
  }
  else
  {
    //Insert record to MongoDB Altas
  insertRecord(req,res);
  }

  // Re-direct the browser back to the page, where the POST request came from
  res.redirect('back');

});

// POST request to delete record from mongodb Altas
router.post('/post/delete', function(req, res) {
  //Call this method and Delete record from mongDB Altas
  Item.findByIdAndRemove(req.body._id, (err, doc) => {
    if (!err) {
        console.log("item deleted "+req.body._id);
    }
    else { console.log('Error in item delete :' + err); }
  });
});

//This is where we as the server to be listening to user with a specified IP and Port
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});