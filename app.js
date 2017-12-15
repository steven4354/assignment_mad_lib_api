const express = require("express");
const app = express();

// ----------------------------------------
// App Variables
// ----------------------------------------
app.locals.appName = "Ponzi.io";

// ----------------------------------------
// ENV
// ----------------------------------------
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieSession = require("cookie-session");

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "secret"]
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ----------------------------------------
// Flash Messages
// ----------------------------------------
const flash = require("express-flash-messages");
app.use(flash());

// ----------------------------------------
// Method Override
// ----------------------------------------
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");

app.use(
  methodOverride(
    getPostSupport.callback,
    getPostSupport.options // { methods: ['POST', 'GET'] }
  )
);

// ----------------------------------------
// Referrer
// ----------------------------------------
app.use((req, res, next) => {
  req.session.backUrl = req.header("Referer") || "/";
  next();
});

// ----------------------------------------
// Public
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));

// ----------------------------------------
// Logging
// ----------------------------------------
const morgan = require("morgan");
const morganToolkit = require("morgan-toolkit")(morgan);

app.use(morganToolkit());

//-----------------------------------------
// Mongoose Settings
//-----------------------------------------
const {User} = require("./models");
const mongoose = require("mongoose");

console.log("mongoose stuff intialized");

app.use((req, res, next) => {
  console.log("use for mongoose callback");
  if (mongoose.connection.readyState) {
    console.log("if (mongoose.connection.readyState)");
    next();
  } else {
    console.log("else (mongoose.connection.readyState)");
    require("./mongo")().then(() => next());
    console.log("else (mongoose.connection.readyState)");
  }
});

// ----------------------------------------
// Passport
// ----------------------------------------
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

// Create local strategy

const LocalStrategy = require("passport-local").Strategy;

//see this post on why local strategy was changed
//https://stackoverflow.com/questions/34511021/passport-js-missing-credentials
//old local strategy
// passport.use(
//   new LocalStrategy(function(email, password, done) {
//     User.findOne({ email }, function(err, user) {
//       if (err) return done(err);
//       if (!user || !user.validPassword(password)) {
//         return done(null, false, { message: 'Invalid email/password' });
//       }
//       return done(null, user);
//     });
//   })
// );

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password"
  },
  function(email, password, done) {
    User.findOne({email}, function(err, user) {
      if (err) return done(err);
      if (!user || !user.validPassword(password)) {
        return done(null, false, {message: "Invalid email/password"});
      }
      return done(null, user);
    });
  }
);

// Create the token bearer strategy
const BearerStrategy = require("passport-http-bearer").Strategy;
const bearerStrategy = new BearerStrategy((token, done) => {
  // Find the user by token
  User.findOne({token: token})
    .then(user => {
      // Pass the user if found else false
      return done(null, user || false);
    })
    .catch(e => done(null, false));
});

// Use the strategy middlewares
passport.use(localStrategy);
passport.use(bearerStrategy);

// Serializing user with ID
// Serialize and deserialize the user with the user ID
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  // Find the user in the database
  User.findById(id)
    .then(user => done(null, user))
    .catch(e => done(null, false));
});

// ----------------------------------------
// Session Helper Middlewares
// ----------------------------------------

// Set up middleware to allow/disallow login/logout
const loggedInOnly = (req, res, next) => {
  return req.user ? next() : res.redirect("/login");
};

const loggedOutOnly = (req, res, next) => {
  return !req.user ? next() : res.redirect("/");
};

// ----------------------------------------
// Routes
// ----------------------------------------

app.use("/", (req, res) => {
  req.flash("Hi!");
  res.render("welcome/index");
});

// Show login only if logged out
app.get("/login", loggedOutOnly, (req, res) => {
  res.render("sessions/new");
});

// Show login only if logged out
app.get("/login", loggedOutOnly, (req, res) => {
  res.render("sessions/new");
});

// Allow logout via GET and DELETE
const onLogout = (req, res) => {
  // Passport convenience method to logout
  req.logout();

  // Ensure always redirecting as GET
  req.method = "GET";
  res.redirect("/login");
};
app.get("/logout", loggedInOnly, onLogout);
app.delete("/logout", loggedInOnly, onLogout);

// Create session with passport
app.post(
  "/sessions",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

// Pass logged in/out middlewares to users router
const usersRouter = require("./routers/users")({
  loggedInOnly,
  loggedOutOnly
});
app.use("/", usersRouter);

// Setup API router
const furiousSpinoffsRouter = require("./routers/furious_spinoffs");
app.use("/api/v1", furiousSpinoffsRouter);

// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require("express-handlebars");
const helpers = require("./helpers");

const hbs = expressHandlebars.create({
  helpers: helpers,
  partialsDir: "views/", //this is how to use partials - any file in views can be rendered as a partial
  defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// ----------------------------------------
// Server
// ----------------------------------------
const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";

let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}\n`);
});

// Disable logging in test mode
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("tiny"));
}

// If we're running this file directly
// start up the server
if (require.main === module) {
  app.listen.apply(app, args);
}

// ----------------------------------------
// Error Handling
// ----------------------------------------
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).render("errors/500", {error: err});
});

module.exports = app;
