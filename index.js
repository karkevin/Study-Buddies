const express = require("express");
require("dotenv").config();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send({ message: "hello" });
});

app.listen(port, () => console.log(`listening on port ${port}`));


function matchingAlgorithm(userId)
