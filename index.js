const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var analytics;
var n = 0;
var callsDict = {};
var expressWs = require('express-ws')(app);
var paused = false;

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "pages")
  })
);

app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "pages"));
//set the template variables to be passed into home then into main.hbs 
app.get("/", (request, response) => {
  response.render("home", {
    calls: callsDict
  });
});

app.use(express.static(__dirname + "/images"));
app.use(express.static(__dirname + "/pages"));

//post event handler
app.post("/*", function(request, response) {
  //console.log(JSON.stringify(request.body).replace(",", "<br>"));
  analytics = JSON.stringify(request.body)
    .split(",")
    .join("\n");
  n++;
  callsDict[n] = analytics;
  response.send('OK');
  if (!paused){ //dont send update call to the front end if live update is paused
    web.send("txt/" + analytics);
  }
});

function setWS(ws){
  web = ws;
}

// app.post("/trutv/xboxone/adobe", function(request, response) {
//   //console.log(response);
//   console.log(JSON.stringify(request.body).replace(",", "<br>"));
//   analytics = JSON.stringify(request.body)
//     .split(",")
//     .join("\n");
// //TODO need to add check that websocket is active
// });

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
  /*
  setInterval(
    () => ws.send(analytics),
    1000
  )
  */
})

function parseCommand(cmnd){
  const fs = require('fs');
  var keyArray = Object.keys(callsDict);
  var words = cmnd.split("/");
  if (words[1] == 'select' && paused){
    var analytics = callsDict[parseInt(words[2])];
    web.send("txt/" + analytics);
  }
  if (words[1] == 'radio'){
    paused = !paused; //paused the backend from sending live update to the front end
    if(paused){
      var str = 'select';
      for (var i = 0; i < keyArray.length; i++){
        str += '/' + keyArray[i];
      }
      console.log(str);
      web.send(str);
    }
  }else if (words[1] == 'exportAll'){
    var data = '';
    var today = new Date();
    var path = 'exports/' + today.getFullYear() + today.getMonth() + today.getDate() + today.getHours() + today.getMinutes() + ".txt";
    for (var key in callsDict){
      data += callsDict[key] + '\n \n \n \n';
    }
    fs.writeFile(path, data, (err) => { 
      // In case of a error throw err. 
      if (err) throw err; 
    });
  }else if (words[1] == 'exportCur'){
    var data;
    if(!paused){
      data = callsDict[Object.keys(callsDict)[Object.keys(callsDict).length - 1]]
    }else{
      data =  callsDict[words[2]]
    }
    console.log(data);
    fs.writeFile(path, data, (err) => { 
      // In case of a error throw err. 
      if (err) throw err; 
    });
  }
}
