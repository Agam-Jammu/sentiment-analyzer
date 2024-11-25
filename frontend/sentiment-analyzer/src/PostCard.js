import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Collapse,
  Tooltip,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SentimentIndicator from "./SentimentIndicator";
import ExpandMore from "./ExpandMore";
import { emotionsList } from "./constants";

const PostCard = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleToggleTitle = () => {
    setShowFullTitle(!showFullTitle);
  };

  // Prepare data for emotion graph
  const emotionData = emotionsList.map((emotion) => {
    const totalEmotion = post.comments.reduce(
      (sum, comment) => sum + (comment[emotion] || 0),
      0
    );
    return { emotion, value: totalEmotion };
  });

  // Filter and sort extreme comments based on sentiment score
  const extremeComments = post.comments
    .filter((comment) => Math.abs(comment.sentiment_score) > 0.2) // Exclude neutral comments
    .sort((a, b) => Math.abs(b.sentiment_score) - Math.abs(a.sentiment_score)) // Sort by absolute value
    .slice(0, 3); // Limit to the top 3 extreme comments

  return (
    <Card
      style={{
        height: showFullTitle ? "auto" : "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#424242",
        color: "#fff",
      }}
      elevation={3}
    >
      <CardContent
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Title Section */}
        <div
          style={{
            maxHeight: showFullTitle ? "none" : "100px",
            overflow: showFullTitle ? "visible" : "hidden",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h6" style={{ lineHeight: 1.3 }}>
            {post.title}
          </Typography>
        </div>

        {/* Show More/Less Button */}
        {post.title.length > 100 && (
          <Button
            size="small"
            color="secondary"
            onClick={handleToggleTitle}
            style={{ alignSelf: "flex-start", marginBottom: "10px" }}
          >
            {showFullTitle ? "Show Less" : "Show More"}
          </Button>
        )}

        {/* "Posted in" and "Score" Section */}
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <Typography variant="body2">
            Posted in{" "}
            <strong>
              <a
                href={`https://www.reddit.com/r/${post.subreddit}/`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#FF4500" }}
              >
                r/{post.subreddit}
              </a>
            </strong>
          </Typography>
          <Typography>Score: {post.score}</Typography>
        </div>

        {/* Graph Section */}
        <div
          style={{
            width: "100%",
            height: "150px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "auto",
          }}
        >
          <ResponsiveContainer width="90%" height="100%">
            <BarChart data={emotionData}>
              <XAxis dataKey="emotion" stroke="#fff" />
              <YAxis stroke="#fff" />
              <RechartsTooltip
                contentStyle={{ backgroundColor: "#333", border: "none" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar dataKey="value" fill="#FFA500" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          size="small"
          color="primary"
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Post
        </Button>
        <Tooltip title="Show Comments" arrow>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show comments"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Tooltip>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {extremeComments.map((comment) => (
            <Card
              variant="outlined"
              key={comment.id}
              style={{ marginBottom: "10px", backgroundColor: "#333" }}
            >
              <CardContent>
                <Typography variant="subtitle2">
                  <strong>{comment.author}</strong>
                </Typography>
                <Typography
                  variant="body2"
                  style={{ marginTop: "5px", whiteSpace: "pre-wrap" }}
                >
                  {comment.body}
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  style={{ marginTop: "10px", display: "block" }}
                >
                  Sentiment Score: {comment.sentiment_score.toFixed(2)}
                </Typography>
                <SentimentIndicator score={comment.sentiment_score} />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PostCard;
