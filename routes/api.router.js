const apiRouter = require("express").Router();
const markersRouter = require("./markers.router");
const endpoints = require("../endpoints");

apiRouter
  .route("/")
  .get((req, res, next) => {
    res.send(endpoints);
  })
  .all((req, res, next) => {
    res.status(405).send({ msg: "405 - not allowed" });
  });

apiRouter.use("/markers", markersRouter);

module.exports = apiRouter;
