import React, { useEffect, useRef, useState } from "react";

const Cloudy = ({ setTime, setGameStart }: any) => {
  const boardRef = useRef(null);
  const cloudRef = useRef({ x: 45, y: 0, velocityY: 0 });
  const animationFrameId = useRef(null);
  const gravity = 0.2; // 🛠️ Reduced gravity for slower fall
  const jumpVelocity = -3; // 🔼 Stronger upward force for better jump
  const cloudImage = new Image();
  cloudImage.src = "/assets/white-cloud.png"; // Ensure correct path

  useEffect(() => {
    console.log("cloud moved");

    const board = boardRef.current;
    if (!board) return;

    const boardWidth = 360;
    const boardHeight = 640;
    board.width = boardWidth;
    board.height = boardHeight;
    const context = board.getContext("2d");

    if (!context) {
      console.error("Failed to get canvas context.");
      return;
    }

    const cloudWidth = 180;
    const cloudHeight = 104;

    // **Cloud Movement Logic**
    const update = () => {
      console.log("loading cloud gravity");
      context.clearRect(0, 0, board.width, board.height); // Clear canvas
      if (cloudRef.current.y == 536) {
        console.log("game over", cloudRef.current.y);
        setTime(null);
        setGameStart(false);
      }
      // Apply gravity
      cloudRef.current.velocityY += gravity;
      cloudRef.current.y = Math.max(
        cloudRef.current.y + cloudRef.current.velocityY,
        0
      );

      // Prevent cloud from falling below the screen
      if (cloudRef.current.y > boardHeight - cloudHeight) {
        cloudRef.current.y = boardHeight - cloudHeight;
        cloudRef.current.velocityY = 0; // Stop falling when it reaches the ground
      }

      // Draw the cloud
      context.drawImage(
        cloudImage,
        cloudRef.current.x,
        cloudRef.current.y,
        cloudWidth,
        cloudHeight
      );

      animationFrameId.current = requestAnimationFrame(update); // Request next frame
    };

    // **Start animation only after image loads**
    cloudImage.onload = () => {
      update(); // Start animation loop
    };

    // **Handle Key Press for Movement**
    const moveCloud = (e) => {
      if (e.code === "ArrowUp" || e.code === "Space") {
        cloudRef.current.velocityY = jumpVelocity; // Apply jump force
      }
    };

    document.addEventListener("keydown", moveCloud);

    // **Cleanup on unmount**
    return () => {
      document.removeEventListener("keydown", moveCloud);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []); // ✅ Empty dependency array ensures it runs only once

  return <canvas ref={boardRef} />;
};

export default Cloudy;
