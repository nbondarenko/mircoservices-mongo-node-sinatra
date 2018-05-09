var ObjectID = require('mongodb').ObjectID;
const moment = require('moment');
var request = require('request');
const DB_COLLECTION = 'bikes';

module.exports = function (app, db) {
  app.get('/bikes', (request, response) => {
    db.collection(DB_COLLECTION).find({}).toArray((err, result) => {
      if (err) {
        response.send({ 'error': 'An error has occurred' });
      } else {
        response.send(result);
      }
    });
  });

  app.post('/bikes', (request, response) => {
    const bike = {
      color: request.body.color,
      type: request.body.type,
      available_from: moment(request.body.available_from).format('YYYY-MM-DD'),
    };
    db.collection(DB_COLLECTION).insert(bike, (err, result) => {
      if (err) {
        response.status(422).send({ 'error': 'An error has occurred' });
      } else {
        response.status(201).send(result.ops[0]);
      }
    });
  });

  app.get('/bikes/:id', (request, response) => {
    const id = request.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection(DB_COLLECTION).findOne(details, (err, item) => {
      if (err) {
        response.send({ 'error': 'An error has occurred' });
      } else {
        response.send(item);
      }
    });
  });

  app.delete('/bikes/:id', (request, response) => {
    const id = request.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection(DB_COLLECTION).remove(details, (err, item) => {
      if (err) {
        response.send({ 'error': 'An error has occurred' });
      } else {
        response.sendStatus(200);
      }
    });
  });

  app.put('/bikes/:id', (request, response) => {
    const id = request.params.id;
    const details = { '_id': new ObjectID(id) };
    const bike = {
      color: request.body.color,
      type: request.body.type,
      available_from: moment(request.body.available_from).format('YYYY-MM-DD'),
    };
    db.collection(DB_COLLECTION).update(details, bike, (err, result) => {
      if (err) {
        response.send({ 'error': 'An error has occurred' });
      } else {
        response.send(bike);
      }
    });
  });

  app.post('/bikes/:id/book', (myRequest, response) => {
    const id = myRequest.params.id;
    const availableFrom = moment(myRequest.body.to_time).format('YYYY-MM-DD');
    const amount = myRequest.body.amount;
    const details = { '_id': new ObjectID(id) };
    const action = {
      $set: { available_from: availableFrom }
    }
    const options = { 'new': true }
    db.collection(DB_COLLECTION).findAndModify(details, [['_id', 1]], action, options, (err, item) => {
      if (err) {
        response.send({ 'error': 'An error has occurred' });
      } else {
        var options = {
          uri: `http://bookingapp:5001/bookings`,
          method: 'POST',
          json: {
            'bike_id': id,
            'amount': amount
          }
        };

        request(options, function (error, r, body) {
          if (!error && r.statusCode == 200) {
            response.send(item.value);
          } else {
            response.send({ 'error': 'An error has occurred' });
          }
        });
      }
    });
  });
};