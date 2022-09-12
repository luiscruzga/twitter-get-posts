const TWITTER = require('../src/index');
const fs = require('fs');

TWITTER.getTweets('vegetabdn', 10)
.then(tweets => {
  fs.writeFileSync('./example/tweets.json', JSON.stringify(tweets, null, 2));
})
.catch(err => console.error(err));