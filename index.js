const { MongoClient, ServerApiVersion } = require('mongodb');
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

    app.get('/productinfo',async(req,res)=>{
          const cursor = productCollection.find({});
        const result = await cursor.toArray();
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