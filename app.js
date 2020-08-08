const express = require("express");
const apiRouter = require("./routes/api.router");
const { customErrors, psqlErrors, handle500s } = require("./errors");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api", apiRouter);

// Error handling
app.use(customErrors);
app.use(psqlErrors);
app.use(handle500s);

module.exports = app;
