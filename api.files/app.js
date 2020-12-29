const express = require("express");
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());

const contacts = require('./routes/contacts');
app.use('/contacts', contacts);

app.get("/", cors(), function (req, res) {
	res.send("Contacts API");
});

app.listen(5000, function () {
	console.log("app listening on port 5000");
});

