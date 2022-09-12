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
            tweets.append({
              "username": tweet.user.username,
              "date": tweet.date.strftime('%d-%m-%Y %H:%M:%S'),
              "content": tweet.content,
              "media": medium.fullUrl,
              "url": tweet.url,
              "replyCount": tweet.replyCount,
              "retweetCount": tweet.retweetCount,
              "likeCount": tweet.likeCount,
              "source": tweet.source
            })

  json_string = json.dumps({ "tweets": tweets })
  return json_string
`
    python`get_tweets(${profile}, ${limit})`
    .then(data => {
      if (data === 'ERROR') reject('An error has occurred, please try again later');
      else {
        const tweets = JSON.parse(data);
        const tweetsNew = tweets.tweets.map(tweet => {
          if (tweet.media) {
            const content = tweet.content;
            tweet.content = content.split(' ').slice(0, -1).join(' ');
          }
          return tweet;
        });
        resolve({ tweets: tweetsNew });
      }
    })
    .catch(python.Exception, (err) => reject(err));

    python.end();
  });
}

module.exports = {
  getTweets
}