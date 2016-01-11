"use strict";
let express               = require('express'),
    User                  = require('../models/user'),
    passport              = require('passport'),
    LocalStrategy         = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    router                = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  User.find({},(err,user) => {
        User.find({},(err,users) => {
          //hide password
          for (let i = 0; i < users.length; i++)
            users[i].password  = '****';
          return res.json(users);
        });
  });
});

router.get('/find/', (req, res, next) => {
  User.find({},(err,users) => { res.json(users);});
});

router.get('/:username', (req, res, next) => {
    User.find({username :req.params.username }, (err, user) => {
        if (err) return res.send('Error Finding user');
        //hide password
        user[0].password = '****';
        return res.json(user);
    });
});

router.get('/delete/:username', (req, res, next) => {
    User.findOneAndRemove({username :req.params.username }, (err, user) => {
        if (err) return res.send('Error deleting user');
        return res.send('deleted');
    });
});

module.exports = router;
