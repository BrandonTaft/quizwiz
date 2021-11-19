const express = require("express");
const models = require("../models");
const cors = require("cors");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const InstagramStrategy = require("passport-instagram").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models");
const session = require("express-session");
var connect = require("connect");
const { where } = require("sequelize");
var flash = require("flash");
var passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const { v4: uuidv4 } = require("uuid"); // uuid, To call: uuidv4();

require("dotenv").config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;

const salt = 10;

require("dotenv").config();
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PATCH, DELETE, PUT",
    allowedHeaders: "Content-Type, Authorization"
  })
);
//app.use(cors());
app.use(express.json());

app.use(
  session({
    genid: function(req) {
      return uuidv4();
    },
    secret: "SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000, secure: true } // 1 hour - set to true to only allow https
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//app.use(session({ secret: 'so secret' }))
app.use(passport.initialize());
app.use(passport.session());

//***************************REGISTRATION***************************//

app.post("/api/register", async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  

  let persistedUser = await models.Users.findOne({
    where: {
        name: userName
    }
})

if (persistedUser == null) {
    bcrypt.hash(password, salt, async (error, hash) => {
        console.log(hash)
        if (error) {
            res.json({ message: "Something Went Wrong!!!" })
        } else {
            const user = models.Users.build({
                name: userName,
                password: hash,
                high_score: "0"
            })
              
            let savedUser = await user.save()
            if (savedUser != null) {
              res.json({ success: true })
              
            }
        }
    })
} else {
  console.log('res.json({ message: "Existing User" })')
}
              
})
//***************************LOGIN PAGE***************************//

app.post("/api/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  let user = await models.Users.findOne({
    where: {
      name: username
    }
  });

  if (user != null) {
    bcrypt.compare(password, user.password, (error, result) => {
      if (result) {
        const token = jwt.sign({ name: username }, process.env.JWT_SECRET_KEY);
        res.json({
          success: true,
           name: username,
            high_score: "0",
        });
      } else {
        res.json({ success: false, message: "Not Authenticated" });
      }
    });
  } else {
    res.json({ message: "Username Incorrect" });
  }
});

// // app.post('/api/login', passport.authenticate('local', {
// //   successRedirect: 'http://google.com',
// //   failureRedirect: '/login',
// //   failureFlash: true,
// // }));
//
// app.post("/api/login", passport.authenticate("local",function(req, res) {
//   // If this function gets called, authentication was successful.
//   // To Access specific user info use- req.user.high_score
//   console.log("User was Authenticated")
//   //successRedirect: "https://quizwiz.me"

// }));

// passport.use(
//   new LocalStrategy(async function(username, password, done) {

//     const user = await models.Users.findOne({
//         where: {
//             name: username
//         }
//     })
//     if (user != null) {
//     bcrypt.compare(password,user.password, (error, result) => {
//       if (result) {
//         const token = jwt.sign({ name: username }, process.env.JWT_SECRET_KEY);
//         return done(null,
//           username
//         )
//       } else {
//         return done(console.log( "Not Authenticated" ))
//       }
//     })
//   } else {
//     return done({ message: "Username Incorrect" })
//   }
//     }))

//*******************Serialize User***********************//

passport.serializeUser(function(user, done) {
  console.log("user.id from serializeUser", user.id), done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  //models.Users.findById(id, function(err, user) {
  done(null, id);
  // });
});

//*******************  Google Strategy  ***********************//

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://quizwiz.me/login"
  }),
  function(req, res) {
    res.redirect("https://quizwiz.me/profile/" + req.user.displayName);
  }
);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://quiz-wiz-server.glitch.me/auth/google/callback"
    },
    async function(request, accessToken, refreshToken, profile, done) {
      //     return done(null, profile,
      //       console.log(JSON.stringify(profile), 'AccessToken:', accessToken, 'Refresh Token:', refreshToken))
      //   }
      // ));

      const name = profile.displayName;
      const password = profile.id;
      const token = profile.accessToken;

      const persistedUser = await models.Users.findOne({
        where: {
          name: name
        }
      });

      if (persistedUser == null) {
        console.log("user");
        bcrypt.hash(password, salt, async (error, hash) => {
          console.log(hash);
          if (error) {
            res.json({ message: "Something Went Wrong!!!" });
          } else {
            const user = models.Users.build({
              name: name,
              password: hash,
              high_score: "0"
            });

            let savedUser = await user.save();
            if (savedUser != null) {
              console.log("{ success: true }");

              //res.json(profile);
              return done(
                null,
                profile,
                console.log("new user was added by passport")
              );
            }
          }
        });
      } else {
        console.log('res.json({ message: "Existing User" })');
        return done(
          null,
          profile,

          console.log("existing user was authenticated")
        );
      }
    }
  )
);
//*******************  Facebook Strategy  ***********************//

app.get("/auth/facebook", passport.authenticate("facebook"));
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "https://quizwiz.me/login"
  }),
  function(req, res) {
    res.redirect("https://quizwiz.me/profile/" + req.user.displayName);
  }
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "https://quiz-wiz-server.glitch.me/auth/facebook/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
      //     return done(null, profile,
      //       console.log(JSON.stringify(profile), 'AccessToken:', accessToken, 'Refresh Token:', refreshToken))
      //   }
      // ));

      const name = profile.displayName;
      const password = profile.id;
      const token = profile.accessToken;

      const persistedUser = await models.Users.findOne({
        where: {
          name: name
        }
      });

      if (persistedUser == null) {
        console.log("user");
        bcrypt.hash(password, salt, async (error, hash) => {
          console.log(hash);
          if (error) {
            res.json({ message: "Something Went Wrong!!!" });
          } else {
            const user = models.Users.build({
              name: name,
              password: hash,
              spare_one: token,
              high_score: "0"
            });

            let savedUser = await user.save();
            if (savedUser != null) {
              console.log("{ success: true }");
              return done(
                null,
                profile,
                console.log(
                  JSON.stringify(profile),
                  "AccessToken:",
                  accessToken,
                  "Refresh Token:",
                  refreshToken
                )
              );
            }
          }
        });
      } else {
        console.log(
          'res.json({ message: " Sorry This UserName Already Exists." })'
        );
        return done(
          null,
          profile,
          console.log(
            JSON.stringify(profile),
            "AccessToken:",
            accessToken,
            "Refresh Token:",
            refreshToken
          )
        );
      }
    }
  )
);
//*******************  Instagram Strategy  ***********************//

app.get(
  "/auth/instagram",
  passport.authenticate("instagram", { scope: ["basic"] })
);
app.get(
  "/auth/instagram/callback",
  passport.authenticate("instagram", {
    failureRedirect: "https://quizwiz.me/login"
  }),
  function(req, res) {
    res.redirect("https://quizwiz.me/profile/" + req.user.displayName);
  }
);
passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: "https://quiz-wiz-server.glitch.me/auth/instagram/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
      //     return done(null, profile,
      //       console.log(JSON.stringify(profile), 'AccessToken:', accessToken, 'Refresh Token:', refreshToken))
      //   }
      // ));

      const name = profile.displayName;
      const password = profile.id;
      const token = profile.accessToken;

      const persistedUser = await models.Users.findOne({
        where: {
          name: name
        }
      });

      if (persistedUser == null) {
        console.log("user");
        bcrypt.hash(password, salt, async (error, hash) => {
          console.log(hash);
          if (error) {
            res.json({ message: "Something Went Wrong!!!" });
          } else {
            const user = models.Users.build({
              name: name,
              password: hash,
              spare_one: token,
              high_score: "0"
            });

            let savedUser = await user.save();
            if (savedUser != null) {
              console.log("{ success: true }");
              return done(
                null,
                profile,
                console.log(
                  JSON.stringify(profile),
                  "AccessToken:",
                  accessToken,
                  "Refresh Token:",
                  refreshToken
                )
              );
            }
          }
        });
      } else {
        console.log(
          'res.json({ message: " Sorry This UserName Already Exists." })'
        );
        return done(
          null,
          profile,
          console.log(
            JSON.stringify(profile),
            "AccessToken:",
            accessToken,
            "Refresh Token:",
            refreshToken
          )
        );
      }
    }
  )
);
//*******************  Github Strategy  ***********************//

app.get("/auth/github", passport.authenticate("github"));
app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "https://quizwiz.me/login"
  }),
  function(req, res) {
    res.redirect("https://quizwiz.me/profile/" + req.user.username);
  }
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "https://quiz-wiz-server.glitch.me/auth/github/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
      //     return done(null, profile,
      //       console.log(JSON.stringify(profile), 'AccessToken:', accessToken, 'Refresh Token:', refreshToken))
      //   }
      // ));

      const name = profile.username;
      const password = profile.id;
      const token = profile.accessToken;

      const persistedUser = await models.Users.findOne({
        where: {
          name: name
        }
      });

      if (persistedUser == null) {
        console.log("user");
        bcrypt.hash(password, salt, async (error, hash) => {
          console.log(hash);
          if (error) {
            //res.json({ message: "Something Went Wrong!!!" })
          } else {
            const user = models.Users.build({
              name: name,
              password: hash,
              spare_one: token,
              high_score: "0"
            });

            let savedUser = await user.save();
            if (savedUser != null) {
              console.log("{ success: true }");
              return done(
                null,
                profile,
                console.log(
                  JSON.stringify(profile),
                  "AccessToken:",
                  accessToken,
                  "Refresh Token:",
                  refreshToken
                )
              );
            }
          }
        });
      } else {
        console.log(
          'res.json({ message: " Sorry This UserName Already Exists." })'
        );
        return done(
          null,
          profile,
          console.log(
            JSON.stringify(profile),
            "AccessToken:",
            accessToken,
            "Refresh Token:",
            refreshToken
          )
        );
      }
    }
  )
);

//*************LOGOUT**********//

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

//***************************LeaderBoard***************************//

app.get("/api/highscore", (req, res) => {
  let leaderboard = [];
  models.Users.findAll({
    raw: true,
    limit: 10,
    group: ["high_score", "Users.id"],
    order: [[sequelize.fn("max", sequelize.col("high_score")), "DESC"]]

    //  [['score', 'Desc']]
  }).then(high_Score => {
    for (let i = 0; i < 5; i++) {
      leaderboard.push({
        username: high_Score[i]["name"],
        score: high_Score[i]["high_score"]
      });
    }
    res.json(leaderboard);
  });
});

//***************************Users HIGH SCORE***************************//

app.get("/api/userscore", async (req, res) => {
  let username = req.query["username"];
  let userScore = null;
  let score = await models.Users.findOne({
    where: {
      name: username
    }
  }).then(user_Score => {
    console.log(user_Score["dataValues"]["high_score"]);
    userScore = user_Score["dataValues"]["high_score"];
  });
  res.json({ score: userScore });
});

//***************************Get questions***************************//

app.get("/quiz/:category", (req, res) => {
  console.log(req.user);
  let category = req.params["category"];
  if (category == 100) {
    axios
      .get(
        `https://opentdb.com/api.php?amount=13&difficulty=easy&type=multiple`
      )
      .then(response => response.data)
      .then(result => {
        console.log(results.results);
        res.json(result.results);
      });
  } else {
    axios
      .get(
        `https://opentdb.com/api.php?amount=13&category=${category}&difficulty=easy&type=multiple`
      )
      .then(response => response.data)
      .then(result => {
        res.json(result.results);
      });
  }
});
//**************************Delete user**************************//

//localstorage.clear on users end as well
app.post("/api/deleteuser", async (req, res) => {
  console.log(req.body[0].userName);
  let user = await models.Users.destroy({
    where: {
      name: req.body[0].userName
    }
  }).then(removeduser => {
    console.log(`removed ${req.body[0].userName}`);
    res.send(`removed ${req.body[0].userName}`);
  });
});

//**************************Submit Score**************************//

app.post("/api/submit", async (req, res) => {
  console.log(req.user.username);
  let user = await models.Users.findOne({
    where: {
      name: req.user.username
    }
  });

  if (user["high_score"] < req.body.score) {
    models.Users.update(
      { high_score: req.body.score },
      { where: { name: req.user.username } }
    ).then(result => {
      res.send("New high score!");
    });
  } else {
    res.send("Better luck next time");
  }
});

//**************************Server Hosting**************************//
app.listen(8080, () => {
  console.log("Server is running...");
});
