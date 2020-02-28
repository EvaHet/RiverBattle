console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.listen(8080, () => console.log('listening on 8080'));


app.post('/game', (req, res) => {
  const game = {shotTime: new Date(), board: req.body};
  console.log(game);

  MongoClient.connect('mongodb://localhost:27017/', function (err, client) {
    if(err) {
        console.log("Unable to connect DB. Error: " + err)
    }
    else {
      var db = client.db('RiverBattle');

      db.collection('game').save(game, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log('game added to db');
        }
        client.close();
        res.sendStatus(201);
      });
    } 
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.get('/game', (req, res) => {

  MongoClient.connect('mongodb://localhost:27017/', function (err, client) {
    if(err) {
        console.log("Unable to connect DB. Error: " + err)
    }
    else {
      var db = client.db('RiverBattle');

      db.collection('game').find({}, {sort:{ _id: -1 }, limit: 1}).toArray(function (err, docs) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        } else {
          console.log('база работает');
        }
        client.close();
        if (docs.length > 0) {
          res.send(docs[0].board);
        } else {
          res.send({});
        }
      })
    } 
  });
});


app.delete('/game', (req, res) => {
  const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
    
  mongoClient.connect(function(err, client){
       
      if(err) return console.log(err);
      const db = client.db('RiverBattle');
      db.collection('game').drop(function(err, result){
        if (err) {
          console.log(err);
          return res.sendStatus(204);
        } else {
          console.log('удалено');
        }     
          client.close();
      });
  });
});



app.post('/shots', (req, res) => {
  const shot = {shotTime: new Date(), shot: req.body.shot};
  console.log(shot);

  MongoClient.connect('mongodb://localhost:27017/', function (err, client) {
    if(err) {
        console.log("Unable to connect DB. Error: " + err)
    }
    else {
      var db = client.db('RiverBattle');

      db.collection('shots').save(shot, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log('shot added to db');
        }
        client.close();
        res.sendStatus(201);
      });
    } 
  });
});



app.get('/shots', (req, res) => {

  MongoClient.connect('mongodb://localhost:27017/', function (err, client) {
    if(err) {
        console.log("Unable to connect DB. Error: " + err)
    }
    else {
      var db = client.db('RiverBattle');
      db.collection('shots').find({}, {sort:{ _id: -1 }, limit: 10}).toArray(function (err, docs) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        } 
        client.close();
        if (docs.length > 0) {
          res.send(docs[0].board);
        } else {
          res.send({});
        }
      })
    } 
  });
});

