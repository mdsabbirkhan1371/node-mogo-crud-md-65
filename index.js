const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
// user: dbuser1
// password: Gf4F0Mk3zGwtKCts


// use middleware

app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://dbuser1:Gf4F0Mk3zGwtKCts@cluster0.hzysi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const userCollection = client.db('FoodExpress').collection('user');

        // get user for data base 
        app.get('/user', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })
        // signgle user update 

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.findOne(query)
            res.send(result)
        })



        // Post user: add new user. 
        app.post('/user', async (req, res) => {

            // get user from client site 
            const newUser = req.body
            console.log('add a new user', newUser)
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })

        // update user 
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email

                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.send(result)

        })



        // delet user for database
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })


    }

    finally {
        // perform actions on the collection object
        // client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Node Curd Server')
})

app.listen(port, () => {
    console.log('Curd Server Is Running')
})
