const express = require('express');
const session = require('express-session');

const app = express();
const fs = require('fs');
fs.readFileSync
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat',
  }),
);

app.get('/', (req, res) => {
  req.session.count = req.session.count ? req.session.count + 1 : 1;
  res.status(200).json({ hello: 'mundo', counter: req.session.count });
});
