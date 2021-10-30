const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())

// user and password uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l9ihb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// function & async await
async function run() {
    try {
        await client.connect();
        const database = client.db('travelGuru');
        const servicesCollection = database.collection('services');

        // get Api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        // get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting  specif id', id)
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        // Post Api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service)
            const result = await servicesCollection.insertOne(service);
            console.log(result)

            res.json(result)
        });
        // Delete Api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Travel agency')
});



app.listen(port, () => {
    console.log('listening to port', port)
});


