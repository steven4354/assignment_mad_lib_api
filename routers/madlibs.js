const express = require("express");
const router = express.Router();
const helpers = require("./../helpers");
const h = helpers.registered;
const furiousSpinoff = require("furious_spinoff");
const passport = require("passport");

//do word
var WordPOS = require("wordpos"),
  wordpos = new WordPOS();

// ----------------------------------------
// Index
// ----------------------------------------
router.get(
  "/partsofspeech", //?partofspeech=verb&num=10

  // Register the passport bearer strategy middleware
  // we this router's only route
  passport.authenticate("bearer", {session: false}),

  // Callback for the route
  // serves the data from the API
  async (req, res, next) => {
    try {
      const num = req.query.num || 10;
      const partofspeech = req.query.partofspeech || verb;

      // const words = {
      //   verb: () => {
      //     return wordpos.randVerb({count: num});
      //   },
      //   noun: () => {
      //     return wordpos.randNoun({count: num});
      //   },
      //   adverb: () => {
      //     return wordpos.randAdjective({count: num});
      //   },
      //   adjective: () => {
      //     return wordpos.randAdverb({count: num});
      //   }
      // };

      let result = await wordpos.randVerb({count: num});

      console.log("result: " + result);
      res.status(200).json(result);

      //testing
      //curl -v -H "Authorization: Bearer 811adff41e1c1b4d887f7b9ba4f09a60" http://127.0.0.1:3000/api/v1/partsofspeech?partofspeech=verb&num=10
    } catch (e) {
      console.log(e);
    }
  }
);

module.exports = router;
