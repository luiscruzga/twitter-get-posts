const pythonBridge = require('python-bridge'); 

const getTweets = (profile, limit, isPython3=false) => {
  return new Promise((resolve, reject) => {
    const python = isPython3 ? pythonBridge({python: 'python3'}) : pythonBridge();
    python.ex`
import snscrape.modules.twitter as sntwitter
import json

def get_tweets(PROFILE, LIMIT):
  query = "(from:"+PROFILE+")"
  tweets = []
  limit = LIMIT

  for tweet in sntwitter.TwitterSearchScraper(query).get_items():
    if len(tweets) == limit:
      break
    else:
      if tweet.media:
        for medium in tweet.media:
          if("Photo" in str(medium)):
            tweets.append({"id": tweet.id, "username": tweet.username, "content": tweet.content, "media": medium.fullUrl})

  json_string = json.dumps({ "tweets": tweets })
  return json_string
`
    python`get_tweets(${profile}, ${limit})`
    .then(data => {
      if (data === 'ERROR') reject('An error has occurred, please try again later');
      else {
        resolve(JSON.parse(data));
      }
    })
    .catch(python.Exception, (err) => reject(err));

    python.end();
  });
}

module.exports = {
  getTweets
}