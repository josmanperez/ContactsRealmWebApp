const express = require('express');
const app = express();
const server = require('http').createServer(app);
const Realm = require("realm");
global.realmApp = new Realm.App({ id: "synctest-jigxx" });
global.myRealm;

global.io = require('socket.io')(server, {
	cors: {
		origin: '*'
	}
});
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const contacts = require('./routes/contacts');
app.use('/contacts', cors(), contacts);
const users = require('./routes/users');
app.use('/users', cors(), users);

app.get("/", cors(), function (req, res) {
	res.send("Contacts API");
});

// Sockets
io.on('connection', (socket) => {
	global.socket = socket;
	console.log('a client is connected');
});

// Main app
server.listen(5000, function () {
	console.log("app listening on port 5000");
});