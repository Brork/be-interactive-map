exports.up = function (knex) {
  return knex.schema.createTable("markers", (markersTable) => {
    markersTable.increments("marker_id").primary();
    markersTable.integer("x").defaultTo(0);
    markersTable.integer("y").defaultTo(0);
    markersTable.string("body").notNullable();
    markersTable.integer("unix");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("markers");
};
