const express = require("express");
const jwt = require("jsonwebtokens");

const app = express();

// - DOCUMENTATION: [https://github.com/auth0/node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
// - TUTORIAL: [https://www.youtube.com/watch?v=7nafaH9SddU&ab_channel=TraversyMedia](https://www.youtube.com/watch?v=7nafaH9SddU&ab_channel=TraversyMedia)
//

// Protected route, has a middleware function called verifyToken
// When you want to make request to a protected route, you want to also send it a header value for authorization
// In PostMan:
// Key = Authorization
// Value = Bearer afterTheSpaceTheTokenGoesRightHere98098347109283410298347109238470129835701298374019283
app.post("/api/posts", verifyToken, (req, res) => {
  // token is in the req object bc verifyToken put it there
  // authData is going to be authentication data like username, email,
  jwt.verify(req.token, "mysecret", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      // should send back message, authData, and time stamp (if you want)
      res.json({
        message: "Post has been created",
        authData,
      });
    }
  });
});

//
//
//

// NEED A ROUTE TO GET THE TOKEN
app.post("/api/login", (req, res) => {
  // Mock user
  const user = {
    id: 1,
    username: "brad",
    email: "brad@gmail.com",
  };
  // Send user as the payload
  // Next parameter is secret key
  // Next parameter is a callback function (for async way)
  jwt.sign({ user: user }, "mysecret", (err, token) => {
    res.json({
      token: token,
    });
  });
  // NOTE: for the frontend, after you login and get this token, should save it in local storage, can also use cookies but that's not really recommended anymore, should use local storage
});

//
//
//

// FORMAT OF TOKEN:
// It's called a bearer token, so looks like this:
// Authorization: Bearer <access_token_here>
//                             ^ we want to take this part out of it

//
//
//

// VerifyToken
// Params are req, res, next. It runs, does what it needs to, and calls next
function verifyToken(req, res, next) {
  // Get auth header value
  // (When we send our token, we want to send it in the header, an we want to send it as the authorization value)
  // Get the authorization part of the header, this gives us the actual token
  const bearerHeader = req.header["athorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space in Bearer <access_token_here>
    const bearer = bearerHeader.split(" ");
    // Get token from array after split
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403); // can also send json here
  }
}
