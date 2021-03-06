/** @jsxImportSource @emotion/react */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { 
  drawOrcaGameSprite, 
  drawSprite, 
  newOrcaSprite, 
  newSprite, 
  spawnEnemies 
} from '../helpers/util';
import { OrcaSprite, Sprite } from '../helpers';
import sound from "url:../assets/main-theme.ogg"
import accessory from '../assets/pixelnauts/accessory';
import background from '../assets/pixelnauts/background';
import body from '../assets/pixelnauts/body';
import eyes from '../assets/pixelnauts/eyes';
import hat from '../assets/pixelnauts/hat';
import mouth from '../assets/pixelnauts/mouth';
import world from '../assets/environment';
import enemies from '../assets/enemies';

type Props = {
  orcaTraits: string[];
}

export const GameCanvas = ({ orcaTraits }: Props) => {
  const [ gameState, setGameState ] = useState<number>(0);
  const [ score, setScore ] = useState<number>(0);
  const [ levelCounter, setLevelCounter ] = useState<number>(0);
  const [ Orca, setOrca ] = useState<OrcaSprite | null>(null);
  const [ Rugs, setRugs ] = useState<Sprite[] | null>(null);
  const [ Environment, setEnvironment ] = useState<Sprite | null>(null);
  const [ restart, setRestart ] = useState<boolean>(false);
  const [ isHelpOpen, setIsHelpOpen ] = useState<boolean>(false);
  const [ isCreditsOpen, setIsCreditsOpen ] = useState<boolean>(false);
  const [ isIntroOpen, setIsIntroOpen ] = useState<boolean>(true);
  const [ isPaused, setIsPaused ] = useState<boolean>(false);
  const [ isMuted, setIsMuted ] = useState<boolean>(false);
  //Background scroll and sprite animation speed
  const [ AnimRate, setAnimRate ] = useState<number>(30);
  const [ ScrollSpd, setScrollSpd ] = useState<number>(0.001);

  const audioRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handlePlay = (e) => {
    setGameState(1);
    audioRef.current.load();
    audioRef.current.play();
  }

  const handleRestart = (e) => {
    //Reset all the states.
    setRestart(false); 
    setGameState(0);
    setScore(0);
    setIsIntroOpen(false);
    setOrca(null);
    setRugs(null);
    setEnvironment(null);
    setAnimRate(30);
    setScrollSpd(0.001);
    setLevelCounter(0);
  }

  const handlePause = (e) => {
    setIsPaused(!isPaused);
    if (isPaused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }

  const handleMute = (e) => {
    setIsMuted(!isMuted);
    if (isMuted) {
      audioRef.current.muted = false;
    } else {
      audioRef.current.muted = true;
    }
  }

  
  //requestAnimationFrame loop structure 
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

      let lvlRestart = restart;

      //Frame-rate to draw sprites at
      let renderFps = 120;
      let renderStart = 0;
      let renderFrameDuration = 1000/renderFps;

      //Frame-rate for physics, and collision calculations
      let simFps = 60;
      let previous = 0; 
      const simFrameDuration = 1000/simFps;
      let lag = 0;

      let lvlRate = 900;
      let animRate = AnimRate;
      let scrollSpd = ScrollSpd;

      let animCounter = 0;
      let lvlCounter = levelCounter;
  
      const scale = 2;
      let enemyCount = 10;
      const enemySpacing = 1000;
      let enemySpeed = 6;
      let enemySpdIncrease = 0.7;

      //Create the images from the selected orcanaut.
      const [
        sBg,
        sBody,
        sHat,
        sMouth,
        sEyes,
        sAccessory
      ] = orcaTraits;

      let orca: OrcaSprite;
      if (!Orca) {
        orca = newOrcaSprite(
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
      } else { orca = Orca };

      let environment: Sprite;
      if (!Environment) {
        environment = newSprite(world.sandy_bottom,400,300,0,0,undefined,scale);
      } else { environment = Environment};

      let rugs: Sprite[];
      if (!Rugs) {
        rugs = spawnEnemies(
          enemyCount, 
          [enemies.rug_lrg, enemies.rug_lrg_blue, enemies.rug_lrg_purple],
          40,
          32,
          0,
          0,
          enemySpeed,
          scale,
          [canvas.width, canvas.width+enemySpacing],
          [canvas.height/6+16, canvas.height-16],
          22
        );
      } else { rugs = Rugs };

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
            if (rugs[i].px+rugs[i].radius < 0) {
                rugs[i].px = Math.random() * enemySpacing + canvas.width;
                rugs[i].py = Math.random() * (canvas.height - canvas.height/6) + canvas.height/6-rugs[i].radius;
                setScore(x => x + 1);
            }
          }
          //Level Logic
          if (lvlCounter < lvlRate) {
            lvlCounter += 1;
            setLevelCounter(lvlCounter);
          }
          if (lvlCounter >= lvlRate) {
            for (let i = 0; i < rugs.length; i++) {
              rugs[i].speed += enemySpdIncrease;
            }
            orca.speed += 0.25;
            animRate *= .95;
            scrollSpd *= 1.25;
            lvlCounter = 0;
            setAnimRate(animRate);
            setScrollSpd(scrollSpd);
            setLevelCounter(lvlCounter);
          }
          //Animation Logic
          if (environment.frame < 2) {
            environment.frame += scrollSpd;
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
            //Game Lost Condition. Player circle collider overlaps enemy collider.
            if (deltaPsq < minPsq) {
              setRestart(true);
              lvlRestart = true;
              animRate = 999999999;
              scrollSpd = 0;
              enemySpdIncrease = 0;
              for (let i = 0; i < rugs.length; i++) {
                rugs[i].speed = 0;
              }
              document.removeEventListener("keydown", keyDownHandler, false);
              audioRef.current.pause();
            }
          }
          if (orca.py > ground-orca.radius) {
            orca.py = ground-orca.radius;
          }
          if (orca.py < canvas.height/6+orca.radius) {
            orca.py = canvas.height/6+orca.radius;
          }
          if (orca.px < orca.radius) {
            orca.px = orca.radius;
          }
          if (orca.px > canvas.width-orca.radius) {
            orca.px = canvas.width-orca.radius;
          }
          if (!lvlRestart) {
            setOrca(orca);
            setRugs(rugs);
            setEnvironment(environment);
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

          /*/ Draw player collider
          ctx.beginPath();
          ctx.arc(orca.px, orca.py, orca.radius, 0, Math.PI*2);
          ctx.fillStyle = "#000000";
          ctx.fill();
          ctx.closePath();
          //*/
          drawOrcaGameSprite(ctx, orca);

          for (let i = 0; i < rugs.length; i++) {
            /*/Draw enemy colliders
            ctx.beginPath();
            ctx.arc(rugs[i].px, rugs[i].py, rugs[i].radius, 0, Math.PI*2);
            ctx.fillStyle = "#e75569";
            ctx.fill();
            ctx.closePath();
            //*/
            drawSprite(ctx, rugs[i],40,40);
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
          flex-direction: row;
          justify-content: space-evenly;
          margin-top: 100px;
          width: 750px;
          font-size: 24px;
        `}
      >
        <p>Score: {score}</p>
        { restart && 
          <p>
            Game Over
          </p>
        }
      </div>
      <div 
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 20px 0 20px 0;
          border: 3px solid #1d257a;
          width: 820px;
          height: 620px;
        `}
      >
        { gameState == 0 && isIntroOpen &&
          <p
            css={css`
              align-text: center;
              font-size: 24px;
            `}
          >
            Press start below...
          </p>
        }
        <canvas
          ref={canvasRef}>
        </canvas>
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          width: 750px;
        `}
      >
        <button
          css={[button, small]}
          onClick={() => {setIsHelpOpen(!isHelpOpen); setIsCreditsOpen(false);}}
        >
          Help
        </button>
        { gameState == 0 && 
          <button
            css={[button]}
            onClick={handlePlay}
          >
            Start
          </button>
        }
        { gameState == 1 && !restart && 
          <button
            css={[button]}
            onClick={handlePause}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        }
        { restart &&
          <button 
            css={[button]}
            disabled={!restart}
            onClick={handleRestart}
          >
            Restart
          </button>
        }
        <button
          css={[button, small]}
          onClick={() => {setIsCreditsOpen(!isCreditsOpen); setIsHelpOpen(false);}}
        >
          Credits
        </button> 
        <button
          css={[button, small]}
          onClick={handleMute}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>  
      </div>
      { isHelpOpen &&
        <ul
          css={css`
            list-style: none;
            text-align: center;
            font-size: 24px
          `}
        >
          <li>Arrow / W A S D keys to move.</li>
          <li>Avoid the rugs!</li>
        </ul>
      }
      { isCreditsOpen &&
        <section
          css={css`
            margin-top: 30px;
            text-align: center;
            font-size: 16px;
            & > ul {
              list-style: none;
            }
          `}
        >
          <ul>
            <li>Nick Ewasiuk - <a href="https://github.com/nicholas-ewasiuk">Programming</a></li>
            <li>Gavin Leeper - <a href="https://www.gavinleepermusic.com/">Music</a></li>
            <li>Christine Vautour - <a href="https://www.artstation.com/fruitcakette">Environment Art</a></li>
          </ul>
          <h4>Special Thanks</h4>
          <ul>
            <li>Ade Balogun - <a href="https://github.com/Baloguna16/pixelnaut-assets">Pixelnauts Artwork</a></li>
            <li>@corcorarium - <a href="https://twitter.com/corcorarium">Orcanauts Artwork</a></li>
            <li>The entire Orca team! - <a href="https://orcanauts.orca.so">Orcanauts NFT Project</a></li>
            <li>@_ilmoi - <a href="https://github.com/ilmoi/nft-armory">nftarmory.me</a> was an invaluable resource</li>
            <li>@javidx9 - Programming game engine <a href="https://www.youtube.com/c/javidx9">Youtube videos</a></li>
          </ul>
        </section>
      }
      <audio
        ref={audioRef}
        src={sound}
      />
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
    background: #ededed;
  }
`;

const small = css`
  width: 100px;
  height: 40px;
`;