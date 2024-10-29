/*jshint esversion: 8 */

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const  cors = require('cors');

const app = express();
const port = 3050;

app.use(cors());
app.use(express.urlencoded({ extended: false }));

const carsData = JSON.parse(fs.readFileSync("car_records.json", 'utf8'));

mongoose.connect('mongodb://mongo_db:27017/', { dbName: 'dealershipsDB' })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const Cars = require('./inventory');

try {
  Cars.deleteMany({}).then(()=>{
  Cars.insertMany(carsData.cars);
});
  
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Error fetching documents' });
}

// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API");
});

// Retrieve cars based on the dealer ID. 
app.get('/cars/:id', async (req, res) => {
    try {
      const documents = await Cars.find({dealer_id: req.params.id});
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching documents' });
    }
});

// Retrieve cars based on both dealer ID and car make
app.get('/carsbymake/:id/:make', async (req, res) => {
    try {
        const documents = await Cars.find({dealer_id: req.params.id, 
                                           make: req.params.make});
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});

// Retrieve cars based on both dealer ID and car model
app.get('/carsbymodel/:id/:model', async (req, res) => {
    try {
        const documents = await Cars.find({dealer_id: req.params.id, 
                                           model: req.params.model});
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});

/*
Retrieve cars based on both dealer ID and mileage constraints as follows:
Mileage:
Less than or equal to 50000
50000 to 100000
100000 to 150000
150000 to 200000
Greater than 200000
*/
app.get('/carsbymaxmileage/:id/:mileage', async (req, res) => {
    try {
      let mileage = parseInt(req.params.mileage)
      let condition = {}
      if(mileage === 50000) {
        condition = { $lte : mileage}
      } else if (mileage === 100000){
        condition = { $lte : mileage, $gt : 50000}
      } else if (mileage === 150000){
        condition = { $lte : mileage, $gt : 100000}
      } else if (mileage === 200000){
        condition = { $lte : mileage, $gt : 150000}
      } else {
        condition = { $gt : 200000}
      }
      const documents = await Cars.find({ dealer_id: req.params.id, mileage: condition });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching documents' });
    }
  });

  /*
  Retrive cars based on both dealer ID and proce constraints as follows:
  Price:
  Less than or equal to 20000
  20000 to 40000
  40000 to 60000
  60000 to 80000
  Greater than 80000
  */
  app.get('/carsbyprice/:id/:price', async (req, res) => {
    try {
        let price = parseInt(req.params.price)
        let condition = {}
        if(price === 20000) {
          condition = { $lte : price}
        } else if (price=== 40000){
          condition = { $lte : price, $gt : 20000}
        } else if (price === 60000){
          condition = { $lte : price, $gt : 40000}
        } else if (price === 80000){
          condition = { $lte : price, $gt : 60000}
        } else {
          condition = { $gt : 80000}
        }
        const documents = await Cars.find({ dealer_id: req.params.id, price : condition });
        res.json(documents);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
      }
});

/*
Retrieve cars based on both dealer ID and a minimum year constraint.
*/
app.get('/carsbyyear/:id/:year', async (req, res) => {
    try {
      const documents = await Cars.find({ dealer_id: req.params.id, year: { $gte :req.params.year }});
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching documents' });
    }
});

//Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


