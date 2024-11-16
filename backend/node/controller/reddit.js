const snoowrap = require('snoowrap');
require('dotenv').config();

const {
  REDDIT_CLIENT_ID,
  REDDIT_CLIENT_SECRET,
  REDDIT_USER_AGENT,
  REDDIT_USERNAME,
  REDDIT_PASSWORD
} = process.env;

const reddit = new snoowrap({
  userAgent: REDDIT_USER_AGENT,
  clientId: REDDIT_CLIENT_ID,
  clientSecret: REDDIT_CLIENT_SECRET,
  username: REDDIT_USERNAME,
  password: REDDIT_PASSWORD
});

// Fetch hot posts and their comments from a given subreddit
async function fetchComments(subredditName) {
  try {
    const posts = await reddit.getSubreddit(subredditName).getHot({ limit: 1 });

    const detailedPosts = [];

    for (const post of posts) {
      const comments = await post.expandReplies({ limit: 5, depth: 1 });
      const commentDetails = comments.comments.map((comment) => ({
        id: comment.id,
        name: comment.name,
        author: comment.author ? comment.author.name : "Deleted",
        body: comment.body,
        subreddit: comment.subreddit.display_name.toLowerCase(),
        upvotes: comment.ups,
        downvotes: comment.downs,
        over_18: comment.over_18,
        timestamp: comment.created_utc,
        permalink: `https://www.reddit.com${comment.permalink}`
      }));

      detailedPosts.push({
        id: post.id,
        title: post.title,
        url: post.url,
        author: post.author ? post.author.name : "Deleted",
        score: post.score,
        subreddit: post.subreddit.display_name.toLowerCase(),
        over_18: post.over_18,
        timestamp: post.created_utc,
        permalink: `https://www.reddit.com${post.permalink}`,
        comments: commentDetails
      });
    }

    return detailedPosts;
  } catch (error) {
    throw new Error(`Error fetching data from subreddit ${subredditName}: ${error.message}`);
  }
}

module.exports = { fetchComments };
