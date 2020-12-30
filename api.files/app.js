const app = require("express")();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
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

server.listen(5000, function () {
	console.log("app listening on port 5000");
});

io.on('connection', (socket) => {
	console.log('a user connected');
});