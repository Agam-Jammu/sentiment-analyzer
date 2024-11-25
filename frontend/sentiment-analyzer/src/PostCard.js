// PostCard.js
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

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Prepare data for emotion graph
  const emotionData = emotionsList.map((emotion) => {
    const totalEmotion = post.comments.reduce(
      (sum, comment) => sum + (comment[emotion] || 0),
      0
    );
    return { emotion, value: totalEmotion };
  });

  return (
    <Card
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#424242",
        color: "#fff",
      }}
      elevation={3}
    >
      <CardContent style={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
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
        {/* Emotion Graph */}
        <div style={{ width: "100%", height: 150, marginTop: 20 }}>
          <ResponsiveContainer>
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
          {post.comments.slice(0, 3).map((comment) => (
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
                  Upvotes: {comment.upvotes}
                </Typography>
                {/* Sentiment Indicator */}
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