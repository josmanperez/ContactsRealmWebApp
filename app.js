const express = require("express");
const Realm = require("realm");
const app = new Realm.App({ id: "synctest-jigxx" });

const Contact = {
  name: 'Contact',
  properties: {
    _id: 'objectId',
    _partition: 'string?',
    firstName: 'string',
    lastName: 'string',
  },
  primaryKey: '_id',
};

const app = express()

app.get("/", function(req, res){
	res.send("Hello World")
});

app.listen(5000, function() {
	console.log("app listening on port 3000")
});