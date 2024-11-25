// App.js
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
  Grid,
  InputLabel,
  FormControl,
  CssBaseline, // Import CssBaseline
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PostCard from "./PostCard";
import EmotionsPanel from "./EmotionsPanel";

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

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    setPosts(null);

    try {
      let url = `http://localhost:3001/api/reddit/${subreddit}?sort=${sort}&limit=100`;
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

  // Create a dark theme
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#121212", // Set dark background
        paper: "#1E1E1E", // Set card background
      },
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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Add CssBaseline here */}
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
      <EmotionsPanel
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedEmotion={selectedEmotion}
        setSelectedEmotion={setSelectedEmotion}
        emotionComments={emotionComments}
      />
    </ThemeProvider>
  );
};

export default App;
