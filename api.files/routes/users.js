const express = require("express");
const {OAuth2Client} = require('google-auth-library');
require('dotenv').config();
const client = new OAuth2Client(process.env.CLIENT_ID);

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

/**
 * GET IF USER IS CONNECCTED
 */
router.get("/connected", async (req, res) => {
  console.log("Is user connected?");
  if (realmApp.currentUser == null) {
    console.log("no user connected");
    res.status(404).send("Not user connected");
  } else {
    const user = await read().catch(error => {
      console.error(error);
      res.status(400).send(error.message);
    });
    if (user != null) {
      console.log(`user ${user.name} is connected`);
      res.status(200).send(user)
     } else {
      res.status(404).send("User not found");
     } 
  }
});

/**
 * Read user information
 */
async function read() {
  const realm = await openRealm();
  return realm.objects("Usuario")[0];
};

// SignIn with Email/Password
router.post("/signin", async (req, res) => {
  if (!("email" in req.body) || !("pass" in req.body)) {
    res.status(400).send("Missing email/pass");
  } else {
    try {
      const user = await emailSignIn(req.body);
      res.status(200).send(`User id: ${user.id} logged in`);
    } catch (error) {
      console.error(error);
      if (error.code == -1) {
        // Create the user
        try {
          await registerEmailPassword(req.body);
          const user = await emailSignIn(req.body);
          res.status(200).send(`User id: ${user.id} logged in`);
        } catch (error) {
          console.error(error.message);
          res.status(400).send(error.message); 
        }
      } else {
        console.error("Failed to log in", error.message);
        res.status(404).send(error.message);
      }
    }
  }
});

async function emailSignIn(body) {
  console.log("Email/Pass SigIn");
  const credentials = Realm.Credentials.emailPassword(body.email, body.pass);
  try {
    const user = await realmApp.logIn(credentials);
    console.log("Successfully logged in!", user.id)
    return user;
  } catch (err) {
    throw err
  }
}

async function registerEmailPassword(body) {
  console.log("Register email/password");
  await realmApp.emailPasswordAuth.registerUser(body.email, body.pass)
  .catch(error => {
    throw error
  });
}

// SignIn with Google
router.post("/signin/google", async (req, res) => {
  if (!("id_token" in req.body)) {
    res.status(400).send("Missing id_token")
  } else {
    const token = req.body.id_token;
    // Validate the integrity of the token
    verify(token).catch(error => {
      console.error(error);
      res.status(400).send(error.message);
    });
    try {
      const user = await googleSingIn(token);
      res.status(200).send(`User id: ${user.id} logged in`);
    } catch (error) {
      console.error("Failed to log in", error.message);
      res.status(404).send(error.message);
    }
  }
});

async function googleSingIn(token) {
  console.log("Google SigIn")
  const credentials = Realm.Credentials.google(token);
  return await realmApp.logIn(credentials).then(user => {
    console.log(`Logged in with id: ${user.id}`);
    return user;
  }).catch(error => {
    throw error;
  });
}

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
  });
  console.log(ticket);
  const payload = ticket.getPayload();
  const userid = payload['sub'];
}

// Logout
router.post("/logout", async (req, res) => {
  const success = await logOut();
  if (success) {
    res.status(200).send();
  } else {
    res.status(400).send("Can not log out the user");
  }
});

async function logOut() {
  console.log("LogOut");
  if (realmApp.currentUser != null) {
    await realmApp.currentUser.logOut();
    return true;
  } else {
    return false;
  }
}

module.exports = router;