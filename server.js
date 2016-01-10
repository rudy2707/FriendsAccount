// =======================
// Get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var path        = require('path');

var jwt    = require('jsonwebtoken'); 		// used to create, sign, and verify tokens
var config = require('./config'); 			// get our config file

app.use(express.static(path.join(__dirname, 'public')))

// =======================
// Models ================
// =======================
var User   	= require('./app/models/user'); 	// get our mongoose model
var Event 	= require('./app/models/event');

// =======================
// Configuration =========
// =======================
var port = process.env.PORT || 8080; 		// used to create, sign, and verify tokens
mongoose.connect(config.database); 			// connect to database
app.set('superSecret', config.secret); 		// secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// Routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.get('/setup', function(req, res) {

  mongoose.connection.db.dropDatabase(function(err, result) {
    console.log('Database cleared');
  });

  // create a sample user
  var lemur = new User({
    name: 'lemur',
    password: '11'
  });

  var azara = new User({
    name: 'azara',
    password: '11'
  });

// save the sample user
  lemur.save(function(err) {
    if (err) throw err;
  });

  // save the sample user
  azara.save(function(err) {
    if (err) throw err;
  });

  // create an event
  var we = new Event({
    _id: new mongoose.Types.ObjectId,
    label: "Week-end au Saleve",
    currency: "CHF",
    clients: [ {name: "lemur", weight: 1}, {name: "azara", weight: 1} ],
    spending: [{
      label: "Alcool",
      amount: 100,
      date: new Date,
      author: "lemur",
      concerned: [{
        name: "azara",
        weight: 1
        },
        {
        name: "lemur",
        weight: 1
        }]
    }]
  });

  we.save(function(err) {
    if (err) throw err;

    console.log("event saved successfully");
    res.json({success: true});
  });
});

// API ROUTES -------------------
// get an instance of the router for api routes
var apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

  console.log(req.body);

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});

// New user - check if a user is already used
apiRoutes.post('/users', function(req, res) {
  User.findOne({
      name: req.body.name
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        var newUser = new User(req.body);
        newUser.save(function(err) {
          if (!err) res.json({'success': true, 'user': newUser});
          else res.sendStatus(404);
        });
      } else if (user) {
        res.status(403).send({
            success: false,
            message: 'User already used.'
        });
      }
    });
});


// route middleware to verify a token
// apiRoutes.use(function(req, res, next) {
//
//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];
//
//   // decode token
//   if (token) {
//
//     // verifies secret and checks exp
//     jwt.verify(token, app.get('superSecret'), function(err, decoded) {
//       if (err) {
//         return res.json({ success: false, message: 'Failed to authenticate token.' });
//       } else {
//         // if everything is good, save to request for use in other routes
//         req.decoded = decoded;
//         next();
//       }
//     });
//
//   } else {
//
//     // if there is no token
//     // return an error
//     return res.status(403).send({
//         success: false,
//         message: 'No token provided.'
//     });
//
//   }
// });

//===============================================================
// GET

// Get the list of all events
apiRoutes.get('/events', function(req, res) {
  Event.find({}, function(err, events) {
    res.json(events);
  });
});

apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

apiRoutes.get('/users/:name', function(req, res) {
  User.find({name: req.params.username}, function(err, user) {
    if (!err) res.json({'success': true, 'user': user});
    else throw err;
  });
});

// Get all the events for one client
apiRoutes.get('/events/:name', function(req, res) {
  Event.find({ clients: { $elemMatch: {name: req.params.name} } }, function(err, events) {
    res.json(events);
  });
});

// Get event by id
apiRoutes.get('/events/:id', function(req, res) {
  Event.find({ _id: req.params.id}, function(err, data) {
    res.json(data);
  })
});

apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

apiRoutes.get('/friends', function(req, res) {
    User.find({}, 'name', function(err, users) {
        res.send(users);
    })
});

// Get total balance
apiRoutes.get('/balance/:idevent', function(req, res) {
    Event.findById(req.params.idevent, function(err, ev) {

        // Error handling
        if (err) {res.send({status:300}); console.log(err); return}

        // Balance computing
        var balance = {total: 0, spending: ev.spending, clients: [], recap: [], paid: []}

        var tmpId = 0;
        var share = 0

        for (var i = 0; i < ev.clients.length; i++) {
            balance.clients.push({spent: 0, shouldSpend: 0, name: ev.clients[i].name});
        }

        // Used to find the good id for clients name
        var clientsMap = [];
        for (var k = 0; k < balance.clients.length; k++) {
            clientsMap.push(balance.clients[k].name);
        }

        // For each spending, we balance the costs
        for (var i = 0; i < balance.spending.length; i++) {
            balance.total += balance.spending[i].amount;

            if (balance.spending[i].concerned.length > 1) {
                balance.spending[i].totWeight = 0;

                // Calculate what the client paid
                balance.clients[clientsMap.indexOf(balance.spending[i].author)].spent += balance.spending[i].amount;

                // Calculate the total weight of the spending
                for (var j = 0; j < balance.spending[i].concerned.length; j++) {
                    balance.spending[i].totWeight += (ev.spending[i].concerned[j].weight * ev.clients[j].weight);
                }

                // What every weight should pay
                share = balance.spending[i].amount / balance.spending[i].totWeight;

                // Calculate what one client should have paid
                for (var j = 0; j < balance.spending[i].concerned.length; j++) {
                    tmpId = clientsMap.indexOf(balance.spending[i].concerned[j].name);
                    balance.clients[tmpId].shouldSpend += share * ev.clients[tmpId].weight * ev.spending[i].concerned[j].weight;
                }
            }
            else {

                // If there is only one client concerned by the spending
                balance.clients[clientsMap.indexOf(balance.spending[i].concerned[0].name)].spent += balance.spending[i].amount;
                balance.clients[clientsMap.indexOf(balance.spending[i].concerned[0].name)].shouldSpend += balance.spending[i].amount;
            }
        }

        // Get what all clients paid for the event
        for (var i = 0; i < balance.clients.length; i++) {
            balance.paid.push({name: balance.clients[i].name, spent: balance.clients[i].spent})
        }

        var exchange = 0;
        for (var i = 0; i < balance.clients.length; i++) {
            if (balance.clients[i].spent < balance.clients[i].shouldSpend && Math.abs(balance.clients[i].spent - balance.clients[i].shouldSpend) > 0.01) {
                console.log('here');

                for (var j = 0; j < balance.clients.length; j++) {
                    if (j != i) {
                        if (balance.clients[j].spent > balance.clients[j].shouldSpend) {
                            exchange = balance.clients[j].spent - balance.clients[j].shouldSpend;

                            if (exchange > (balance.clients[i].shouldSpend - balance.clients[i].spent))
                                exchange = balance.clients[i].shouldSpend - balance.clients[i].spent;

                            console.log(balance.clients[i].name + " spent : " + balance.clients[i].spent + " should spend : " + balance.clients[i].shouldSpend);
                            console.log(balance.clients[j].name + " spent : " + balance.clients[j].spent + " should spend : " + balance.clients[j].shouldSpend);

                            balance.clients[i].spent += exchange;
                            balance.clients[j].spent -= exchange;
                            balance.recap.push({
                                who: balance.clients[i].name,
                                what: exchange,
                                toWho: balance.clients[j].name
                            });
                            break;
                        }
                    }
                }

            }
        }
        res.status(200).send(balance);
    });
});

//===============================================================
// POST

// New event
apiRoutes.post('/events/', function(req, res) {
  req.body._id = mongoose.Types.ObjectId();
  console.log(req.body);
  var newEvent = new Event(req.body);
  newEvent.save(function(err) {
    if (!err) res.json(newEvent);
    else throw err;
  });
});

//===============================================================
// PUT

// All the spending management pass through the update of an event
apiRoutes.put('/events/:eventid', function(req, res) {
    Event.findById(req.params.eventid, function(err, ev) {
        ev.label = req.body.label;
        ev.currency = req.body.currency;
        ev.spending = req.body.spending;
        ev.clients = req.body.clients;

        ev.save(function(err) {
            if (!err) res.json({success: true, ev: ev});
            else res.status(401).send({
                success: false,
                message: "Problem when updating event"
            })
        });
    });
});

//===============================================================
// DELETE

apiRoutes.delete('/event/:eventid', function(req, res) {
    Event.findByIdAndRemove(req.params.eventid, function(err) {
        if (err) res.status(400).send();
        else res.status(200).send();
    })
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
