const { db } = require('../util/admin');

// HANDLE TO GET SCREAM
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
    handleUser: req.user.handleUser,
    body: req.body.body,
    likeCount: req.body.likeCount,
    commentCount: req.body.commentCount,
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