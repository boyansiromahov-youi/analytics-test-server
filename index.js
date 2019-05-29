const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var analytics;
var array = [];
var expressWs = require('express-ws')(app);
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
app.get("/", (request, response) => {
  response.render("home", {
    analytics: array,
    appium: <var>
  });
});
app.use(express.static(__dirname + "/images"));

app.post("/*", function(request, response) {
  console.log(JSON.stringify(request.body).replace(",", "<br>"));
  analytics = JSON.stringify(request.body)
    .split(",")
    .join("\n");
  array.push(analytics);
  response.send('OK');
  web.send(analytics);
});

function setWS(ws){
  web = ws;
}

app.post("/trutv/xboxone/adobe", function(request, response) {
  //console.log(response);
  console.log(JSON.stringify(request.body).replace(",", "<br>"));
  analytics = JSON.stringify(request.body)
    .split(",")
    .join("\n");
  ws.send(analytics); //TODO need to add check that websocket is active
});

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
    console.log('received: %s', message)
  })
  setWS(ws);
  /*
  setInterval(
    () => ws.send(analytics),
    1000
  )
  */
  
})
