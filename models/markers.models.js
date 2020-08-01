const connection = require("../db/connect");

// model for GET /api/markers

exports.fetchAllMarkers = () => {
  return connection("markers")
    .select("*")
    .then((result) => {
      return result;
    });
};

// model for POST /api/markers

exports.createMarker = (x, y, body, unix) => {
  if (
    typeof x === "number" &&
    typeof x !== NaN &&
    typeof y === "number" &&
    typeof y !== NaN &&
    typeof body === "string" &&
    body.length < 256 &&
    typeof unix === "number" &&
    typeof unix !== NaN
  ) {
    return connection("markers")
      .insert({ x, y, body, unix })
      .returning("*")
      .then((marker) => {
        return marker[0];
      });
  } else {
    return Promise.reject({
      status: 400,
      msg: "400 - bad request",
    });
  }
};

// model for GET /api/markers/marker_id

exports.fetchMarkerById = (params) => {
  return connection("markers")
    .where(params)
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404 - not found",
        });
      } else {
        return result[0];
      }
    });
};

// model for pathway PATCH /api/comments/:comment_id

exports.updateMarkerById = (params, body) => {
  const updateObj = updateObjectBuilder(body);

  if (updateObj === false || Object.keys(updateObj).length === 0) {
    return Promise.reject({ status: 400, msg: "400 - bad request" });
  } else {
    return connection("markers")
      .where(params)
      .update(updateObj)
      .returning("*")
      .then((marker) => {
        if (marker.length > 0) {
          return marker[0];
        } else {
          return Promise.reject({ status: 404, msg: "404 - not found" });
        }
      });
  }
};

// Builds object of keys to update for marker database, will return false if update datatypes are invalid
const updateObjectBuilder = (body) => {
  const query = {};

  for (const key in body) {
    if (key === "x") {
      if (typeof body[key] === "number" && body[key] !== NaN) {
        query.x = body[key];
      } else {
        return false;
      }
    }

    if (key === "y") {
      if (typeof body[key] === "number" && body[key] !== NaN) {
        query.y = body[key];
      } else {
        return false;
      }
    }

    if (key === "body") {
      if (typeof body[key] === "string" && body[key].length < 256) {
        query.body = body[key];
      } else {
        return false;
      }
    }

    if (key === "unix") {
      if (typeof body[key] === "number" && body[key] !== NaN) {
        query.unix = body[key];
      } else {
        return false;
      }
    }
  }

  return query;
};

// model for pathway POST /api/comments/:comment_id

exports.removeMarkerById = (params) => {
  return connection("markers")
    .where(params)
    .then((marker) => {
      if (marker.length === 0) {
        return Promise.reject({ status: 404, msg: "404 - not found" });
      } else {
        return connection("markers").where(params).del();
      }
    });
};
