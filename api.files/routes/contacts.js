const express = require("express");
const BSON = require("bson");
const partitionValueString = "contacts";

var isListener = false;

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

const User = {
  name: 'Usuario',
  properties: {
    _id: 'string',
    _partition: 'string',
    name: 'string',
    providerType: 'string'
  },
  primaryKey: '_id',
};

const router = express.Router();

/**
 * Function to open a Realm and stores it globally
 * @returns An instance of Realm (anonymous or of the user logged in)
 */
async function openRealm() {
  var partition = "";
  if (realmApp.currentUser == null) {
    partition = "contacts";
  } else {
    partition = `user=${realmApp.currentUser.id}`;
  }
  console.log(`open a Realm for user with partition: ${partition}`);
  return await Realm.open({
    schema: [Contact, User],
    sync: {
      user: realmApp.currentUser,
      partitionValue: partition
    }
  });
}

/** Get Contacts List */ 
router.get('/', async (req, res) => {
  const contacts = await read(req.query.contacts).catch(err => {
    console.error("Failed to execute in:", err);
    res.status(400).send(`Failed to execute in ${err}`);
  });
  res.send(contacts);
});

// Add contact
router.post('/', async (req, res) => {
  if (!("firstName" in req.body) || !("lastName" in req.body)) {
    res.status(400).send("Missing firstName or lastName variables");
  } else {
    await save(req.body).catch(err => {
      console.error("Failed to save contact", err);
      res.status(400).send(`Failed to execute in ${err}`);
    })
    socket.emit("contact", "new contact created");
    res.status(201).send();
  }
});

// Update contact
router.put('/', async (req, res) => {
  if (!("firstName" in req.body) || !("lastName" in req.body) || !("_id" in req.body)) {
    res.status(400).send("Missing firstName, lastName or id variables");
  } else {
    await update(req.body).catch(err => {
      console.error("Failed to update contact", err);
    });
    socket.emit("contact", "contact updated");
    res.status(200).send();
  }
});

// Delete
router.delete('/', async (req, res) => {
  if (!("_id" in req.body)) {
    res.status(400).send("Missing id variable");
  } else {
    await remove(req.body).catch(err => {
      console.error("Failed to delete contact", err);
    })
    socket.emit("contact", "contact deleted");
    res.status(204).send();
  }
});

async function remove(body) {
  console.log("DETELE");
  await realmApp.logIn(new Realm.Credentials.anonymous());
  const realm = await Realm.open({
    schema: [Contact],
    sync: {
      user: realmApp.currentUser,
      partitionValue: partitionValueString
    }
  });
  let id = new BSON.ObjectID(body._id);
  const contact = realm.objectForPrimaryKey('Contact', id);
  realm.write(() => {
    realm.delete(contact);
  })
}

async function update(body) {
  console.log("UPDATE");
  await realmApp.logIn(new Realm.Credentials.anonymous());
  const realm = await Realm.open({
    schema: [Contact],
    sync: {
      user: realmApp.currentUser,
      partitionValue: partitionValueString
    }
  });
  let id = new BSON.ObjectID(body._id);
  const contact = realm.objectForPrimaryKey('Contact', id);
  const updatedContact = realm.write(() => {
    contact.firstName = body.firstName;
    contact.lastName = body.lastName;
  });
  return updatedContact;
}

async function save(body) {
  console.log("SAVE");
  await realmApp.logIn(new Realm.Credentials.anonymous());
  const realm = await Realm.open({
    schema: [Contact],
    sync: {
      user: realmApp.currentUser,
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

async function read(query) {
  console.log("READ");
  const realm = await openRealm();
  const contacts = realm.objects("Contact").sorted("firstName");
  console.log("listener: " + isListener)
  if (!(isListener)) {
    contacts.addListener(listener);
    isListener = true;
  } 
  return contacts;
};

function listener(contacts, changes) {
  changes.insertions.forEach((index) => {
    console.log(`insert index: ${index}`);
    let contact = contacts[index];
    console.log("new contact: " + contact);
    socket.emit("contact", "new contact created");
  });
  changes.modifications.forEach((index) => {
    console.log(`update index: ${index}`);
    let contact = contacts[index];
    console.log("updated contact: " + contact);
    socket.emit("contact", "contact updated");
  });
  changes.deletions.forEach((index) => {
    console.log(`deletion index: ${index}`);
    socket.emit("contact", "contact deleted");
  });
}

module.exports = router;