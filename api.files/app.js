const express = require("express");
const BSON = require("bson");
const Realm = require("realm");
const app = new Realm.App({ id: "synctest-jigxx" });
const partitionValueString = "contacts"

const Contact = {
  name: 'Contact',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    firstName: 'string',
    lastName: 'string',
  },
  primaryKey: '_id',
};

const api = express()

api.get("/", function(req, res){
	res.send("Hello World")
});

async function run() {
	// Create a Credentials object to identify the user.
  // Anonymous credentials don't have any identifying information, but other
  // authentication providers accept additional data, like a user's email and
  // password.
  // You can log in with any set of credentials using `api.logIn()`
  let user = await app.logIn(new Realm.Credentials.anonymous());
  console.log(`Logged in with the user anonymous ${user.id}`);
  const realm = await Realm.open({
  	schema: [Contact],
  	sync: {
  		user: app.currentUser,
  		partitionValue: partitionValueString
  	}
  });
 	const contacts = realm.objects("Contact");
 	console.log(contacts);
	realm.write(() => {
	  const newContact = realm.create("Contact", {
	    _id: new BSON.ObjectID(),
	    _partition: partitionValueString,
	    firstName: "Prueba",
	    lastName: "Prueba",
	  });	
	});
};

api.listen(5000, function() {
	console.log("app listening on port 5000")
	run().catch(err => {
  	console.error("Failed to execute in:", err)
	});

});

