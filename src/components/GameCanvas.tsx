/** @jsxImportSource @emotion/react */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { lighten } from 'polished';
import accessory from '../assets/pixelnauts/accessory';
import background from '../assets/pixelnauts/background';
import body from '../assets/pixelnauts/body';
import eyes from '../assets/pixelnauts/eyes';
import hat from '../assets/pixelnauts/hat';
import mouth from '../assets/pixelnauts/mouth';
import sound from "url:../assets/main-theme.ogg"
import world from '../assets/environment';
import enemies from '../assets/enemies';
import { drawOrcaGameSprite, drawSprite, newOrcaSprite, newSprite, spawnEnemies } from '../helpers/util';

type Props = {
  orcaTraits: string[];
}

export const GameCanvas = ({ orcaTraits }: Props) => {
  const [ levelCounter, setLevelCounter ] = useState<number>(0);
  const [ isPaused, setIsPaused ] = useState<boolean>(false);
  const [ gameState, setGameState ] = useState<number>(0);
  const [ restart, setRestart ] = useState<boolean>(false);

  const [ showPlayBtn, setShowPlayBtn ] = useState<number>(0);

  const audioRef = useRef(null);
  const playBtnRef = useRef(null);


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  //const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const handlePlay = (e) => {
    setGameState(1);
    playBtnRef.current.style.opacity = showPlayBtn;
    audioRef.current.play();
    //console.log(e.target);
  }

  const handleRestart = (e) => {
    //setGatePx(800); 
    //setGateSpeed(5); 
    setRestart(false); 
    setGameState(0);
    playBtnRef.current.style.opacity = 100;
  }

  const handlePause = (e) => {
    if (e.key == "Escape") {
      setIsPaused(!isPaused);
      if (isPaused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }
  
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
        console.log(e.key);
        if(e.key == "Right" || e.key == "ArrowRight" || e.key =="d") {
          rightPressed = true;
        }
        if(e.key == "Left" || e.key == "ArrowLeft" || e.key =="a") {
          leftPressed = true;
        }
        if(e.key == "Up" || e.key == "ArrowUp" || e.key =="w") {
          upPressed = true;
        }
        if(e.key == "Down" || e.key == "ArrowDown" || e.key =="s") {
          downPressed = true;
        }
      }
      const keyUpHandler = (e) => {
        e.preventDefault();
        if(e.key == "Right" || e.key == "ArrowRight" || e.key =="d") {
          rightPressed = false;
        }
        if(e.key == "Left" || e.key == "ArrowLeft" || e.key =="a") {
          leftPressed = false;
        }
        if(e.key == "Up" || e.key == "ArrowUp" || e.key =="w") {
          upPressed = false;
        }
        if(e.key == "Down" || e.key == "ArrowDown" || e.key =="s") {
          downPressed = false;
        }
      }
      document.addEventListener("keydown", keyDownHandler, false);
      document.addEventListener("keyup", keyUpHandler, false);

      const ctx = canvas.getContext("2d");

      canvas.width = 800;
      canvas.height = 600;

      let ground = canvas.height;
      let lvlCounter = levelCounter;
      let lvlRestart = restart;

      let renderFps = 120;
      let renderStart = 0;
      let renderFrameDuration = 1000/renderFps;

      let simFps = 60;
      let previous = 0; 
      const simFrameDuration = 1000/simFps;
      let lag = 0;
      let animRate = 30;
      let animCounter = 0;

      const scale = 2;
      let enemyCount = 7;
      const enemySpacing = 800;
      let enemySpeed = 7;

      //Create the images from the selected orcanaut.
      const [
        sBg,
        sBody,
        sHat,
        sMouth,
        sEyes,
        sAccessory
      ] = orcaTraits;

      const orca = newOrcaSprite(
        background[sBg],
        body[sBody],
        hat[sHat],
        mouth[sMouth],
        eyes[sEyes],
        accessory[sAccessory],
        3,
        scale,
        150,
        300
      );

      const environment = newSprite(world.sandy_bottom,400,300,0,0,undefined,scale);
      const rugs = spawnEnemies(
        enemyCount, 
        enemies.rug,
        32,
        16,
        0,
        0,
        6,
        scale,
        canvas.width,
        [canvas.height, canvas.height/3],
        enemySpacing,
      )

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
            orca.px += orca.speed;
          }
          if (leftPressed) {
            orca.px -= orca.speed;
          }
          if (upPressed) {
            orca.py -= orca.speed;
          }
          if (downPressed) {
            orca.py += orca.speed;
          }
          //Enemy Logic
          for (let i = 0; i < rugs.length; i++) {
            rugs[i].px -= rugs[i].speed;
            if (rugs[i].px < 0) {
                rugs[i].px = Math.random() * enemySpacing + canvas.width;
                rugs[i].py = Math.random() * (canvas.height - canvas.height*1/3 - 70) + canvas.height*1/3;
            }
          }
          //Animation Logic
          if (environment.frame < 2) {
            environment.frame += 0.001;
          } else {
            environment.frame = 0;
          }
          if (animCounter < animRate) {
            animCounter += 1;
          } 
          if (animCounter >= animRate) {
            for (const item in orca) {
              if (orca[item]['frame'] < 9) {
                orca[item]['frame'] += 1;
              } 
              if (orca[item]['frame'] >= 9)
                orca[item]['frame'] = 0;
              }
            for (let i = 0; i < rugs.length; i++) {
              if (rugs[i].frame < 9) {
                rugs[i].frame += 1;
              } else {
                rugs[i].frame = 0;
              }
            }
            animCounter = 0;
          }
          //Collisions
          for (let i = 0; i < rugs.length; i++) {
            let deltaPx = orca.px - rugs[i].px;
            let deltaPy = orca.py - rugs[i].py;
            let deltaPsq = deltaPx * deltaPx + deltaPy * deltaPy;
            let minPsq = (rugs[i].radius + orca.radius) * (rugs[i].radius + orca.radius);
            //Game lost condition below
            if (deltaPsq < minPsq) {
              setRestart(true);
              lvlRestart = true;
              audioRef.current.pause();
            }
          }
          if (orca.py > ground-orca.radius) {
            orca.py = ground-orca.radius;
          }
          if (orca.py < canvas.height/3+orca.radius) {
            orca.py = canvas.height/3+orca.radius;
          }
          lag -= simFrameDuration;
        }

        //Rendering
        let lagOffset = lag / simFrameDuration;
        if (timestamp >= renderStart) {
          if (!ctx) throw new Error("error, canvas 2d context not found");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.imageSmoothingEnabled = false;

          drawSprite(ctx, environment, 2)

          // Draw player collider
          ctx.beginPath();
          ctx.arc(orca.px, orca.py, orca.radius, 0, Math.PI*2);
          ctx.fillStyle = "#000000";
          ctx.fill();
          ctx.closePath();



          drawOrcaGameSprite(ctx, orca);
          for (let i = 0; i < rugs.length; i++) {
            /*Draw enemy colliders
            ctx.beginPath();
            ctx.arc(rugs[i].px, rugs[i].py, rugs[i].radius, 0, Math.PI*2);
            ctx.fillStyle = "#e75569";
            ctx.fill();
            ctx.closePath();
            */
            drawSprite(ctx, rugs[i],32,20);
          }

          renderStart = timestamp + renderFrameDuration;
        }
        previous = timestamp;
      }
    
      //Cleanup function triggers when useLayoutEffect is called again.
      return () => {
        cancelAnimationFrame(timerId);
        document.removeEventListener("keydown", keyDownHandler, false);
        document.removeEventListener("keyup", keyUpHandler, false);
      }
    }
  }, [isPaused, canvasRef, gameState]);

  return (
    <div
      css={css`
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      `}
    >
      <div 
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 100px 0 20px 0;
          border: 3px solid #1d257a;
          width: 820px;
          height: 620px;
        `}
      >
        <canvas
          ref={canvasRef}>
        </canvas>
      </div>
      <div 
        css={css`
          position: absolute;
        `}
      >
        <button
          css={[button]}
          ref={playBtnRef}
          onClick={handlePlay}
          onKeyDown={handlePause}
        >
          Click to Play
        </button>
        { restart &&
          <button 
            css={[button, small]}
            disabled={!restart}
            onClick={handleRestart}
          >
            Restart
          </button>
        }
        <audio
          ref={audioRef}
          src={sound}
          loop
        />
      </div>
    </div>
  );
}

const button = css`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  outline: none;
  border-style: solid;
  border-color: #1d257a;
  box-shadow: none;
  border-radius: 0px;
  width: 200px;
  height: 40px;
  background: #ffffff;
  font-size: 20px;
  font-family: 'DotGothic16', sans-serif;
  font-weight: inherit;
  color: #1d257a;
  &:hover {
    background: ${lighten(0.1, "#1d257a")};
  }
`;

const small = css`
  width: 100px;
  height: 40px;
`;

const absolute = css`
  position: absolute;
`
