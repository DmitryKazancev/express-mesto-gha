// Imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const signupRoutes = require('./routes/signup');
const signinRoutes = require('./routes/signin');
// const indexRoutes = require('./routes/index');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64e798327cfb23e64b25a5cf',
//   };
//   next();
// });
// app.use(indexRoutes);
app.use('/signin', signinRoutes);
app.use('/signup', signupRoutes);
app.use(auth);
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);
app.use('*', (req, res) => {
  res.status(404).send({ message: '404 Page not found' });
});

app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
