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
  },
  primaryKey: '_id',
};

const router = express.Router();

// SignIn with Email/Password
router.post("/signin", async (req, res) => {
  if (!("email" in req.body) || !("pass" in req.body)) {
    res.status(400).send("Missing email/pass");
  } else {
    try {
      const user = await emailSignIn(req.body);
      res.status(200).send(`User id: ${user.id} logged in`);
    } catch (error) {
      console.error("Failed to log in", error.message);
      res.status(404).send(error.message);
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
  console.log(JSON.stringify(realmApp));
  if (realmApp.currentUser != null) {
    await realmApp.allUsers[realmApp.currentUser.id].logOut();
    return true;
  } else {
    return false;
  }
}

module.exports = router;