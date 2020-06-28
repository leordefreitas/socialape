const { admin, db } = require('../util/admin');
const { validateUsersSignUp, validateUsersLogin, reduceUserDetails } = require('../util/validates');
const firebase = require('firebase');
// const { app } = require('firebase-functions');
const { firebaseConfig } = require('../util/key/firebaseConfig');
const { UserRecordMetadata } = require('firebase-functions/lib/providers/auth');

firebase.initializeApp(firebaseConfig);

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

  // image of starts users
  const noImage = 'noimage.png';

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
      id: userId,
      imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImage}?alt=media`
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
    return res.status(500).json(err)
  })
};

// TO UPLOAD IMAGES
// to upload images, we need to install "npm install --save busboy"
exports.upLoadImage = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    // console.log(fieldname, filename, mimetype);
    // condition to be a image
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }

    // get the extension of the image
    const imageExtension = filename.split('.')[filename.split('.').length - 1]
    // give the image some code and add the extension
    imageFileName = `${Math.round(Math.random()*1000000000)}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    // to create the image
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    admin.storage().bucket().upload(imageToBeUploaded.filepath, {
      resumable: false,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimetype
        }
      }
    })
    .then(() => {
      // this is the basic url to use for see the image
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
      // update() update same value or create a new with doen`t exists
      return db.doc(`/users/${req.user.email}`).update({ imageUrl: imageUrl });
    })
    .then(() => {
      return res.json({ message: 'Image uploaded with sucess' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
  });
  busboy.end(req.rawBody);
};

// TO ADD USER DETAIL
exports.addUserDetail = (req, res) => {
  let userDetails = reduceUserDetails(req.body);
  // uptading user with the new details
  db.doc(`/users/${req.user.email}`).update(userDetails)
    .then(() => {
      return res.json({ message: 'User details add with sucess' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
};

// TO GET USER
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.email}`).get()
    .then(doc => {
      // has to do it because if not crash the script
      if (doc.exists) {
        userData.credentials = doc.data();
        return db.collection('likes').where('userEmail', '==', req.user.email).get()
      }
    })
    .then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code })
    })
};