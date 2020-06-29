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
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsReaded
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
// get user details PUBLIC
app.get('/user/:handle', getUserDetails);
// make notifications readed
app.post('/notifications', FBAuth, markNotificationsReaded);


// EXPORTING BY EXPRESS
exports.api = functions.https.onRequest(app);

// TRIGGERS
// likes
// to acecseee the data in firestore
exports.createNotificationOnLike = functions.region('us-central1').firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    // getting the scream
    return db.doc(`/screams/${snapshot.data().screamId}`).get()
      .then(doc => {
        // the user not recive notification with he likes hes on scream
        if (
          doc.exists 
          && snapshot.data().userHandle !== doc.data().userHandle
        ) {
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
      .catch(err => {
        console.error(err);
      });
  });

// comment
exports.createNotificationOnComment = functions.region('us-central1').firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db.doc(`/screams/${snapshot.data().screamId}`).get()
      .then(doc => {
        if (
          doc.exists 
          && snapshot.data().userHandle !== doc.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            screamId: doc.id
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  });

// delete notifications you already don`t like it
exports.deleteNotificationOnUnlike = functions.region('us-central1').firestore.document('likes/{id}')
  .onDelete((snapshot) => {
    return db.doc(`/notifications/${snapshot.id}`).delete()
      .catch(err => {
        console.error(err);
      });
  });

// to change all images on screams when change user image
exports.onUserImageChange = functions.region('us-central1').firestore
.document('/users/{userId}')
  .onUpdate((change) => {
    // before and after is a way to work with this aplication, has yous advantages
    // this console.log show in the firebase system so go to functions and log
    console.log(change.before.data());
    console.log(change.after.data());
    if (
      change.before.data().imageUrl !== change.after.data().imageUrl
    ) {
      const batch = db.batch();
      return db.collection('screams')
        .where('userHandle', '==', change.before.data().handle).get()
        .then(data => {
          data.forEach(doc => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          })
          return batch.commit();
        })
        .catch(err => {
          console.error(err);
          return;
        })
    } else return true;
  })

// delete all like comments related with a scream when its deleted
exports.onScreamDeleted = functions.region('us-central1').firestore
  .document('/screams/{screamId}')
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    // i think another to do it but i think he does in this becouse is
    // my way can be wrong and give an error
    // to delete the comments
    return db.collection('comments').where('screamId', '==', screamId).get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`))
        })
        return db.collection('likes').where('screamId', '==', screamId).get()
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        })
        return db.collection('notifications').where('screamId', '==', screamId).get()
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`))
          return batch.commit();
        })
      })
      .catch(err => console.error(err));
  });
