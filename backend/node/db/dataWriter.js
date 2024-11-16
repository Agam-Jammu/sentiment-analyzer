// Assuming you have a 'connection.js' file that exports your PostgreSQL pool
const pool = require('./connection');

async function writeToDatabase(jsonData) {
  const posts = jsonData;

  for (const post of posts) {
    const postValues = [
      post.id, // reddit_post_id
      post.title,
      post.url,
      post.author,
      post.score,
      post.subreddit,
      post.over_18,
      new Date(post.timestamp * 1000), // Convert UNIX timestamp to JS Date
      post.permalink,
    ];

    const insertPostQuery = `
      INSERT INTO posts (
        reddit_post_id,
        title,
        url,
        author,
        score,
        subreddit,
        over_18,
        timestamp,
        permalink
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (reddit_post_id) DO NOTHING;
    `;

    try {
      await pool.query(insertPostQuery, postValues);
    } catch (err) {
      console.error(`Error inserting post ${post.id}:`, err);
    }

    // Insert comments for each post
    for (const comment of post.comments) {
      const commentValues = [
        comment.id, // reddit_comment_id
        post.id, // reddit_post_id (foreign key)
        comment.author,
        comment.body,
        comment.sentiment_score,
        comment.anger,
        comment.anticipation,
        comment.disgust,
        comment.fear,
        comment.joy,
        comment.negative,
        comment.positive,
        comment.sadness,
        comment.surprise,
        comment.trust,
        comment.upvotes,
        comment.downvotes,
        comment.overall_positivity,
        comment.overall_negativity,
        new Date(comment.timestamp * 1000), // Convert UNIX timestamp
        comment.permalink,
      ];

      const insertCommentQuery = `
        INSERT INTO comments (
          reddit_comment_id,
          reddit_post_id,
          author,
          body,
          sentiment_score,
          anger,
          anticipation,
          disgust,
          fear,
          joy,
          negative,
          positive,
          sadness,
          surprise,
          trust,
          upvotes,
          downvotes,
          overall_positivity,
          overall_negativity,
          timestamp,
          permalink
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
        )
        ON CONFLICT (reddit_comment_id) DO NOTHING;
      `;

      try {
        await pool.query(insertCommentQuery, commentValues);
      } catch (err) {
        console.error(`Error inserting comment ${comment.id}:`, err);
      }
    }
  }
}

module.exports = writeToDatabase;
