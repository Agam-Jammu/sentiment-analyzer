import React from "react";
import {
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
} from "@mui/material";

const EmotionsPanel = ({
  drawerOpen,
  setDrawerOpen,
  selectedEmotion,
  setSelectedEmotion,
  emotionComments,
}) => (
  <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
    <div style={{ width: 350, padding: 20 }}>
      <Typography variant="h6" gutterBottom>
        Emotion Categories
      </Typography>
      <List>
        {/* Standard emotions */}
        {["anger", "anticipation", "disgust", "fear", "joy", "sadness", "surprise", "trust"].map(
          (emotion) => (
            <ListItem
              button
              key={emotion}
              onClick={() => setSelectedEmotion(emotion)}
              selected={selectedEmotion === emotion}
            >
              <ListItemText
                primary={emotion.charAt(0).toUpperCase() + emotion.slice(1)}
              />
            </ListItem>
          )
        )}

        {/* Overall Positivity and Negativity */}
        <ListItem
          button
          onClick={() => setSelectedEmotion("overall_positivity")}
          selected={selectedEmotion === "overall_positivity"}
        >
          <ListItemText primary="Overall Positivity" />
        </ListItem>
        <ListItem
          button
          onClick={() => setSelectedEmotion("overall_negativity")}
          selected={selectedEmotion === "overall_negativity"}
        >
          <ListItemText primary="Overall Negativity" />
        </ListItem>
      </List>
      <Divider />
      {selectedEmotion && (
        <>
          <Typography variant="h6" style={{ marginTop: 20 }}>
            {/* Render appropriate title */}
            Top {selectedEmotion === "overall_positivity"
              ? "Overall Positivity"
              : selectedEmotion === "overall_negativity"
              ? "Overall Negativity"
              : selectedEmotion.charAt(0).toUpperCase() + selectedEmotion.slice(1)}{" "}
            Comments
          </Typography>
          {/* Render the comments */}
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
                  Upvotes: {comment.upvotes} |{" "}
                  {selectedEmotion === "overall_positivity"
                    ? "Overall Positivity"
                    : selectedEmotion === "overall_negativity"
                    ? "Overall Negativity"
                    : selectedEmotion.charAt(0).toUpperCase() + selectedEmotion.slice(1)}:{" "}
                  {comment[selectedEmotion]}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  </Drawer>
);

export default EmotionsPanel;
