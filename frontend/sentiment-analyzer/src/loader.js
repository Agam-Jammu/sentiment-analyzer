import React from "react";
import { motion } from "framer-motion";

const LoadingAnimation = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100px",
      }}
    >
      {/* Animated Logo */}
      <motion.img
        src="https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"
        alt="Loading..."
        style={{ width: 50, height: 50 }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
        }}
      />
      {/* Animated Text */}
      <motion.div
        style={{
          marginTop: "10px",
          color: "#FFA500",
          fontFamily: "'Comic Sans MS', cursive, sans-serif",
          fontSize: "1.2rem",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
        }}
      >
        Fetching Vibes...
      </motion.div>
    </div>
  );
};

export default LoadingAnimation;
