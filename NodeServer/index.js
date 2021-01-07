const PubSub = require('./pubsub');
const express = require('express');

// app constants
const app = express();
const port = process.env.PORT;
// publishing object
const pubsub = new PubSub();

// default page, so we can check that the app is up and running
app.get('/', (req, res) => {
  return "CROPMON is running.";
});

// turn the notification on
app.get('/on', (req, res) => {
  console.log("Notificaion ON");
  pubsub.notificationPending = true;
});

// turn the notification off
app.get('/off', (req, res) => {
  console.log("Notificaion OFF");
  pubsub.notificationPending = false;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});