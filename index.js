const express = require('express');
const bodyParser =require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


const password = 'c3HeMqMO2Rwkj9J0';

const uri = "mongodb+srv://organicUser:c3HeMqMO2Rwkj9J0@cluster0.f6j7z.mongodb.net/organicbd?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })
);

app.get ('/',(req ,res) =>{
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
  const productCollection = client.db("organicbd").collection("products");

//  MongoDB Data read //

  app.get('/products', (req ,res) =>{
    productCollection.find({})
    .toArray((err , document) => {
      res.send(document);
    })
  })
 // update data lode //
  app.get('/product/:id',(req ,res) =>{
    productCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err, result) =>{
      res.send(result[0]);
    })
  })

//  MongoDB Data send or create//

  app.post ("/addProduct",(req ,res) =>{
   const product = req.body;
   productCollection.insertOne(product)
   .then(result => {
     console.log('data added successfully');
     res.redirect('/')
   })
   .then (result =>{

   })

  })

  // modify data //

  app.patch('/update/:id',(req ,res) =>{
    productCollection.updateOne({_id:ObjectId(req.params.id)},
    {
      $set:{price: req.body.price, quantity: req.body.quantity}
    })
    .then (result => {
      res.send(result.modifiedCount > 0)
    })
  })


// delete product//
  app.delete('/delete/:id',(req ,res) =>{
    productCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then((result) =>{
     res.send(result.deletedCount > 0);
    })
    
  })

});

app.listen(8000);
