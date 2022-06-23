const express = require("express");
const router = express.Router();

const { getUser, getUserById } = require("../controllers/User");
const { IsSignedIn, IsAuthenticated, IsAdmin } = require("../controllers/auth");

router.get("/user/get/:userId", IsSignedIn, getUser);
router.param("userId", getUserById);

module.exports = router;
