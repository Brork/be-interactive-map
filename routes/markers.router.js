const markersRouter = require("express").Router();
const {
  getAllMarkers,
  postNewMarker,
  getMarkerById,
  patchMarkerById,
  deleteMarkerById,
} = require("../controllers/markers.controllers.js");

markersRouter
  .route("/")
  .get(getAllMarkers)
  .post(postNewMarker)
  .all((req, res, next) => {
    res.status(405).send({ msg: "405 - not allowed" });
  });

markersRouter
  .route("/:marker_id")
  .get(getMarkerById)
  .patch(patchMarkerById)
  .delete(deleteMarkerById)
  .all((req, res, next) => {
    res.status(405).send({ msg: "405 - not allowed" });
  });

module.exports = markersRouter;
