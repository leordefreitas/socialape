const { db } = require('../util/admin');

// HANDLE TO GET ALL SCREAMS
exports.getAllScreams = (req, res) => {
  db.collection('screams').orderBy('createAt', 'desc').get()
  .then((doc) => {
    let screamArray = [];
    doc.forEach((docToPush) => {
      screamArray.push({
        id: docToPush.id,
        userHandle: docToPush.data().userHandle,
        body: docToPush.data().body,
        likeCount: docToPush.data().likeCount,
        commentCount: docToPush.data().commentCount,
        createAt: docToPush.data().createAt,
        userImage: doc.data().userImage
      });
    });
    return res.json(screamArray);
  })
  .catch((err) => console.error(err));
};

// HANDLE TO CREATE SCREAM
exports.createNewScream = (req, res) => {
  // method to just post
  if(req.method !== 'POST') {
    res.status(400).json({error: 'Only can be POST method'})
  };
  // creating
  const newScream = {
    userHandle: req.user.handle,
    body: req.body.body,
    likeCount: 0,
    commentCount: 0,
    createAt: new Date().toISOString(),
    userImage: req.user.imageUrl
  };
  // posting
  db.collection('screams').add(newScream)
  .then((doc) => {
    let resScream = newScream;
    resScream.screamId = doc.id;
    res.json(resScream);
  })
  .catch((err) => {
    res.status(500).json({error: 'Problem with the creation'});
    console.error(err);
  });
};

// TO GET ONE SCREAM
exports.getOneScream = (req, res) => {
  let screamData = {};
  db.doc(`/screams/${req.params.screamId}`).get()
    .then((doc) => {
      if(!doc.exists) {
        return res.status(404).json({ error: 'Scream was not found' })
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      // console.log(screamData)
      return db
        .collection('comments')
        .orderBy('createAt', 'desc')
        .where('screamId', '==', req.params.screamId)
        .get()
        .then(data => {
          screamData.comments = [];
          data.forEach(doc => {
            screamData.comments.push(doc.data());
          })
          return res.json(screamData);
        })
        .catch(err => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        })
    })
};

// TO COMMENT ON A SCREAM
exports.commentOnScream = (req, res) => {
  // just to the body not go empty
  if(req.body.body.trim() === '') {
    return res.status(400).json({ comment: 'Must not be empty' }); 
  };
  
  let newComment = {
    screamId: req.params.screamId,
    userHandle: req.user.handle,
    body: req.body.body,
    createAt: new Date().toISOString(),
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };
  // just to the user not use a wrong scream id
  db.doc(`/screams/${req.params.screamId}`).get()
    .then(doc => {
      if(!doc.exists) {
        return res.status(404).json({ error: 'Scream not found' });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection('comments').add(newComment);
    })
    .then(() => {
      return res.json(newComment);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
};

// TO LIKE A SCREAM
exports.likeScream = (req, res) => {
  // here we are taking only the possible like
  const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId).limit(1);
    // taking the information about the scream and is the acess to the firebase
  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  let screamData;
// to see if existi in the firebase
  screamDocument.get()
    .then(doc => {
      if(doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Scream not found' })
      }
    })
    .then(data => {
      if(data.empty) {
        return db.collection('likes').add({
          screamId: req.params.screamId,
          userHandle: req.user.handle
        })
        .then(() => {
          screamData.likeCount++
          return screamDocument.update({ likeCount: screamData.likeCount });
        })
        .then(() => {
          return res.json(screamData)
        })
      } else {
        return res.status(400).json({ error: 'Scream is liked already' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code })
    })
};

// TO UNLIKE A SCREAM
exports.unlikeScream = (req, res) => {
  const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId).limit(1);
  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  let screamData;

  screamDocument.get()
    .then(doc => {
      if(doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Scream not found' })
      }
    })
    .then(data => {
      if(data.empty) {
        return res.status(400).json({ error: 'Scream is liked already' });
      } else {
        // we are taking likes frm the firebase 
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            screamData.likeCount--;
            return screamDocument.update({ likeCount: screamData.likeCount})
          })
          .then(() => {
            res.json(screamData);
          })
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code })
    })
};

// TO DELETE SCREAM
exports.deleteScream = (req, res) => {
  const document = db.doc(`/screams/${req.params.screamId}`);
  document.get()
    .then(doc => {
      if(!doc.exists) {
        return res.status(404).json({ error: 'Scream not found' });
      }
      else if(doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Only the maker can delete this scream' })
      }
      else {
        return document.delete();
      }
    })
    .then(() => {
      return res.json({ message: 'Scream deleted with sucess' });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
};