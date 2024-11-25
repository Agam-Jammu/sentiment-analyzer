// EmotionsPanel.js
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
import { emotionsList } from "./constants";

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
        {emotionsList.map((emotion) => (
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
);

export default EmotionsPanel;
