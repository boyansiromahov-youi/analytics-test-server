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
    name: array
  });
});
app.use(express.static(__dirname + "/images"));

app.post("/*", function(request, response) {
  console.log(JSON.stringify(request.body).replace(",", "<br>"));

  analytics = JSON.stringify(request.body)
    .split(",")
    .join("\n");
  array.push(analytics);
});

app.post("/trutv/xboxone/adobe", function(request, response) {
  //console.log(response);
  console.log(JSON.stringify(request.body).replace(",", "<br>"));
  analytics = JSON.stringify(request.body)
    .split(",")
    .join("\n");
});

app.listen(port, err => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on ${port}`);
});

/*
const http = require("http");

const hostname = "0.0.0.0";
const port = 3000;

const server = http.createServer((req, res) => {
  console.log(`\n${req.method} ${req.url}`);
  console.log(req.headers);
  var chunky = "";
  req.on("data", function(chunk) {
    console.log("BODY: " + chunk);
    chunky = chunk;
  });
  
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n" + chunky);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
*/
