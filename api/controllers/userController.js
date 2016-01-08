"use strict";
let express               = require('express'),
    User                  = require('../models/user'),
    passportLocalMongoose = require('passport-local-mongoose'),
    router                = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  User.find({},(err,user) => {
        User.find({},(err,users) => { res.json(users);});
  });
});

router.get('/find/', (req, res, next) => {
  User.find({},(err,users) => { res.json(users);});
});

router.get('/find/:username', (req, res, next) => {
    User.find({username :req.params.username }, (err, user) => {
        if (err) console.log('error');
        res.json(user);
    });
});

router.get('/delete/:username', (req, res, next) => {
    User.findOneAndRemove({username :req.params.username }, (err, user) => {
        if (err) console.log('error');
    });
});

/* POST user . */
router.post('/add', (req, res, next) => {
  let params   = {};
      params.name     = req.body.name;
      params.username = req.body.username;
      params.password = req.body.password;
      params.admin    = parseInt(req.body.admin);
      params.date     = new Date();

  // create a new user
  var newUser = User(params);

  //save the user
  newUser.save( (err) => {
    if (err) console.log('error');
    res.json(newUser);
  });

});

module.exports = router;
