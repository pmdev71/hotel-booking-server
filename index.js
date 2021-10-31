const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hzv8l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travel_agency');
        const offersCollection = database.collection('offers');
        const ordersCollection = database.collection('orders');

        // GET offers API
        app.get('/offers', async (req, res) => {
            const cursor = offersCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        });

        // POST offer/service API 
        app.post('/offers', async (req, res) => {
            const newOffers = req.body;
            const result = await offersCollection.insertOne(newOffers);
            res.json(result);
        });

        // UPDATE ORDER STATUS
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    orderStatus: "Processing"
                }
            }
            const result = await ordersCollection.updateOne(query, updateDoc)
            res.json(result);
        });

        // GET all orders API
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // POST orders API
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder);
            res.json(result);
        });

        // DELETE my order API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            // console.log('Delate id', result);
            res.json(result);

        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Assignment 11 servet is running')
});

app.listen(port, () => {
    console.log('Server running at port', port);
})