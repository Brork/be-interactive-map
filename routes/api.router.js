const apiRouter = require("express").Router();
const markersRouter = require("./markers.router");
const mapRouter = require("./map.router");
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

apiRouter.use("/map", mapRouter);

module.exports = apiRouter;
