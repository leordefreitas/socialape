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
        createAt: docToPush.data().createAt
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
    userEmail: req.user.email,
    body: req.body.body,
    likeCount: 0,
    commentCount: 0,
    createAt: new Date().toISOString()
  };
  // posting
  db.collection('screams').add(newScream)
  .then((doc) => {
    res.json({message: `ID ${doc.id} created with sucess`});
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
      return db.collection('comments').where('screamId', '==', req.params.screamId).get()
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
}