const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const { SignUp, SignIn } = require("../controllers/auth");

router.post(
  "/admin/signup",
  [
    check("user_name", "name should be atleast 5 charater").isLength({
      min: 5,
    }),
    check("user_email", "email is required").isEmail(),
    check("password", "password must be atleast 8 charater").isLength({
      min: 8,
    }),
  ],
  SignUp(1),
);

router.post(
  "/user/signup",
  [
    check("user_name", "name should be atleast 5 charater").isLength({
      min: 5,
    }),
    check("email", "email is required").isEmail(),
    check("password", "password must be atleast 8 charater").isLength({
      min: 8,
    }),
    // check("phone", "phone Number is Invalid").isLength({min: 10})
  ],
  SignUp(0),
);

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({ min: 1 }),
  ],
  SignIn,
);

module.exports = router;
