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
  const contacts = await read().catch(err => {
    console.error("Failed to execute in:", err)
  });
  res.send(contacts);
})

// Add contact
router.post('/', async (req, res) => {
  console.log(req.body);
  if (!("firstName" in req.body) || (!("lastName" in req.body))) {
    res.status(400).send("Missing firstName or lastName variables");
  } else {
    await save(req.body).catch(err => {
      console.error("Failed to save contact", err);
    })
    socket.emit("contact", "new contact created");
    res.status(201).send();
  }
});

async function save(body) {
  await app.logIn(new Realm.Credentials.anonymous());
  const realm = await Realm.open({
    schema: [Contact],
    sync: {
      user: app.currentUser,
      partitionValue: partitionValueString
    }
  });
  realm.write(() => {
    const newContact = realm.create("Contact", {
      _id: new BSON.ObjectID(),
      _partition: partitionValueString,
      firstName: body.firstName,
      lastName: body.lastName,
    });
    return newContact;
  });
};

async function read() {
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
};

function listener(contacts, changes) {
  changes.insertions.forEach((index) => {
    let contact = contacts[index];
    console.log("new contact: " + contact);
    socket.emit("contact", "new contact created");
  });
  changes.modifications.forEach((index) => {
    let contact = contacts[index];
    console.log("updated contact: " + contact);
    socket.emit("contact", "contact updated");
  });
  changes.deletions.forEach((index) => {
    socket.emit("contact", "contact deleted");
  });
}

module.exports = router;