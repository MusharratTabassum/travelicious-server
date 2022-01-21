const express = require('express');
const { MongoClient, Collection } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Running my server crud")
})

app.listen(port, () => {
    console.log("Running port on ", port);
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.agixt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("traveliciousBD");
        const serviceCollection = database.collection("services");

        //POST API

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
