const express = require("express");
const controller = require("./controller")
const cors = require("cors");

const port = 8181;
const host = 'localhost'; 
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use(controller);

app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});
