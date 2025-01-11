const express = require("express");
const movementController = require('./movement/movementController')
const userController = require('./user/userController');
const cors = require("cors");

const port = 8181;
const host = "localhost";
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use(movementController, userController);

app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});
