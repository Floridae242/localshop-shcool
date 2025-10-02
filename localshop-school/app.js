require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import API routes
const apiRoutes = require('./api');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes
app.use('/api', apiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Server listening on port ${port}`));
