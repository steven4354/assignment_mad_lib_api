const app = require("../app");
const request = require("request");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const qs = require("qs");

describe("App", () => {
  const baseUrl = "http://localhost:8888";
  const apiUrl = baseUrl + "/api/v1/";
  let server;
  let user;
  const apiUrlFor = (type, params) => {
    params = params ? `&${qs.stringify(params)}` : "";
    return `${apiUrl}${type}?access_token=${user.token}${params}`;
  };
  const j = str => JSON.parse(str);

  beforeAll(done => {
    server = app.listen(8888, () => {
      done();
    });
  });

  beforeEach(done => {
    User.create({
      fname: "Foo",
      lname: "Bar",
      email: "foobar@gmail",
      password: "password"
    }).then(result => {
      user = result;
      done();
    });
  });

  afterAll(done => {
    server.close();
    server = null;
    done();
  });

  // ----------------------------------------
  // App
  // ----------------------------------------
  it("renders the home page", done => {
    request.get(baseUrl, (err, res, body) => {
      expect(res.statusCode).toBe(200);
      expect(body).toMatch(/api/i);
      done();
    });
  });

  // ----------------------------------------
  // MadLibs
  // ----------------------------------------
  it("expect a sentence", done => {
    request.post(
      "http://localhost:8888/api/v1/madlibgenerator",
      {
        json: true,
        Authorization: "Bearer 811adff41e1c1b4d887f7b9ba4f09a60",
        body: {
          sentence: "{{ a_noun}} is {{ an_adjective }} {{ noun }} ",
          words: ["cool", "nice", "awesome", "rock", "person"]
        }
      },
      function(error, response) {
        console.log(response.body);
        expect(response.statusCode).toEqual(200);
        done();
      }
    );
  });
});
