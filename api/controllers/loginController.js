"use strict";
let express               = require('express'),
    User                  = require('../models/user'),
    passport              = require('passport'),
    LocalStrategy         = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    router                = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  return res.send('/Login');
});

router.post('/', loginPost);

function loginPost(req, res, next) {
  // ask passport to authenticate
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      return res.send('Your login attemp failed');
    }

    // if everything's OK
    req.logIn(user, function(err) {
      if (err) {
        req.session.messages = "Error";
        return next(err);
      }

      req.session.user     = {};
      req.session.user.username = user.username;
      req.session.user.name     = user.name;
      req.session.user.admin    = user.admin;
      return res.redirect('/');
    });

  })(req, res, next);
}

module.exports = router;
