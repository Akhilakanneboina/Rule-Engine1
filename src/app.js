const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/rulesdb', )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error", err));

const ruleController = require('./ruleController');
app.use('/api/rules', ruleController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
