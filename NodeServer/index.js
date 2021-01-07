const PubSub = require('./pubsub');
const express = require('express');

// app constants
const app = express();
const port = process.env.PORT || 3000;
// publishing object
const pubsub = new PubSub();

// default page, so we can check that the app is up and running
app.get('/', (req, res) => {
  res.send('CROPMON is running.');
});

// turn the notification on
app.post('/on', (req, res) => {
  console.log("Notificaion ON");
  pubsub.notificationPending = true;
  res.status(404).end();
});

// turn the notification off
app.post('/off', (req, res) => {
  console.log("Notificaion OFF");
  pubsub.notificationPending = false;
  res.status(404).end();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});