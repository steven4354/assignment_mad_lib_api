# MadLib Generation API

An API that allows you to generate MadLibs sentences.

Test this out! To use this API, create a token at this link: ------

## Getting Started

These instructions will allow you to use the API after you generate the token

### Prerequisites

Go to this link and get your unique token after signing up: -----

## Using the MadLib Create API

To use the API utilize curl to make GET and POST requests

```
curl -H "Authorization: Bearer <your-token>" -H "Content-Type: application/json" -d '{"sentence": <a-sentence-see-below-for-format>, "words": <a-word-array>}' http://<base-url-of-the-link>/api/v1/madlibgenerator
```

for the sentence value, the format will be like this:
```
"{{ a_noun}} is {{ an_adjective }} {{ noun }} "
```

you can place in the {{ }} these terms:
- a_noun
- noun
- an_adjective
- verb
- a_verb
- an_adverb

for the word value, you can place as many words as you want in the word array just make sure each
word is placed in quotes like this " "

the api will automatically detect adverbs, verbs, nouns and adjectives from the array

here is an example of a request

```
curl -H "Authorization: Bearer 811adff41e1c1b87f7b9ba4f09a60" -H "Content-Type: application/json" -d '{"sentence": "{{ a_noun}} is {{ an_adjective }} {{ noun }} ", "words": ["cool", "nice", "awesome", "rock", "person"]}' http://127.0.0.1:3000/api/v1/madlibgenerator
```

and its output

```
a rock is a nice person
```

## Using the MadLib Word Generator API

You can also use the API to generate nouns, verbs, adverbs and/or adjectives

here is an example input:
```
curl -v -H "Authorization: Bearer 811adff41e1c1b4d887f7b9ba4f09a60" http://127.0.0.1:3000/api/v1/partsofspeech?partofspeech=verb&num=11
```

and its output
```
['run']
```

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Elias** - *Initial work*
* **Steven** - *Initial work*
