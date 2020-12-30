const app = require("express")();
const server = require('http').createServer(app);
global.io = require('socket.io')(server, {
	cors: {
		origin: '*'
	}
});
const cors = require('cors');

// Middleware
app.use(cors());

const contacts = require('./routes/contacts');
app.use('/contacts', contacts);

app.get("/", cors(), function (req, res) {
	res.send("Contacts API");
});

// Sockets
io.on('connection', (socket) => {
	console.log('a client is connected');
	setTimeout(function() {
		console.log("Hola despues de 3 seg");
		socket.emit("hello", "Después de 3 seg");
	}, 3000);
});

// Main app
server.listen(5000, function () {
	console.log("app listening on port 5000");
});