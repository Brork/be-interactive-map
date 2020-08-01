const { markerData } = require("../data/index.js");
const { formatDates, makeRefObj } = require("../utils/utils");

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return knex("markers").insert(markerData);
    });
};
