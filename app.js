//req the packages
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mailgun = require('mailgun-js');
const mongoose = require('mongoose');
require('dotenv').config();

//setting up the app to use express
const app = express();

//setting up the view engine
app.set('view engine', 'ejs');

//setting up the public folder
app.use(express.static('public'));

//allowing app to use bodyparser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//get requests

app.get('/', (req, res) => {
  res.render('index');
});

//contact form post req
app.post('/', (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var subject = req.body.subject;
  var message = req.body.message;

  const DOMAIN = 'YOUR_DOMAIN_NAME';
  const mg = mailgun({
    apiKey: '' + process.env.APIKEY,
    domain: '' + process.env.DOMAIN,
  });
  const data = {
    from: email,
    to: 'developershivangii@gmail.com',
    subject: subject,
    text:
      message +
      ' [Sent by: { ' +
      ' Name: ' +
      name +
      ', Subject: ' +
      subject +
      ', Email: ' +
      email +
      ' }]',
  };
  mg.messages().send(data, function (error, body) {
    if (!error) {
      console.log(body);
      if (name === '' || email === '' || subject === '' || message === '') {
        res.render('failed');
      } else {
        res.render('thankyou');
      }
    } else {
      res.render('failed');
    }
  });
});

//making app to listen to reqs on port 3000 or any port

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}

app.listen(port, () => {
  console.log('server has started successfully');
});
