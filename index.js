const path = require("path");
const express = require("express");
var bodyParser = require("body-parser");
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var analytics;
var a = 0,c = 0,g = 0;
var adobeCalls = {};
var convivaCalls = {};
var googleCalls = {};
var expressWs = require('express-ws')(app);
var paused = false;
var web;
var cur;

//set the template variables to be passed into home then into main.hbs 
app.get("/", (request, response) => {
  console.log("changed to main");
  cur = "main";
  response.sendFile(__dirname + "/pages/main.html");
});
app.get("/adobe", (request, response) => {
  console.log("changed to adobe");
  cur = "adobe";
  response.sendFile(__dirname + "/pages/adobe.html");
});
app.get("/conviva", (request, response) => {
  console.log("changed to conviva");
  cur = "conviva";
  response.sendFile(__dirname + "/pages/conviva.html");
});
app.get("/google", (request, response) => {
  console.log("changed to google");
  cur = "google";
  response.sendFile(__dirname + "/pages/google.html");
});

app.use(express.static(__dirname + "/images"));
app.use(express.static(__dirname + "/pages"));
app.use(express.static(__dirname + "/scripts"));

app.post("/adobe\*", function(request, response) {
  a++;
  analytics = parseAdobe(request.body);
  adobeCalls[a] = analytics;
  response.send('OK');
  if (!paused){ //dont send update call to the front end if live update is paused
    web.send("txt/" + analytics);
  }
});

app.post("/conviva\*", function(request, response) {
  c++;
  //analytics = parseAdobe(request.body); to do
  convivaCalls[c] = analytics;
  response.send('OK');
  if (!paused){ //dont send update call to the front end if live update is paused
    web.send("txt/" + analytics);
  }
});

app.post("/google\*", function(request, response) {
  var call = JSON.stringify(request.body);
  g++;
  //analytics = parseAdobe(request.body); to do
  googleCalls[g] = analytics;
  response.send('OK');
  if (!paused){ //dont send update call to the front end if live update is paused
    web.send("txt/" + analytics);
  }
});

function parseAdobe(analytic){
  var str = JSON.stringify(analytic)
    .split(",")
    .join("\n");
  str = str.toString().replace(/"/g, " ");
  str = str.replace("{", "").replace("}", "");
  return str;
}
function setWS(ws){
  web = ws;
}

app.listen(port, err => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on ${port}`);
});

var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 40510})
wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    //console.log('received: %s', message);
    if (message.includes('command')) {
      parseCommand(message);
      console.log('recieved command: ' + message);
    }  
  })
  setWS(ws);
})

function parseCommand(cmnd){
  var today = new Date();
  var path = 'exports/' + today.getFullYear() + '_' + today.getMonth() + '_' + today.getDate() + '_' + today.getHours() + '_' + today.getMinutes() + '_' + today.getMilliseconds() + ".txt";
  var keyArray;
  var valArray;
  switch(cur){
    case "adobe":
      keyArray = Object.keys(adobeCalls);
      valArray = adobeCalls;
      break;
    case "conviva":
      keyArray = Object.keys(convivaCalls);
      valArray = convivaCalls;
      break;
    case "google":
      keyArray = Object.keys(googleCalls);
      valArray = googleCalls;
      break;
  }
  const fs = require('fs');
  var words = cmnd.split("/");
  if (words[1] == 'select' && paused){
    var analytics = valArray[parseInt(words[2])];
    web.send("txt/" + analytics);
  }
  if (words[1] == 'radio'){
    paused = !paused; //pause the backend from sending live update to the front end
    if(paused){
      var str = 'select';
      for (var i = 0; i < keyArray.length; i++){
        str += '/' + keyArray[i];
      }
      web.send(str);
    }
  }else if (words[1] == 'exportAll'){
    var data = '';
    for (var key in valArray){
      data += valArray[key] + '\n \n \n \n';
    }
    fs.writeFile(path, data, (err) => { 
      // In case of a error throw err. 
      if (err) throw err; 
    });
  }else if (words[1] == 'exportCur'){
    var data = '';
    if(!paused){
      data = valArray[Object.keys(valArray)[Object.keys(valArray).length - 1]]
    }else{
      data =  valArray[words[2]]
    }
    fs.writeFile(path, data, (err) => { 
      // In case of a error throw err. 
      if (err) throw err; 
    });
  }else if (words[1] == 'clearAll'){
    valArray = {};
    keyArray.length = 0;
    web.send("txt/" + "");
    console.log(keyArray.length);
  }
}
