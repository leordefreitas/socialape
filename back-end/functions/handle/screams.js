const { db } = require('../util/admin');

// HANDLE TO GET PRODUCT
exports.getAllScreams = (req, res) => {
  db.collection('products').orderBy('createAt', 'desc').get()
  .then((doc) => {
    let productsArray = [];
    doc.forEach((docToPush) => {
      productsArray.push({
        id: docToPush.id,
        type: docToPush.data().type,
        material: docToPush.data().material,
        color: docToPush.data().color,
        size: docToPush.data().size,
        createAt: docToPush.data().createAt
      });
    });
    return res.json(productsArray);
  })
  .catch((err) => console.error(err));
};

// HANDLE TO CREATE PRODUCT
exports.createNewScream = (req, res) => {
  // method to just post
  if(req.method !== 'POST') {
    res.status(400).json({error: 'Only can be POST method'})
  };
  // creating
  const newProduct = {
    type: req.body.type,
    material: req.body.material,
    color: req.body.color,
    size: req.body.size,
    createAt: new Date().toISOString()
  };
  // posting
  db.collection('products').add(newProduct)
  .then((doc) => {
    res.json({message: `ID(${doc.id}) created with sucess`});
  })
  .catch((err) => {
    res.status(500).json({error: 'Problem with the creation'});
    console.error(err);
  });
};