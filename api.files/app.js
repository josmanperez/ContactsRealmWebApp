const express = require("express");
//const Realm = require("realm");
//const app = new Realm.App({ id: "synctest-jigxx" });

// const Contact = {
//   name: 'Contact',
//   properties: {
//     _id: 'objectId',
//     _partition: 'string?',
//     firstName: 'string',
//     lastName: 'string',
//   },
//   primaryKey: '_id',
// };

const app = express()

app.get("/", function(req, res){
	res.send("Hello World 2")
});

// async function handleLogin() {
//   // Create a Credentials object to identify the user.
//   // Anonymous credentials don't have any identifying information, but other
//   // authentication providers accept additional data, like a user's email and
//   // password.
//   const credentials = Realm.Credentials.anonymous();
//   // You can log in with any set of credentials using `app.logIn()`
//   const user = await app.logIn(credentials);
//   console.log(`Logged in with the user id: ${user.id}`);
// };

app.listen(5000, function() {
	console.log("app listening on port 5000")
	//handleLogin().catch(err => {
  //	console.error("Failed to log in:", err)
	//});
});

