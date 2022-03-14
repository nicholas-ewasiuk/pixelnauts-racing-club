import React, { useLayoutEffect, useRef, useState } from 'react';
import accessory from '../assets/pixelnauts/accessory';
import background from '../assets/pixelnauts/background';
import body from '../assets/pixelnauts/body';
import eyes from '../assets/pixelnauts/eyes';
import hat from '../assets/pixelnauts/hat';
import mouth from '../assets/pixelnauts/mouth';

type Props = {
  orca: string[];
}

export const GameCanvas = ({ orca }: Props) => {
  const [ playerPx, setPlayerPx ] = useState<number>(0);
  const [ playerPy, setPlayerPy ] = useState<number>(0);
  const [ playerRadius, setPlayerRadius ] = useState<number>(20);
  const [ playerSpeed, setPlayerSpeed ] = useState<number>(3);
  const [ gatePx, setGatePx] = useState<number>(600);
  const [ gatePy, setGatePy] = useState<number>(0);
  const [ gateRadius, setGateRadius ] = useState<number>(10);
  const [ gateSpeed, setGateSpeed ] = useState<number>(5);
  const [ gateCleared, setGateCleared ] = useState<boolean>(true);
  const [ levelCounter, setLevelCounter ] = useState<number>(0);
  const [ isPaused, setIsPaused ] = useState<boolean>(false);
  const [ gameState, setGameState ] = useState<number>(0);


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  //const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  interface CircleCollider {
    px: number; 
    py: number; 
    radius: number;
    id: string;
  }
  
  //animation loop structure 
  //https://blog.jakuba.net/request-animation-frame-and-use-effect-vs-use-layout-effect/
  useLayoutEffect(() => {
    if (!isPaused && canvasRef.current && gameState) {
      console.log(orca);
      
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

      const player: CircleCollider = {
        px: playerPx,
        py: playerPy,
        radius: playerRadius,
        id: "playerOne",
      };

      const gate: CircleCollider = {
        px: gatePx,
        py: gatePy,
        radius: gateRadius,
        id: "gate",
      }

      let playerSpd = playerSpeed; 
      let gateSpd = gateSpeed;
      let ground = canvas.height;
      let cleared = gateCleared;
      let lvlCounter = levelCounter;

      let renderFps = 120;
      let renderStart = 0;
      let renderFrameDuration = 1000/renderFps;

      const simFps = 60;
      let previous = 0; 
      const simFrameDuration = 1000/simFps;
      let lag = 0;

      //Create the images from the selected orcanaut.
      const [
        sBg,
        sBody,
        sHat,
        sMouth,
        sEyes,
        sAccessory
      ] = orca;

      const Body = new Image();
      const Hat = new Image();
      const Mouth = new Image();
      const Eyes = new Image();
      const Accessory = new Image();

      Body.src = body[sBody];
      Hat.src = hat[sHat];
      Mouth.src = mouth[sMouth];
      Eyes.src = eyes[sEyes];
      Accessory.src = accessory[sAccessory];

      const spriteOffsetX = 24;
      const spriteOffsetY = 25;
      const imgScale = 2;

      //Game Loop
      timerId = requestAnimationFrame(draw);

      function draw(timestamp: number) {
        timerId = requestAnimationFrame(draw);

        if (!timestamp) {
          timestamp = 0;
        }
        let elapsed = timestamp - previous;
        if (elapsed > 1000) {
          elapsed = simFrameDuration;
        }
        lag += elapsed;

        //Logic
        while (lag >= simFrameDuration) {
          // Player Logic
          if (rightPressed) {
            setPlayerPx(x => x + playerSpd);
            player.px += playerSpd;
          }
          if (leftPressed) {
            setPlayerPx(x => x - playerSpd);
            player.px -= playerSpd;
          }
          if (upPressed) {
            setPlayerPy(x => x - playerSpd);
            player.py -= playerSpd;
          }
          if (downPressed) {
            setPlayerPy(x => x + playerSpd);
            player.py += playerSpd;
          }
          //Gate Logic
          gate.px -= gateSpd;
          setGatePx(gate.px);
          if (gate.px < 0) {
            if (cleared) {
              gate.px = canvas.width;
              gate.py = Math.random() * (canvas.height);
              cleared = false;
              setGatePx(gate.px);
              setGatePy(gate.py);
              setGateCleared(cleared);
              if (lvlCounter > 10) {
                lvlCounter = 0;
                gateSpd += 1;
                playerSpd += 1;
                setLevelCounter(lvlCounter);
                setGateSpeed(gateSpd);
                setPlayerSpeed(playerSpd);
              } else {
                lvlCounter += 1;
                setLevelCounter(lvlCounter);
              }
            } else {
              console.log("Game Over");
            }
          }
          //Collisions
          let deltaPx = player.px - gate.px;
          let deltaPy = player.py - gate.py;
          let deltaPsq = deltaPx * deltaPx + deltaPy * deltaPy;
          let minPsq = (gate.radius + player.radius) * (gate.radius + player.radius);
          if (player.py > ground-player.radius) {
            player.py = ground-player.radius;
          }
          if (deltaPsq < minPsq) {
            cleared = true;
            setGateCleared(cleared);
          }
          lag -= simFrameDuration;
        }

        //Rendering
        let lagOffset = lag / simFrameDuration;
        if (timestamp >= renderStart) {
          if (!ctx) throw new Error("error, canvas 2d context not found");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.imageSmoothingEnabled = false;
          /* draw player collider
          ctx.beginPath();
          ctx.arc(player.px, player.py, player.radius, 0, Math.PI*2);
          ctx.fillStyle = "#000000";
          ctx.fill();
          ctx.closePath();
          */

          ctx.beginPath();
          ctx.arc(gate.px, gate.py, gate.radius, 0, Math.PI*2);
          ctx.fillStyle = "#e75569";
          ctx.fill();
          ctx.closePath();

          ctx.drawImage(
            Body,
            0,
            0,
            32,
            19,
            player.px + (2 - spriteOffsetX) * imgScale,
            player.py + (16 - spriteOffsetY) * imgScale,
            32 * imgScale,
            19 * imgScale
          );
          ctx.drawImage(
            Eyes,
            0,
            0,
            24,
            32,
            player.px + (12 - spriteOffsetX) * imgScale,
            player.py + (4 - spriteOffsetY) * imgScale,
            24 * imgScale,
            32 * imgScale
          );
          ctx.drawImage(
            Mouth,
            0,
            0,
            28,
            20,
            player.px + (8 - spriteOffsetX) * imgScale,
            player.py + (16 - spriteOffsetY) * imgScale,
            28 * imgScale,
            20 * imgScale
          );
          ctx.drawImage(
            Hat,
            0,
            0,
            28,
            36,
            player.px + (8 - spriteOffsetX) * imgScale,
            player.py + (4 - spriteOffsetY) * imgScale,
            28 * imgScale,
            36 * imgScale
          );
          ctx.drawImage(
            Accessory,
            0,
            0,
            40,
            40,
            player.px - spriteOffsetX * imgScale,
            player.py - spriteOffsetY * imgScale,
            40 * imgScale,
            40 * imgScale
          );
          
          renderStart = timestamp + renderFrameDuration;
        }
        previous = timestamp;
      }
    
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
      >
        Play
      </button>
      <button onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? "Resume" : "Pause"}
      </button>
      <button 
        disabled={!isPaused}
        onClick={() => {setGatePx(600); setGateSpeed(5);}}
      >
        Restart
      </button>
    </div>
  );
}

