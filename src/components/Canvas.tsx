import React, { useLayoutEffect, useRef, useState } from 'react';

export const Canvas: React.FC = () => {
  const [ playerX, setPlayerX ] = useState<number>(0);
  const [ playerY, setPlayerY ] = useState<number>(0);
  const [ playerRadius, setPlayerRadius ] = useState<number>(10);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameState, setGameState] = useState<number>(0);


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  //const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  //animation loop structure 
  //https://blog.jakuba.net/request-animation-frame-and-use-effect-vs-use-layout-effect/
  useLayoutEffect(() => {
    if (!isPaused && canvasRef.current && gameState) {
      
      //Initial state
      let timerId: number;
      const canvas = canvasRef.current;

      let leftPressed = false;
      let rightPressed = false;
      let upPressed = false;
      let downPressed = false;

      const keyDownHandler = (e) => {
        e.preventDefault();
        if(e.key == "Right" || e.key == "ArrowRight") {
          rightPressed = true;
        }
        if(e.key == "Left" || e.key == "ArrowLeft") {
          leftPressed = true;
        }
        if(e.key == "Up" || e.key == "ArrowUp") {
          upPressed = true;
        }
        if(e.key == "Down" || e.key == "ArrowDown") {
          downPressed = true;
        }
      }
      const keyUpHandler = (e) => {
        e.preventDefault();
        if(e.key == "Right" || e.key == "ArrowRight") {
          rightPressed = false;
        }
        if(e.key == "Left" || e.key == "ArrowLeft") {
          leftPressed = false;
        }
        if(e.key == "Up" || e.key == "ArrowUp") {
          upPressed = false;
        }
        if(e.key == "Down" || e.key == "ArrowDown") {
          downPressed = false;
        }
      }
      document.addEventListener("keydown", keyDownHandler, false);
      document.addEventListener("keyup", keyUpHandler, false);

      const ctx = canvas.getContext("2d");

      canvas.width = 600;
      canvas.height = 300;

      let px = playerX;
      let py = playerY;
      let radius = playerRadius;
      let speed = 3 
      
      //Game Loop
      const f = () => {
        if (!ctx) throw new Error("error, canvas 2d context not found");
        //Logic
        if (rightPressed) {
          setPlayerX(x => x + speed);
          px += speed;
        }
        if (leftPressed) {
          setPlayerX(x => x - speed);
          px -= speed;
        }
        if (upPressed) {
          setPlayerY(x => x - speed);
          py -= speed;
        }
        if (downPressed) {
          setPlayerY(x => x + speed);
          py += speed;
        }
        //Rendering
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.clear();
        console.log(`X: ${px}, Y: ${py}`);

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI*2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.closePath();

        timerId = requestAnimationFrame(f);
      }

      timerId = requestAnimationFrame(f);
    
      //Cleanup function triggers when useLayoutEffect is called again.
      return () => cancelAnimationFrame(timerId);
    }
  }, [isPaused, canvasRef, gameState]);

  return (
    <div>
      <canvas
        ref={canvasRef}>
      </canvas>
      <button 
        disabled={gameState == 1}
        onClick={() => setGameState(1)}
      >Play
      </button>
      <button onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? "Resume" : "Pause"}
      </button>
    </div>
  );
}

