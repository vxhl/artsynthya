require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoutes = require("./routes/User");
const authRoutes = require("./routes/auth");
mongoose
  .connect("mongodb://localhost:27017/artsynthya", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("DataBase for artsynthya connected");
  })
  .catch((e) => {
    console.log("Error connecting to db", e);
  });

// parsers
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// routers
app.use("/api", userRoutes);
app.use("/api", authRoutes);

app.get("/", (req, res) => {
  return res.send("working");
});

const port = 8686;

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
