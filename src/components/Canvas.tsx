import React, { useLayoutEffect, useRef, useState } from 'react';

export const Canvas: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);
  const [ move, setMove ] = useState<number>(0);
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

      let mouseClicked = false;
      const handleMouseClick = () => {
        mouseClicked = !mouseClicked;
      }

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

      canvas.addEventListener("click", handleMouseClick);

      const ctx = canvas.getContext("2d");

      canvas.width = 600;
      canvas.height = 300;

      let myCounter = counter;
      
      //Game Loop
      const f = () => {
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.font = '48px serif';
        
          if (mouseClicked) {
            setCounter(x => x - 1);
            myCounter -= 1;
            ctx.fillText(`counter: ${myCounter}`, canvas.width/2, canvas.height/2);
          } else {
            setCounter(x => x + 1);
            myCounter += 1;
            ctx.fillText(`counter: ${myCounter}`, canvas.width/2, canvas.height/2);
          }
          if (rightPressed) {
            setMove(x => x + 1);
          }
        }
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
      <button>
        Reverse
      </button>
      <p>Counter: {counter}</p>
      <p>Direction: {move}</p>
    </div>
  );
}

