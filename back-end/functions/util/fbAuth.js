const { admin, db } = require('./admin');

// TO AUTHORIZAD TO CREATE A NEW PRODUCT
exports.FBAuth = (req, res, next) => {
  let idToken;
  // with exists some authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return res.status(403).json({ error: 'Unauthorized' });
  }
  // getting the information
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      // console.log(decodedToken);
      return db.collection('users').where('userId', '==', req.user.uid)
        .limit(1).get();
    })
    .then(() => {
      return next();
    })
    .catch((err) => {
      console.error(err);
      return res.status(403).json(err);
    });
};