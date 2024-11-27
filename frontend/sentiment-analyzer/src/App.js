// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import IntroScreen from "./IntroScreen";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  InputLabel,
  FormControl,
  CssBaseline, // Import CssBaseline
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PostCard from "./PostCard";
import EmotionsPanel from "./EmotionsPanel";
import LoadingAnimation from "./loader";

const App = () => {
  const [subreddit, setSubreddit] = useState("technology");
  const [sort, setSort] = useState("top");
  const [time, setTime] = useState("all");
  const [limit, setLimit] = useState(10); 
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for side panel
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [emotionComments, setEmotionComments] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [searchMode, setSearchMode] = useState("subreddit"); // 'subreddit' or 'keyword'
  const [keyword, setKeyword] = useState(""); // For keyword-based searches
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [showIntro, setShowIntro] = useState(true);

  const postsPerPage = 10; // Fixed number of posts per page

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    setPosts(null);

    setCurrentPage(1); // Reset to the first page on new fetch
  
    // Validation
    if (!subreddit.trim()) {
      setError("Subreddit cannot be empty.");
      setLoading(false);
      return;
    }
    if (searchMode === "keyword" && !keyword.trim()) {
      setError("Keyword cannot be empty for keyword search.");
      setLoading(false);
      return;
    }
  
    try {
      let url;
      if (searchMode === "subreddit") {
        url = `https://vibecheck123-node-c79772ab2815.herokuapp.com/api/reddit/${subreddit}?sort=${sort}&limit=${limit}`;
        if (sort === "top") {
          url += `&time=${time}`;
        }
      } else if (searchMode === "keyword") {
        url = `https://vibecheck123-node-c79772ab2815.herokuapp.com/api/reddit/${subreddit}/search?keyword=${keyword}&sort=${sort}&limit=${limit}`;
        if (sort === "top") {
          url += `&time=${time}`;
        }
      }
    
      const response = await axios.get(url);
    
      // Check if no results were found
      if (response.data.data.length === 0) {
        setError("No results found for your search.");
        setLoading(false);
        return;
      }
    
      setPosts(response.data.data);
    } catch (err) {
      if (err.response?.status === 500 && err.message.includes("an error occured")) {
        setError("Reddit's rate limit has been exceeded. Please wait a few minutes and try again.");
      } else {
        setError("Failed to fetch posts. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Calculate current posts to display
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts ? posts.slice(indexOfFirstPost, indexOfLastPost) : [];
  const totalPages = posts ? Math.ceil(posts.length / postsPerPage) : 0;

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

  if (showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

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
            Sentalyze
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
        <Grid container spacing={2} alignItems="center">
          {/* Subreddit/Keyword Input */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label={searchMode === "subreddit" ? "Subreddit" : "Keyword"}
              value={searchMode === "subreddit" ? subreddit : keyword}
              onChange={(e) =>
                searchMode === "subreddit" ? setSubreddit(e.target.value) : setKeyword(e.target.value)
              }
              variant="outlined"
              fullWidth
            />
          </Grid>

    {/* Search Mode Toggle */}
    <Grid item xs={6} sm={3} md={2}>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setSearchMode(searchMode === "subreddit" ? "keyword" : "subreddit")}
        fullWidth
      >
        {searchMode === "subreddit" ? "Keyword Search" : "Subreddit Search"}
      </Button>
    </Grid>

    {/* Sort Dropdown */}
    <Grid item xs={6} sm={3} md={2}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel>Sort</InputLabel>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} label="Sort">
          <MenuItem value="new">New</MenuItem>
          <MenuItem value="top">Top</MenuItem>
          <MenuItem value="controversial">Controversial</MenuItem>
          <MenuItem value="rising">Rising</MenuItem>
          <MenuItem value="hot">Hot</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* Limit Dropdown */}
    <Grid item xs={6} sm={3} md={2}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel>Limit</InputLabel>
        <Select value={limit} onChange={(e) => setLimit(e.target.value)} label="Limit">
          {[10, 20, 30].map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>

    <Grid item xs={6} sm={3} md={2}>
    <FormControl
      variant="outlined"
      fullWidth
      style={{ visibility: sort === "top" ? "visible" : "hidden" }}
    >
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

    {/* Fetch Posts Button */}
    <Grid item xs={6} sm={3} md={2}>
      <Button variant="contained" color="primary" onClick={fetchPosts} fullWidth>
        Fetch Posts
      </Button>
    </Grid>

    {/* Emotions Panel Button */}
    <Grid item xs={6} sm={3} md={2}>
      <Button variant="contained" color="secondary" onClick={() => setDrawerOpen(true)} fullWidth>
        Emotions Panel
      </Button>
    </Grid>
  </Grid>


        {/* Loading Indicator */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <LoadingAnimation />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Typography color="error" style={{ marginTop: "20px" }}>
            {error}
          </Typography>
        )}


        {/* Posts */}
        {currentPosts && (
          <Grid container spacing={3} style={{ marginTop: "20px" }}>
            {currentPosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <PostCard post={post} />
              </Grid>
            ))}
          </Grid>
        )}
           {/* Pagination Controls */}
           {totalPages > 1 && (

        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{ margin: "0 5px" }}
          >
            Previous
          </Button>
          <Typography style={{ alignSelf: "center", margin: "0 10px" }}>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ margin: "0 5px" }}
          >
            Next
          </Button>
        </div>
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

      {/* Footer Section */}
      <footer style={{ 
        marginTop: "30px", 
        textAlign: "center", 
        padding: "10px", 
        backgroundColor: "#1E1E1E", 
        color: "#FFD700", 
        fontFamily: "'Comic Sans MS', cursive, sans-serif" 
      }}>
        <Typography variant="subtitle1">
          Built with 💻, ☕, and a dash of 🎩 by <span style={{ color: "#FFA500", fontWeight: "bold" }}>Agam Jammu</span>
        </Typography>
      </footer>
    </ThemeProvider>
  );
};

export default App;
