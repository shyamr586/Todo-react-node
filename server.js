require('dotenv').config();
const express = require('express')
const {MongoClient} = require("mongodb");
const app = express();
const data = require('./data');

// allow parsing json data
app.use(express.json())

app.use((req,res,next)=>{
    /* allow access for browser so that server can run and get requests. */
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    next();
})

app.param("requestedCollection", (req,res,next, requestedCollection) => {
    if (!data[requestedCollection]) {
        return res.status(404).json({ message: "Collection not found" });
      }
    
      req.collection = data[requestedCollection];
      return next();
})

app.get("/api/:requestedCollection", (req, res, next) => {
    const collection = req.collection;
    res.json(collection);
});

app.post('/api/:requestedCollection/', (req, res, next) => {
    const collection = req.collection;
    const newItem = req.body;
    if (newItem) {
        collection.push(newItem);
        res.status(201).json({ message: 'Item added successfully', newItem });
      } else {
        res.status(400).json({ message: 'Bad request - newItem is missing or empty' });
      }
})

app.delete('/api/:requestedCollection/:id', (req, res, next) => {
    const collection = req.collection;
    const itemId = req.params.id;
    const itemIndex = collection.findIndex(item => item.id === itemId);
    if (itemIndex >= 0) {
        const deletedItem = collection.splice(itemIndex, 1);
        res.json(deletedItem);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

app.put('/api/:requestedCollection/:id', (req, res, next) => {
    const collection = req.collection;
    const itemId = req.params.id;
    const updatedItem = req.body;
    const itemIndex = collection.findIndex(item => item.id === itemId);
    if (itemIndex >= 0) {
        collection[itemIndex] = updatedItem;
        res.json(collection[itemIndex]);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

port = 3000
app.listen(port, ()=>console.log("App is running on port 3000"))