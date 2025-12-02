require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Import Export Hub server is running");
});

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.j6dmigp.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const importExportDB = client.db("ImportExportHub");
    const productCollection = importExportDB.collection("productinfo");
    const sliderCollection = importExportDB.collection("slider");
    const MyImportsCollection = importExportDB.collection("myimports");
    const MyExportCollection = importExportDB.collection("myexports");

    // all products API
    app.get("/productinfo", async (req, res) => {
      const cursor = productCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // latest products API
    app.get("/latestproduct", async (req, res) => {
      const cursor = productCollection
        .find({})
        .sort({ created_at: -1 })
        .limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // slider API
    app.get("/slider", async (req, res) => {
      const cursor = sliderCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // product details API
    app.get("/productinfo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    // create import product API
    app.post("/myimports/:id", async (req, res) => {
      const id = req.params.id;
      const { Quantity } = req.body;
      const importProduct = req.body;

      await productCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { available_quantity: -Quantity } }
      );

      const result = await MyImportsCollection.insertOne(importProduct);
      res.send(result);
    });

    // myImports API
    app.get("/myimports", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      const cursor = MyImportsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // myImports Delete API
    app.delete("/myimports/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await MyImportsCollection.deleteOne(query);
      res.send(result);
    });

    // Add Exports post API
    // app.post('/productinfo',async(req,res)=>{
    //     const exportsProduct = req.body
    //     // const query = {_id : new ObjectId(id)}
    //     const result= await productCollection.insertOne(exportsProduct)
    //     res.send(result)
    // })

    // myexports API
    // app.get('/myexports',async(req,res)=>{
    //     const email = req.query.email
    //     console.log(email)
    //     const query ={}
    //     if (email) {
    //         query.email=email
    //     }
    //     const cursor = MyExportCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })

    // MyExports post API
    app.post("/myexports", async (req, res) => {
      const exportsMyProducts = req.body;
      const result = await MyExportCollection.insertOne(exportsMyProducts);
      res.send(result);
    });

    // MyExports get API
    app.get("/myexports", async (req, res) => {
      const cursor = MyExportCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // MyExports delete API
    app.delete("/myexports/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await MyExportCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Import Export Hub server app listening on port ${port}`);
});
