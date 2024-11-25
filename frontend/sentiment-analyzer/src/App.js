import React, { useState, useEffect } from "react";
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
  Tooltip,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

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

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FF4500",
    },
    secondary: {
      main: "#FFA500",
    },
  },
  typography: {
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
    h6: {
      color: "#FFD700",
    },
    body2: {
      color: "#00FFFF",
    },
    subtitle2: {
      color: "#ADFF2F",
    },
  },
});

const App = () => {
  const [subreddit, setSubreddit] = useState("technology");
  const [sort, setSort] = useState("top");
  const [time, setTime] = useState("all");
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for side panel
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [emotionComments, setEmotionComments] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState("");

  const emotionsList = ["anger", "anticipation", "disgust", "fear", "joy", "sadness", "surprise", "trust"];

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    setPosts(null);

    try {
      let url = `http://localhost:3001/api/reddit/${subreddit}?sort=${sort}`;
      if (sort === "top") {
        url += `&time=${time}`;
      }
      const response = await axios.get(url);
      setPosts(response.data.data);
    } catch (err) {
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch most emotional comments
  useEffect(() => {
    if (posts && selectedEmotion) {
      const allComments = posts.flatMap((post) => post.comments);
      const sortedComments = allComments
        .filter((comment) => comment[selectedEmotion] > 0)
        .sort((a, b) => b[selectedEmotion] - a[selectedEmotion])
        .slice(0, 5);
      setEmotionComments(sortedComments);
    } else {
      setEmotionComments([]);
    }
  }, [posts, selectedEmotion]);

  return (
    <ThemeProvider theme={darkTheme}>
      {/* AppBar with enhanced styling */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Reddit Explorer
          </Typography>
          {/* Added a logo for visual enhancement */}
          <img
            src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
            alt="Reddit Logo"
            style={{ width: 30, height: 30 }}
          />
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
          <Grid item xs={6} sm={2}>
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
          {/* Conditionally render the Time option */}
          {sort === "top" && (
            <Grid item xs={6} sm={2}>
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
          )}
          <Grid item xs={6} sm={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={fetchPosts}
              fullWidth
              style={{ height: "56px" }}
            >
              Fetch Posts
            </Button>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setDrawerOpen(true)}
              fullWidth
              style={{ height: "56px" }}
            >
              Emotions Panel
            </Button>
          </Grid>
        </Grid>

        {/* Loading Indicator */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <CircularProgress color="secondary" />
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

      {/* Side Drawer for Emotions */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div style={{ width: 350, padding: 20 }}>
          <Typography variant="h6" gutterBottom>
            Emotion Categories
          </Typography>
          <List>
            {emotionsList.map((emotion) => (
              <ListItem
                button
                key={emotion}
                onClick={() => setSelectedEmotion(emotion)}
                selected={selectedEmotion === emotion}
              >
                <ListItemText primary={emotion.charAt(0).toUpperCase() + emotion.slice(1)} />
              </ListItem>
            ))}
          </List>
          <Divider />
          {selectedEmotion && (
            <>
              <Typography variant="h6" style={{ marginTop: 20 }}>
                Top {selectedEmotion} comments
              </Typography>
              {emotionComments.map((comment) => (
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
                      Upvotes: {comment.upvotes} | {selectedEmotion}:{" "}
                      {comment[selectedEmotion]}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </Drawer>
    </ThemeProvider>
  );
};

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

const SentimentIndicator = ({ score }) => {
  let icon;
  let color;

  if (score > 0.2) {
    icon = <SentimentVerySatisfiedIcon />;
    color = "green";
  } else if (score < -0.2) {
    icon = <SentimentVeryDissatisfiedIcon />;
    color = "red";
  } else {
    icon = <SentimentSatisfiedIcon />;
    color = "orange";
  }

  return (
    <Chip
      icon={icon}
      label={`Sentiment Score: ${score.toFixed(2)}`}
      style={{ marginTop: "10px", color: "#fff", backgroundColor: color }}
    />
  );
};

// Emotions list for use in multiple components
const emotionsList = ["anger", "anticipation", "disgust", "fear", "joy", "sadness", "surprise", "trust"];

export default App;
