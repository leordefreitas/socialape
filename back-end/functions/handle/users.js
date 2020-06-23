const { db } = require('../util/admin');
const { validateUsersSignUp, validateUsersLogin } = require('../util/validates');
const firebase = require('firebase');

// TO CREATE NEW USER
exports.createUser = (req, res) => {
  const newUser = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    whatsapp: req.body.whatsapp
  };

  const { valid, validationErrorsCreateUser } = validateUsersSignUp(newUser);
  if (!valid) res.status(400).json(validationErrorsCreateUser);

// validating information
  let token = null;
  let userId = null;
  db.doc(`/users/${newUser.email}`).get()
  .then(doc => {
    if (doc.exists) {
      return res.status(400).json({email: `This email already exists`});
    } else {
      return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
    }
  })
  .then((data) => {
    userId = data.user.uid;
    return data.user.getIdToken();
  })
  // puting user to data
  .then((idToken) => {
    token = idToken;
    const userCredentials = {
      email: newUser.email,
      name: newUser.name,
      whatsapp: newUser.whatsapp,
      createAt: new Date().toISOString(),
      id: userId
    };
    return db.doc(`/users/${newUser.email}`).set(userCredentials);
  })
  .then(() => {
    return res.status(201).json({ token });
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json({
      error: `Something went wrong with your new user, ${err.code}`
    });
  });
};

// TO LOGIN
exports.loginUser = (req, res) => {
  const userToLogin = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, validationErrorsLogin } = validateUsersLogin(userToLogin);
  if (!valid) res.status(400).json(validationErrorsLogin);

  // actually logining
  firebase.auth().signInWithEmailAndPassword(userToLogin.email, userToLogin.password)
  .then(data => {
    return data.user.getIdToken();
  })
  .then(token => {
    return res.json({token})
  })
  .catch(err => {
    return res.status(500).json({err})
  })
};