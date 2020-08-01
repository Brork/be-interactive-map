const {
  fetchAllMarkers,
  createMarker,
  fetchMarkerById,
  updateMarkerById,
  removeMarkerById,
} = require("../models/markers.models");

// pathway GET /api/markers

exports.getAllMarkers = (req, res, next) => {
  fetchAllMarkers()
    .then((markers) => {
      res.send({ markers });
    })
    .catch((err) => {
      next(err);
    });
};

// pathway POST /api/markers
exports.postNewMarker = (req, res, next) => {
  const { x, y, body, unix } = req.body;
  createMarker(x, y, body, unix)
    .then((marker) => {
      res.status(201).send({ marker });
    })
    .catch((err) => {
      next(err);
    });
};

// pathway GET /api/markers/:marker_id
exports.getMarkerById = (req, res, next) => {
  fetchMarkerById(req.params)
    .then((marker) => {
      res.send({ marker });
    })
    .catch((err) => {
      next(err);
    });
};

// pathway PATCH /api/markers/:marker_id
exports.patchMarkerById = (req, res, next) => {
  updateMarkerById(req.params, req.body)
    .then((marker) => {
      res.send({ marker });
    })
    .catch((err) => {
      next(err);
    });
};

// pathway DELETE /api/markers/:marker_id
exports.deleteMarkerById = (req, res, next) => {
  removeMarkerById(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
