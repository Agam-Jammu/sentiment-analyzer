import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

const IntroScreen = ({ onComplete }) => {
  useEffect(() => {
    // Set a timer to hide the splash screen after 5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 5000); // Extended duration for full animation

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#121212",
        color: "#FFD700",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Sliding Title */}
      <motion.div
        initial={{ x: "-100vw" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 50, duration: 1 }}
      >
        <Typography
          variant="h3"
          style={{
            marginBottom: "10px",
            color: "#FFA500",
            fontWeight: "bold",
          }}
        >
          <span style={{ color: "#FFD700" }}>
            <Typewriter
              words={["Welcome to"]}
              loop={1}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
            />
          </span>{" "}
          Reddit Explorer
        </Typography>
      </motion.div>

      {/* Subtitle with Fade-In */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <Typography variant="h5" style={{ marginBottom: "20px" }}>
          Built by{" "}
          <span style={{ color: "#FFD700", fontWeight: "bold" }}>
            Agam Jammu
          </span>
        </Typography>
      </motion.div>

      {/* Icon Explosion Effect */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1.5, 1], rotate: [0, 360] }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 2 }}
        style={{ marginBottom: "10px" }}
      >
        🚀
      </motion.div>

      {/* Final Tagline with Scale Effect */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, delay: 3 }}
      >
        <Typography variant="body1">
          The vibe check master 👨‍💻 | Powered by 🚀 and ☕
        </Typography>
      </motion.div>
    </div>
  );
};

export default IntroScreen;
