import { useEffect, useRef } from "react";

const Cloudy = ({
  resetTypeBoard,
}: // input,
// toggleDifficulty,
// generatedWord,
// wordCount,
any) => {
  // interface Board {
  //   width: number;
  //   height: number;
  //   getContext: (value: string) => string;
  // }
  const boardRef = useRef<any | null>(null);
  const cloudRef = useRef({ x: 45, y: 0, velocityY: 0 });
  const animationFrameId = useRef<number | null>(null);
  // const difficulty = {
  //   easy: 0.2,
  //   medium: 0.3,
  //   hard: 0.35,
  //   expert: 0.4,
  // };
  // const velocities = {
  //   expert: -8,
  //   hard: -3,
  //   medium: -2,
  //   easy: -1,
  // };
  // const [jump, setJump] = useState(false);
  // const gravity = difficulty[toggleDifficulty]; // 🛠️ Reduced gravity for slower fall
  const gravity = 0.15;
  const jumpVelocity = -2;

  const cloudImage = new Image();
  cloudImage.src = "/assets/white-cloud.png"; // Ensure correct path

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    // const jump = validLetter;
    const boardWidth = 360;
    const boardHeight = 640;
    board.width = boardWidth;
    board.height = boardHeight;
    const context = board.getContext("2d") as any;

    if (!context) {
      console.error("Failed to get canvas context.");
      return;
    }

    const cloudWidth = 180;
    const cloudHeight = 104;

    // **Cloud Movement Logic**
    const update = () => {
      context.clearRect(0, 0, board.width, board.height); // Clear canvas
      if (cloudRef.current.y == 536) {
        resetTypeBoard();
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
    const moveCloud = (e: any) => {
      if (e.code === "ArrowUp" || e.code === "Space") {
        cloudRef.current.velocityY = jumpVelocity; // Apply jump force
      }
    };

    document.addEventListener("keydown", moveCloud);

    // **Cleanup on unmount**
    return () => {
      document.removeEventListener("keydown", moveCloud);
      cancelAnimationFrame(animationFrameId.current as any);
    };
  }, []); // ✅ Empty dependency array ensures it runs only one

  return <canvas ref={boardRef} />;
};

export default Cloudy;
