const fs = require('fs');
const express = require('express');

var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

const JSONdb = require('simple-json-db');
const db = new JSONdb(__dirname + '/guestbook.json');
const reqguest = new JSONdb(__dirname + '/stupid.json');

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

function getGenBoxContent () {
  return db.get("genbox");
}

app.get("/", function (req, res) {
  const index = __dirname + '/public/static/index.html';

  res.sendFile(index);
});

app.get("/general", function (req, res) {
  const general = __dirname + '/public/static/general.html';

  res.sendFile(general);
});

app.get("/redpills", function (req, res) {
  const redpills = __dirname + '/public/static/redpills.html';

  res.sendFile(redpills);
});

app.get("/request", function (req, res) {
  const request = __dirname + '/public/static/request.html';

  res.sendFile(request);
});

app.get("/genbox", function (req, res) {
  res.send(getGenBoxContent());
});

app.post("/genbox", function (req, res) {
  var username = req.body.username;
  const message = req.body.message;

  if (username === '' || username === null || username === undefined) {
    username = "Pharmacy Customer";
  }

  var post = `<div class="message">
  <h3><b>` + username + `</b></h3>
  <h4>` + message + `</h4>
  </div>`;

  var final_post = db.get("genbox") + post;

  db.set("genbox", final_post);
  res.redirect("/general");
});

http.listen(port, function(){
  console.log('listening on *:' + port);

  const genbox_fix_check = db.get("genbox");
  const genbox_quick_check = db.get("request");

  if (genbox_fix_check === null || genbox_fix_check === undefined || genbox_fix_check === '') {
    db.set("genbox", "<link href='https://thepharmacy.codesalvageon.repl.co/styles/external.css' rel='stylesheet'>");
    console.log("Fixed.");
  }
  else {
    console.log("No fix needed.");
    const genbox_content = db.get("genbox");
    console.log(genbox_content);
  }
  if (genbox_quick_check === null || genbox_fix_check === undefined || genbox_quick_check === '') {
    db.set("request", "<link href='https://thepharmacy.codesalvageon.repl.co/styles/external.css' rel='stylesheet'>");
    console.log("Fixed.");
  }
  else {
    console.log("No fix needed.");
  }
});