const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors');
const app = express()
const port =process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Import Export Hub server is running')
})

// Import-Export-Hub
// r7s1Tn3cKDyCn9tB

const uri = "mongodb+srv://Import-Export-Hub:r7s1Tn3cKDyCn9tB@cluster0.j6dmigp.mongodb.net/?appName=Cluster0";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const importExportDB = client.db("ImportExportHub");
    const productCollection = importExportDB.collection("productinfo");
    const sliderCollection = importExportDB.collection("slider");

    // all products API 
    app.get('/productinfo',async(req,res)=>{
          const cursor = productCollection.find({});
        const result = await cursor.toArray();
        res.send(result)
    })

    // latest products API 
    app.get('/latestproduct',async(req,res)=>{
          const cursor = productCollection.find({}).sort({created_at:-1}).limit(6);
        const result = await cursor.toArray();
        res.send(result)
    })

    // slider API 
    app.get('/slider',async(req,res)=>{
          const cursor = sliderCollection.find({});
        const result = await cursor.toArray();
        res.send(result)
    })

    // product details API
    app.get('/productinfo/:id',async(req,res)=>{
        const id = req.params.id
        console.log(id)
        const query = {_id : new ObjectId(id)}
         console.log(query)
        const result = await productCollection.findOne(query);
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Import Export Hub server app listening on port ${port}`)
})