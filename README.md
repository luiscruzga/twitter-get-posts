# twitter-get-posts
Allows to obtain the tweets of an twitter profile


## Pre requirements

You must have python 3 previously installed, once you have python, you must install the snscrape

```bash
  pip install snscrape
```

## Installation

Install twitter-get-posts with npm

```bash
  npm install twitter-get-posts
```

## Usage/Examples

Get a random post from a profile

```javascript
const TWITTER = require('twitter-get-posts');
const fs = require('fs');

TWITTER.getTweets('vegetabdn', 10)
.then(tweets => {
  fs.writeFileSync('./example/tweets.json', JSON.stringify(tweets, null, 2));
})
.catch(err => console.error(err));

```
