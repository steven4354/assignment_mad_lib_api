const express = require("express");
const router = express.Router();
const helpers = require("./../helpers");
const h = helpers.registered;
const furiousSpinoff = require("furious_spinoff");
const passport = require("passport");
var Sentencer = require('sentencer');

//do word
var WordPOS = require("wordpos"),
  wordpos = new WordPOS();

// ----------------------------------------
// Index
// ----------------------------------------
router.get('/madlibgenerator', //?sentence=string&words=""

passport.authenticate("bearer", {session: false}),
  
  async (req, res, next) => {



    try { 
      let words = req.query.words.split(",");
      

      Sentencer.configure({
  // the list of nouns to use. Sentencer provides its own if you don't have one! 
  nounList: [],
 
  // the list of adjectives to use. Again, Sentencer comes with one! 
  adjectiveList: [],
  
  //verbs
  verbList: [],

  //adverbs

  adverbList: [],
  // additional actions for the template engine to use. 
  // you can also redefine the preset actions here if you need to. 
  // See the "Add your own actions" section below. 
  actions: {
    my_action: function(){
      return "something";
    }
  }
});




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

      if (partofspeech === "verb"){
      let result = await wordpos.randVerb({count: num});
      } else if 
         (partofspeech === "noun") {
      let result = await wordpos.randNoun({count: num});
          } else if 
          (partofspeech === "adverb"){
              let result = await wordpos.randAdverb({count: num});
          } else if 
          (partofspeech === "adjective"){
              let result = await wordpos.randAdjective({count: num});
          }
      }








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
