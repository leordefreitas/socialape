// LIBRARYS
const functions = require('firebase-functions');
const express = require('express');
const { 
  getAllScreams, 
  createNewScream,
  getOneScream,
  commentOnScream, 
  likeScream,
  unlikeScream,
  deleteScream 
} = require('./handle/screams');
const { 
  createUser,
  loginUser, 
  upLoadImage, 
  addUserDetail,
  getAuthenticatedUser
} = require('./handle/users');
const { FBAuth } = require('./util/fbAuth');
const { db } = require('./util/admin');
const app = express();

// SCREAM ROUTES
// get all screams
app.get('/screams', getAllScreams);
// add one scream
app.post('/scream', FBAuth, createNewScream);
// get all information about one scream
app.get('/scream/:screamId', getOneScream);
// add a comment on a scream
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);
// like a scream
app.get('/scream/:screamId/like', FBAuth, likeScream);
// unlike a scream
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);
// delete scream
app.delete('/scream/:screamId', FBAuth, deleteScream);

// USERS ROUTES
// create
app.post('/signup', createUser);
// login
app.post('/login', loginUser);
// upload images
app.post('/user/image', FBAuth, upLoadImage);
// add user details
app.post('/user', FBAuth, addUserDetail);
// get user
app.get('/user', FBAuth, getAuthenticatedUser);

// EXPORTING BY EXPRESS
exports.api = functions.https.onRequest(app);

// NOTIFICATIONS
// likes
// to acecseee the data in firestore
exports.createNotificationOnLike = functions.region('us-central1').firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    // getting the scream
    db.doc(`/screams/${snapshot.data().screamId}`).get()
      .then(doc => {
        if(doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            screamId: doc.id
          })
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

// comment
exports.createNotificationOnComment = functions.region('us-central1').firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    db.doc(`/screams/${snapshot.data().screamId}`).get()
      .then(doc => {
        return db.doc(`/notifications/${snapshot.id}`).set({
          createAt: new Date().toISOString(),
          recipient: doc.data().userHandle,
          sender: snapshot.data().userHandle,
          type: 'comment',
          read: false,
          screamId: doc.id
        })
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

// delete notifications you already don`t like it
exports.deleteNotificationOnUnlike = functions.region('us-central1').firestore.document('likes/{id}')
  .onDelete((snapshot) => {
    db.doc(`/notifications/${snapshot.id}`).delete()
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });