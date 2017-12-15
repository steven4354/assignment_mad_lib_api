const express = require("express");
const router = express.Router();
const helpers = require("./../helpers");
const h = helpers.registered;
const furiousSpinoff = require("furious_spinoff");
const passport = require("passport");

//do word
var WordPOS = require("wordpos"),
  wordpos = new WordPOS();
var Sentencer = require("sentencer");

// ----------------------------------------
// Index
// ----------------------------------------
router.post(
  "/madlibgenerator", //no queries //post body sentence="" and words=[]

  //passport.authenticate("bearer", {session: false}),

  async (req, res, next) => {
    try {
      console.log(req.body)
      let words = req.body.words || "";
      words = await wordpos.getPOS(words);

      // {
      //   nouns:[],       Array of words that are nouns
      //   verbs:[],       Array of words that are verbs
      //   adjectives:[],  Array of words that are adjectives
      //   adverbs:[],     Array of words that are adverbs
      //   rest:[]         Array of words that are not in dict or could not be categorized as a POS
      // }

      await Sentencer.configure({
        // the list of nouns to use. Sentencer provides its own if you don't have one!
        nounList: words.nouns,

        // the list of adjectives to use. Again, Sentencer comes with one!
        adjectiveList: words.adjectives,

        //verbs
        verbList: words.verbs,

        //adverbs

        adverbList: words.adverbs
      });

      let result = await Sentencer.make(req.body.sentence);

      res.status(200).json(result);

      //testing
      /*
      curl -X POST -H "Content-Type: application/json" -d '{Authorization: "Bearer 811adff41e1c1b4d887f7b9ba4f09a60", sentence: "This is {{ an_adjective }} sentence", words: [cool]}' http://127.0.0.1:3000/api/v1/madlibgenerator
      curl -v -H "Authorization: Bearer 811adff41e1c1b4d887f7b9ba4f09a60" -H "Content-Type: application/json" -d '{sentence: "This is {{ an_adjective }} sentence", words: [cool]}' http://127.0.0.1:3000/api/v1/madlibgenerator
      curl -H "Content-Type: application/json" -X POST -d '{"sentence": "This is a sentence"}' http://127.0.0.1:3000/api/v1/madlibgenerator

//"Authorization: Bearer ffba104054be2dd3e61f1208a4a99a99"
      */
    } catch (e) {
      console.log(e);
    }
  }
);

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

      if (partofspeech === "verb") {
        let result = await wordpos.randVerb({count: num});
      } else if (partofspeech === "noun") {
        let result = await wordpos.randNoun({count: num});
      } else if (partofspeech === "adverb") {
        let result = await wordpos.randAdverb({count: num});
      } else if (partofspeech === "adjective") {
        let result = await wordpos.randAdjective({count: num});
      }

      res.status(200).json(result);

      //testing
      //curl -v -H "Authorization: Bearer 811adff41e1c1b4d887f7b9ba4f09a60" http://127.0.0.1:3000/api/v1/partsofspeech?partofspeech=verb&num=10
    } catch (e) {
      console.log(e);
    }
  }
);

module.exports = router;
