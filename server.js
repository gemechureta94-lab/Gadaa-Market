const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../public')));

const DATA_FILE = path.join(__dirname, 'data.json');

const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = { products: [], orders: [], reviews: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// API Endpoints
app.get('/api/products', (req, res) => {
  const data = readData();
  res.json(data.products);
});

app.post('/api/products', (req, res) => {
  const data = readData();
  const newProduct = { id: Date.now().toString(), ...req.body };
  data.products.push(newProduct);
  writeData(data);
  res.status(201).json(newProduct);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GadaaMarket Backend is running successfully' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
