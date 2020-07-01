const { admin, db } = require('../util/admin');
const { 
  validateUsersSignUp, 
  validateUsersLogin, 
  reduceUserDetails 
} = require('../util/validates');
const firebase = require('firebase');
const { firebaseConfig } = require('../util/key/firebaseConfig');

firebase.initializeApp(firebaseConfig);

// TO CREATE NEW USER
exports.createUser = (req, res) => {
  const newUser = {
    handle: req.body.handle,
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
  db.doc(`/users/${newUser.handle}`).get()
  .then(doc => {
    if (doc.exists) {
      return res.status(400).json({ general: `This user already exists, please change your user` });
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
      handle: newUser.handle,
      email: newUser.email,
      name: newUser.name,
      whatsapp: newUser.whatsapp,
      createAt: new Date().toISOString(),
      userId: userId,
      imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImage}?alt=media`
    };
    return db.doc(`/users/${newUser.handle}`).set(userCredentials);
  })
  .then(() => {
    return res.status(201).json({ token });
  })
  .catch(err => {
    console.error(err);
    if (err.code === 'auth/email-already-in-use') {
      return res.status(400).json({ email: 'This is email is already in use' });
    } else {
      return res.status(500).json({
        general: `Something went wrong, please try again`
      });
    }
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
    return res.json({ token });
  })
  .catch(err => {
    console.error(err);
    // auth/wrong-password
    // auth/user-not-user
    return res.status(403).json({
       general: 'Wrong credentials, pelase try again' 
    });
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
      return db.doc(`/users/${req.user.handle}`).update({imageUrl: imageUrl});
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
  let userDetails = reduceUserDetails(req.body); !
  // uptading user with the new details
  db.doc(`/users/${req.user.handle}`).update(userDetails)
    .then(() => {
      return res.json({ message: 'User details add with sucess' })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
};

// TO GET USER AUTHENTICATE
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`).get()
    .then(doc => {
      // has to do it because if not crash the script
      if (doc.exists) {
        userData.credentials = doc.data();
        return db.collection('likes').where('userHandle', '==', req.user.handle).get();
      }
    })
    .then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      // this to put the notifications the user can see in your profile
      // limit() is good becouse i can put a limit in to i wanna show
      return db.collection('notifications').where('recipient', '==', req.user.handle)
        .orderBy('createAt', 'desc').limit(10).get()
    })
    .then(data => {
      userData.notifications = [];
      data.forEach(doc => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createAt: doc.data().createAt,
          screamId: doc.data().screamId,
          read: doc.data().read,
          type: doc.data().type,
          notificationId: doc.id
        })
      })
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code })
    })
};

// GET USERS DETAILS OPEN PUBLIC
// putting the user in arrays and objects just to me have acesse when
// start to build the front end, this the windows the any user cam see
//  so when i have to change somthing in the back-end is here
exports.getUserDetails = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.handle}`).get()
    .then(doc => {
      if(doc.exists) {
        userData.user = doc.data();
        return db.collection('screams').where('userHandle', '==', req.params.handle).orderBy('createAt', 'desc').limit(5).get()
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    })
    .then(data => {
      userData.screams = [];
      data.forEach(doc => {
        userData.screams.push({
          body: doc.data().body,
          createAt: doc.data().createAt,
          userHandle: doc.data().userHandle,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          screamId: doc.id
        })
      })
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
};

// mark if the notifications are readed
exports.markNotificationsReaded = (req, res) => {
  // this is batch used to update(), delete or set()
  // you can change a data insede firebase
  let batch = db.batch();
  req.body.forEach(notificationId => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch.commit()
    .then(() => {
      return res.json({ message: 'Notification marked read' });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
};