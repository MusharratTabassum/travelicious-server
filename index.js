const express = require('express');
const { MongoClient, Collection } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;



const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("TraveliciousBD server is running")
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
        const bookingCollection = database.collection("bookings");
        const testimonialCollection = database.collection("testimonials");


        //-------------------------- Service API ------------------------------//

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const allServices = await cursor.toArray();
            res.send(allServices);
        });


        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });


        //-------------------------- Booking API ------------------------------//


        // GET API 

        app.get('/bookings', async (req, res) => {
            const cursor = bookingCollection.find({});
            const allBookings = await cursor.toArray();
            res.send(allBookings);
        });

        // GET API for any specific Booking

        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const booking = await bookingCollection.findOne(query);
            console.log('load booking with id: ', id);
            res.send(booking);
        });

        //POST API
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking);

            const result = await bookingCollection.insertOne(booking);
            console.log(result);
            res.json(result)
        });

        // DELETE API 
        app.delete("/bookings/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        });

        //UPDATE API 
        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const updatedBooking = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedField = {
                $set: {
                    status: updatedBooking.status
                },
            };
            const result = await bookingCollection.updateOne(filter, updatedField, options)
            console.log('updated', id)
            res.json(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
