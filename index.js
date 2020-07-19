const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const moment = require('moment');
const path = require('path');

const KeybaseId = require('keybase-id');
const KeybaseStrategy = require('passport-keybase');

// initialize the KeybaseId library
const keybaseId = new KeybaseId({
  keybasePath: 'keybase',
  minKbScore: 0,
});

// set `KeybaseStrategy` options
const keybaseOptions = {
  keybaseId,
  passReqToCallback: false,
  signedMessageField: 'signedMessage',
  verifyTxtField: 'verifyTxt',
  usernameField: 'username',
};

// create `KeybaseStrategy` verify callback
const verifyCallback = (username, score, done) => {
  const user = {
    id: 1,
    user: 'lookup-user-using-username',
    username: username,
    score: score,
  };

  done(null, user);
};

// use the `KeybaseStrategy` strategy
passport.use(new KeybaseStrategy(keybaseOptions, verifyCallback));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: 'abcd1234',
};

passport.use(
  new JwtStrategy(jwtOptions, (jwtToken, done) => {
    const user = {
      id: jwtToken.id,
      score: jwtToken.score,
      username: 'lookup-user-using-jwtToken',
    };

    done(null, user);
  })
);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

// `{ session: false }` tells passport we're not storing anything in session, since we're passing around JWT tokens
app.post('/login', passport.authenticate('keybase', { session: false }), (req, res) => {
  // req.user contains the result you sent back in your verify callback method, `verifyCallback`
  // store the unique user id you looked up and returned in your verify callback, in a JWT token
  // normally you would not store the user's score in a token, this is for an example only
  const jwtPayload = { id: req.user.id, score: req.user.score };

  const expires = moment().add(2, 'h');
  const bearerToken = jwt.sign(jwtPayload, jwtOptions.secretOrKey, { expiresIn: '2h' });

  // return the JWT token
  res.json({ bearerToken, expires });
});

// read the JWT token containing the user ID and username
app.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
  const response = {
    isAuthenticated: req.isAuthenticated(),
  };

  if (response.isAuthenticated) {
    response.user = req.user;
  }

  res.json(response);
});

app.use('/', express.static(path.join(__dirname, 'public')));

const port = 3000;
app.listen(port, () => console.log(`App listening on http://localhost:${port}`));
