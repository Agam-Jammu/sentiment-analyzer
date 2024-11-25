import React, { useState } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Collapse,
  Grid,
  InputLabel,
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const App = () => {
  const [subreddit, setSubreddit] = useState("technology");
  const [sort, setSort] = useState("top");
  const [time, setTime] = useState("all");
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    setPosts(null);

    try {
      const response = await axios.get(
        `http://localhost:3001/api/reddit/${subreddit}?sort=${sort}&time=${time}`
      );
      setPosts(response.data.data);
    } catch (err) {
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Reddit Explorer</Typography>
        </Toolbar>
      </AppBar>

      {/* Main Container */}
      <Container style={{ marginTop: "20px" }}>
        {/* Form Controls */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Subreddit"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Sort</InputLabel>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                label="Sort"
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="top">Top</MenuItem>
                <MenuItem value="controversial">Controversial</MenuItem>
                <MenuItem value="rising">Rising</MenuItem>
                <MenuItem value="hot">Hot</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Time</InputLabel>
              <Select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                label="Time"
              >
                <MenuItem value="hour">Hour</MenuItem>
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Year</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchPosts}
              fullWidth
            >
              Fetch Posts
            </Button>
          </Grid>
        </Grid>

        {/* Loading Indicator */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <CircularProgress />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Typography color="error" style={{ marginTop: "20px" }}>
            {error}
          </Typography>
        )}

        {/* Posts */}
        {posts && (
          <Grid container spacing={3} style={{ marginTop: "20px" }}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <PostCard post={post} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

const PostCard = ({ post }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent style={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Typography color="textSecondary">Score: {post.score}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          size="small"
          color="primary"
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Post
        </Button>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show comments"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {post.comments.slice(0, 3).map((comment) => (
            <Card
              variant="outlined"
              key={comment.id}
              style={{ marginBottom: "10px" }}
            >
              <CardContent>
                <Typography variant="subtitle2">
                  <strong>{comment.author}</strong>
                </Typography>
                <Typography variant="body2" style={{ marginTop: "5px" }}>
                  {comment.body}
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  style={{ marginTop: "10px", display: "block" }}
                >
                  Upvotes: {comment.upvotes} | Sentiment Score:{" "}
                  {comment.sentiment_score}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default App;
