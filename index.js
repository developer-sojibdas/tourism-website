const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n3lnz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
try{
    await client.connect();
    const database = client.db('tourism-database')
    const tourismCollection = database.collection('services');
    const bookingCollection = database.collection('booking');


    // get booking api 
     app.get('/booking', async(req, res)=>{
        const cursor = bookingCollection.find({});
        const booking = await cursor.toArray();
        res.send(booking);
    })

    //get booking post api
    app.post('/booking', async(req, res)=>{
        const booking = req.body;
        const result= await bookingCollection.insertOne(booking)
        res.json(result);
    })

 
   
    //get all api
    app.get('/services', async(req, res)=>{
        const cursor = tourismCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    })


    // get single services

    app.get('/services/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await tourismCollection.findOne(query);

        res.json(service);
    })


    // post api
    app.post('/services', async(req, res)=>{
        const service = req.body;
        const result = await tourismCollection.insertOne(service);
        console.log(result);
        res.json(result)

    })
    
    //

    //delete api
    app.delete('/booking/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await bookingCollection.deleteOne(query)
        res.json(result)

    })
}

finally{
    // await client.close();
}


}

run().catch(console.dir);

app.get('/', (req, res)=>{
res.send("Running Toursim Clint Site")
});


app.listen(port, ()=>{
   console.log('Runnig Server Site on port', port); 
});