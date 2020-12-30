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

const router = express.Router();

// Get Contacts List
router.get('/', async (req, res) => {
  const contacts = await run().catch(err => {
    console.error("Failed to execute in:", err)
  });
  res.send(contacts);
})

async function run() {
  // Create a Credentials object to identify the user.
  // Anonymous credentials don't have any identifying information, but other
  // authentication providers accept additional data, like a user's email and
  // password.
  // You can log in with any set of credentials using `api.logIn()`
  const user = await app.logIn(new Realm.Credentials.anonymous());
  console.log(`logged in with user ${user.id}`);
  const realm = await Realm.open({
    schema: [Contact],
    sync: {
      user: app.currentUser,
      partitionValue: partitionValueString
    }
  });
  const contacts = realm.objects("Contact");
  contacts.addListener(listener);
  return contacts;
  // realm.write(() => {
  //   const newContact = realm.create("Contact", {
  //     _id: new BSON.ObjectID(),
  //     _partition: partitionValueString,
  //     firstName: "Prueba",
  //     lastName: "Prueba",
  //   });	
  // });
};

function listener(contacts, changes) {
  changes.insertions.forEach((index) => {
    let contact = contacts[index];
    console.log("new contact: " + contact);
    io.on("connection", (socket) => {
      socket.emit("hello", contact);
    });
  })
}

module.exports = router;