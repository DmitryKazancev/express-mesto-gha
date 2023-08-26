// Imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64e798327cfb23e64b25a5cf', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);
app.use('*', (req, res) => {
  res.status(404).send({ message: '404 Page not found' });
});

app.listen(PORT);
