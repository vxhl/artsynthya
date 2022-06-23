const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const expressJwt = require("express-jwt");
const { expressjwt: expressJwt } = require("express-jwt");

exports.SignUp = (role) => {
  return async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].smsg,
      });
    }

    const user = new User(req.body);
    user.role = role;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
    user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save user in DB",
        });
      }

      const token = jwt.sign({ _id: user._id }, process.env.SECRET);
      res.cookie("token", token, { expire: new Date() + 9999 });
      return res.status(200).json({
        message: "Success",
        token,
      });
    });
  };
};

exports.SignIn = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Email does not exists",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password does not match",
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //  send response to front end server
    const { _id, user_name, user_email, role } = user;
    return res.status(200).json({
      token,
      user: {
        userId: _id,
        userName: user_name,
        userEmail: user_email,
        role: role,
      },
    });
  });
};

exports.signout = (req, res) => {
  res.clearcookie("token");
  res.json({
    msg: "Sign out Successfull",
  });
};

exports.IsSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.IsAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    // console.log(checker)
    console.log(req.auth._id);
    return res.status(400).json({
      error: " ACCESS DENIED",
    });
  }
  next();
};

exports.IsAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, Access denied",
    });
  }
  next();
};
