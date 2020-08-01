const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
chai.use(require("chai-sorted"));
const app = require("../app");
const connection = require("../db/connect");

describe("/api", () => {
  after(() => connection.destroy());
  beforeEach(() => {
    return connection.seed.run();
  });
  describe("GET", () => {
    it("GET 200 - responds with json of all endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.an("object");
        });
    });
  });
  describe("/markers", () => {
    describe("GET", () => {
      it("GET 200 - responds with all markers", () => {
        return request(app)
          .get("/api/markers")
          .expect(200)
          .then((response) => {
            expect(response.body.markers).to.be.an("array");
            response.body.markers.forEach((marker) => {
              expect(marker).to.contain.keys([
                "marker_id",
                "x",
                "y",
                "body",
                "unix",
              ]);
            });
          });
      });
    });
    describe("POST", () => {
      it("POST 201 - creates a new row in the markers table and responds with an object with the details of the new row in the marker table", () => {
        return request(app)
          .post("/api/markers")
          .send({ x: 250, y: 250, body: "test", unix: 1596191576 })
          .expect(201)
          .then((response) => {
            expect(response.body.marker).to.contain.keys([
              "marker_id",
              "x",
              "y",
              "body",
              "unix",
            ]);
            expect(response.body.marker.marker_id).to.eql(3);
            expect(response.body.marker.body).to.eql("test");
          });
      });
      it("POST 400 - if request body does not have x key-value pair ", () => {
        return request(app)
          .post("/api/markers")
          .send({ y: 250, body: "test", unix: 1596191576 })
          .expect(400)
          .then((response) => {
            expect(response.body.msg).to.eql("400 - bad request");
          });
      });
      it("POST 400 - if request body does not have y key-value pair ", () => {
        return request(app)
          .post("/api/markers")
          .send({ x: 250, body: "test", unix: 1596191576 })
          .expect(400)
          .then((response) => {
            expect(response.body.msg).to.eql("400 - bad request");
          });
      });
      it("POST 400 - if request body does not have body key-value pair ", () => {
        return request(app)
          .post("/api/markers")
          .send({ x: 250, y: 250, unix: 1596191576 })
          .expect(400)
          .then((response) => {
            expect(response.body.msg).to.eql("400 - bad request");
          });
      });
      it("POST 400 - if request body does not have unix key-value pair ", () => {
        return request(app)
          .post("/api/markers")
          .send({ x: 250, y: 250, body: "test" })
          .expect(400)
          .then((response) => {
            expect(response.body.msg).to.eql("400 - bad request");
          });
      });
      it("POST 400 - if request body x key-value pair is not a number", () => {
        return request(app)
          .post("/api/markers")
          .send({ x: "250", y: 250, body: "test", unix: 1596191576 })
          .expect(400)
          .then((response) => {
            expect(response.body.msg).to.eql("400 - bad request");
          });
      });
      it("POST 400 - if request body y key-value pair is not a number", () => {
        return request(app)
          .post("/api/markers")
          .send({ x: 250, y: "250", body: "test", unix: 1596191576 })
          .expect(400)
          .then((response) => {
            expect(response.body.msg).to.eql("400 - bad request");
          });
      });
      it("POST 400 - if request body body key-value pair is not a string", () => {
        return request(app)
          .post("/api/markers")
          .send({ x: 250, y: 250, body: 1, unix: 1596191576 })
          .expect(400)
          .then((response) => {
            expect(response.body.msg).to.eql("400 - bad request");
          });
      });
      it("POST 400 - if request body unix key-value pair is not a number", () => {
        return request(app)
          .post("/api/markers")
          .send({ x: 250, y: 250, body: "test", unix: "1596191576" })
          .expect(400)
          .then((response) => {
            expect(response.body.msg).to.eql("400 - bad request");
          });
      });
      it("POST 201 - post request ignores additional key value pairs provided", () => {
        return request(app)
          .post("/api/markers")
          .send({
            x: 250,
            y: 250,
            body: "test",
            unix: 1596191576,
            test: 9001,
          })
          .expect(201)
          .then((response) => {
            expect(response.body.marker).to.contain.keys([
              "marker_id",
              "x",
              "y",
              "body",
              "unix",
            ]);
            expect(response.body.marker.marker_id).to.eql(3);
            expect(response.body.marker.body).to.eql("test");
          });
      });
    });
    describe("/:marker_id", () => {
      describe("GET", () => {
        it("GET 200 - responds with marker object that contains information from user & comments", () => {
          return request(app)
            .get("/api/markers/1")
            .expect(200)
            .then((response) => {
              expect(response.body.marker).to.be.an("object");
              expect(response.body.marker).to.contain.keys([
                "marker_id",
                "x",
                "y",
                "body",
                "unix",
              ]);
            });
        });
        it("GET 404 - responds with appropriate error message when asked for marker that doesn't exist", () => {
          return request(app)
            .get("/api/markers/212")
            .expect(404)
            .then((response) => {
              expect(response.body.msg).to.eql("404 - not found");
            });
        });
        it("GET 400 - responds with appropriate error message when not using integer to select marker", () => {
          return request(app)
            .get("/api/markers/herro")
            .expect(400)
            .then((response) => {
              expect(response.body.msg).to.eql("400 - bad request");
            });
        });
      });
      describe("PATCH", () => {
        it("PATCH 200 - responds with marker object with body updated if request.body contains body key value pair", () => {
          return request(app)
            .patch("/api/markers/1")
            .send({ body: "test" })
            .expect(200)
            .then((response) => {
              expect(response.body.marker).to.be.an("object");
              expect(response.body.marker.marker_id).to.eql(1);
              expect(response.body.marker.body).to.eql("test");
              expect(response.body.marker).to.contain.keys([
                "marker_id",
                "x",
                "y",
                "body",
                "unix",
              ]);
            });
        });
        it("PATCH 200 - responds with marker object with x updated if request.body contains x key value pair", () => {
          return request(app)
            .patch("/api/markers/1")
            .send({ x: 250 })
            .expect(200)
            .then((response) => {
              expect(response.body.marker.x).to.eql(250);
            });
        });
        it("PATCH 200 - responds with marker object with y updated if request.body contain y key value pair", () => {
          return request(app)
            .patch("/api/markers/1")
            .send({ y: 250 })
            .expect(200)
            .then((response) => {
              expect(response.body.marker.y).to.eql(250);
            });
        });
        it("PATCH 200 - responds with marker object with unix updated if request.body contain unix key value pair", () => {
          return request(app)
            .patch("/api/markers/1")
            .send({ unix: 1596203070 })
            .expect(200)
            .then((response) => {
              expect(response.body.marker.unix).to.eql(1596203070);
            });
        });
        it("PATCH 400 - responds with appropriate error message if no correct key value pairs are included", () => {
          return request(app)
            .patch("/api/markers/1")
            .send({})
            .expect(400)
            .then((response) => {
              expect(response.body.msg).to.eql("400 - bad request");
            });
        });
        it("PATCH 400 - responds with appropriate error message if trying to update marker with non-integer marker_id route", () => {
          return request(app)
            .patch("/api/markers/carabou")
            .send({ x: 400 })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).to.eql("400 - bad request");
            });
        });
        it("PATCH 400 - responds with appropriate error message if trying to update x with non-integer", () => {
          return request(app)
            .patch("/api/markers/1")
            .send({ x: "elk" })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).to.eql("400 - bad request");
            });
        });
        it("PATCH 400 - responds with appropriate error message if trying to update y with non-integer", () => {
          return request(app)
            .patch("/api/markers/1")
            .send({ y: "elk" })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).to.eql("400 - bad request");
            });
        });
        it("PATCH 400 - responds with appropriate error message if trying to update unix with non-integer", () => {
          return request(app)
            .patch("/api/markers/1")
            .send({ unix: "elk" })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).to.eql("400 - bad request");
            });
        });
        it("PATCH 400 - responds with appropriate error message if trying to update unix with non-string", () => {
          return request(app)
            .patch("/api/markers/1")
            .send({ body: 23 })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).to.eql("400 - bad request");
            });
        });
        it("PATCH 400 - responds with appropriate error message when trying to edit a comment that doesn't exist", () => {
          return request(app)
            .patch("/api/markers/801")
            .send({ x: 40 })
            .expect(404)
            .then((response) => {
              expect(response.body.msg).to.eql("404 - not found");
            });
        });
      });
      describe("DELETE", () => {
        it("DELETE 204 - deletes enquiry and responds with correct status code", () => {
          return request(app).delete("/api/markers/1").expect(204);
        });
        it("DELETE 404 - responds with appropriate error when trying to delete non-existant", () => {
          return request(app)
            .delete("/api/markers/404")
            .expect(404)
            .then((response) => {
              expect(response.body.msg).to.eql("404 - not found");
            });
        });
        it("DELETE 400 - responds with appropriate error when deleting error with incorrect datatype as param", () => {
          return request(app)
            .delete("/api/markers/captainAhab")
            .expect(400)
            .then((response) => {
              expect(response.body.msg).to.eql("400 - bad request");
            });
        });
      });
    });
  });
});
