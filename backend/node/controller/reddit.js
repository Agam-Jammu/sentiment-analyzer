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

// Fetch posts and their comments from a given subreddit with sorting options
const fetchPosts = async (subredditName, sort = 'hot', time = 'all', limit = 1) => {
  try {
    limit = parseInt(limit) || 1;
    const subreddit = reddit.getSubreddit(subredditName);

    let posts;
    switch (sort.toLowerCase()) {
      case 'new':
        posts = await subreddit.getNew({ limit });
        break;
      case 'top':
        posts = await subreddit.getTop({ time: time.toLowerCase(), limit });
        break;
      case 'controversial':
        posts = await subreddit.getControversial({ time: time.toLowerCase(), limit });
        break;
      case 'rising':
        posts = await subreddit.getRising({ limit });
        break;
      case 'hot':
      default:
        posts = await subreddit.getHot({ limit });
        break;
    }

    // Fetch comments concurrently
    const detailedPosts = await Promise.all(posts.map(async (post) => {
      const comments = await post.expandReplies({ limit: 10, depth: 1 });
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

      return {
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
      };
    }));

    return detailedPosts;
  } catch (error) {
    throw new Error(`Error fetching data from subreddit ${subredditName}: ${error.message}`);
  }
};

// Search for a keyword within a subreddit and fetch posts with comments
const searchSubreddit = async (subredditName, keyword, limit = 1) => {
  try {
    limit = parseInt(limit) || 1;
    const subreddit = reddit.getSubreddit(subredditName);

    // Search for posts containing the keyword
    const searchResults = await subreddit.search({
      query: keyword,
      sort: 'relevance', // You can modify sort options like 'new', 'top', etc.
      time: 'all', // Options: 'all', 'day', 'hour', 'month', etc.
      limit
    });

    // Fetch comments concurrently
    const detailedPosts = await Promise.all(searchResults.map(async (post) => {
      const comments = await post.expandReplies({ limit: 10, depth: 1 });
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

      return {
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
      };
    }));

    return detailedPosts;
  } catch (error) {
    throw new Error(`Error searching for keyword "${keyword}" in subreddit ${subredditName}: ${error.message}`);
  }
};

module.exports = { fetchPosts, searchSubreddit };

