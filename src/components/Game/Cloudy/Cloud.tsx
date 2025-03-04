import React, { useEffect, useRef } from "react";

const Cloud = ({ startTimer }: { startTimer: boolean }) => {
  const boardRef = useRef(null);
  const cloudRef = useRef({ x: 45, y: 0, velocityY: 0 });
  const animationFrameId = useRef(null);
  const gravity = 0.1; // 🛠️ Reduced gravity for slower fall
  const jumpVelocity = -3; // 🔼 Stronger upward force for better jump
  const cloudImage = new Image();
  cloudImage.src = "/src/assets/white-clout.png"; // Ensure correct path
  useEffect(() => {
    console.log("start timer is true?");
  }, [startTimer]);
  useEffect(() => {
    // if (!startTimer) return;
    console.log("game start?", startTimer);
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
      context.clearRect(0, 0, board.width, board.height); // Clear canvas

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
      console.log("Cloud image loaded!");
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
  }, [startTimer]); // ✅ Empty dependency array ensures it runs only once

  return <canvas ref={boardRef} />;
};

export default Cloud;

// import React, { useEffect, useRef, useState } from "react";

// const Cloud = () => {
//   const boardRef = useRef(null); // Create a reference to the canvas element
//   let [cloudPosition, setCloudPosition] = useState({ x: 45, y: 320 }); // Cloud starting position
//   let [velocityY, setVelocityY] = useState(0);
//   let gravity = 0.4;

//   useEffect(() => {
//     const board = boardRef.current;

//     if (board) {
//       const boardWidth = 360;
//       const boardHeight = 640;

//       // Setting the board's width and height
//       board.width = boardWidth;
//       board.height = boardHeight;
//       const context = board.getContext("2d");

//       if (context) {
//         // Debugging the context
//         console.log("Context is set:", context);

//         // Draw cloud
//         const cloudWidth = 34;
//         const cloudHeight = 24;

//         const cloudImage = new Image();
//         cloudImage.src = "/src/assets/white-clout.png";
//         cloudImage.onload = () => {
//           console.log("Cloud image loaded!");
//           update();
//         };

//         // Function to update and redraw the canvas
//         const update = () => {
//           context.clearRect(0, 0, board.width, board.height); // Clear the canvas before redrawing
//           context.fillStyle = "green"; // Set fill color for the cloud
//           context.fillRect(
//             cloudPosition.x,
//             cloudPosition.y,
//             cloudWidth,
//             cloudHeight
//           ); // Draw the cloud
//           requestAnimationFrame(update); // Request next frame

//           // velocityY += gravity;

//           cloudPosition.y = Math.max(cloudPosition.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
//           context.drawImage(
//             cloudImage,
//             cloudPosition.x,
//             cloudPosition.y,
//             cloudPosition.width,
//             cloudPosition.height
//           );
//         };

//         // Start the animation loop
//         update();

//         // Listen for keydown events
//         const moveCloud = (e) => {
//           const moveDistance = 10; // Distance cloud moves on each key press
//           let newY = cloudPosition.y;

//           if (e.code === "ArrowUp" || e.code === "Space") {
//             newY -= moveDistance; // Move up
//           } else if (e.code === "ArrowDown") {
//             newY += moveDistance; // Move down
//           }

//           // Set the new Y position for the cloud
//           setCloudPosition((prevState) => ({
//             ...prevState,
//             y: Math.min(Math.max(newY, 0), board.height - 24), // Keep the cloud within bounds
//           }));
//         };

//         // Add the event listener for keydown events
//         document.addEventListener("keydown", moveCloud);

//         // Cleanup event listener when the component unmounts
//         return () => {
//           document.removeEventListener("keydown", moveCloud);
//         };
//       } else {
//         console.error("Failed to get context.");
//       }
//     } else {
//       console.error("Board reference not set.");
//     }
//   }, [cloudPosition, velocityY]); // Re-run whenever cloud position changes

//   return <canvas ref={boardRef} />;
// };

// export default Cloud;
