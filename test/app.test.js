const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../app");

describe("GET /app", () => {
  it("should return an array of apps", () => {
    return supertest(app)
      .get("/apps")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf.at.least(1);
        const app = res.body[0];
        expect(app).to.include.all.keys("App", "Category", "Rating", "Genres");
      });
  });
  it("Should be 400 if sort is incorrect", () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "BLAH" })
      .expect(400, "Sort must be either rating or app");
  });
  it("Should sort by rating", () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "rating" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
        let sorted = true;
        let i = 0;
        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];
          if (appAtIPlus1.Rating > appAtI.Rating) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
  it("should filter results based on search", () => {
    return supertest(app)
      .get("/apps")
      .query({ genres: "puzzle" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
        let filtered = true;
        let i = 0;
        while (i < res.body.length) {
          const appAtI = res.body[i];
          if (!appAtI.Genres.includes("Puzzle")) {
            filtered = false;
            break;
          }
          i++;
        }
        expect(filtered).to.be.true;
      });
  });
});
