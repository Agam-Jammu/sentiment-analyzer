// SentimentIndicator.js
import React from "react";
import { Chip } from "@mui/material";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";

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

export default SentimentIndicator;
