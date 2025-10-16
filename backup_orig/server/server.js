
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const countries = require('./countries.json');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.get('/countries', (req, res) => {
  res.json(countries);
});
app.post('/book', (req, res) => {
  // mock booking endpoint
  const booking = req.body;
  booking.id = 'BK' + Math.floor(Math.random()*1000000);
  booking.status = 'confirmed';
  res.json(booking);
});
app.post('/pay', (req, res) => {
  // mock payment processing (always succeeds)
  res.json({ success:true, tx: 'TX' + Math.floor(Math.random()*10000000) });
});
const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log('Server running on port', port));
