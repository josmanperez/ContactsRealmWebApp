const express = require("express");

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
      const user = await signIn(req.body);
      res.status(200).send(`User id: ${user.id} logged in`);
    } catch (error) {
      console.error("Failed to log in", error.message);
      res.status(404).send(error.message);
    }
  }
});

// Logout
router.post("/logout", async (req, res) => {
  const success = await logOut();
  if (success) {
    res.status(200).send();
  } else {
    res.status(400).send("Can not log out the user");
  }
})

async function signIn(body) {
  console.log("SigIn");
  const credentials = Realm.Credentials.emailPassword(body.email, body.pass);
  try {
    const user = await realmApp.logIn(credentials);
    console.log("Successfully logged in!", user.id)
    return user;
  } catch (err) {
    throw err
  }
}

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