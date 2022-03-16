/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { OrcaSprite, SpriteSheet } from '../helpers';
import { newSprite, drawSprite } from '../helpers/util';
import accessory from '../assets/pixelnauts/accessory';
import background from '../assets/pixelnauts/background';
import body from '../assets/pixelnauts/body';
import eyes from '../assets/pixelnauts/eyes';
import hat from '../assets/pixelnauts/hat';
import mouth from '../assets/pixelnauts/mouth';


type Props = {
  orca: string[] | null,
}

export const SelectOrcaMenu = ({ orca }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    if (canvasRef.current && orca) {
      //Initial state
      let timerId: number;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = 240;
      canvas.height = 240;

      let renderFps = 120;
      let renderStart = 0;
      let renderFrameDuration = 1000/renderFps;

      const simFps = 60;
      let previous = 0; 
      const simFrameDuration = 1000/simFps;
      let lag = 0;
      let animRate = 30;
      let animCounter = 0;

      //Create the images from the selected orcanaut.
      const [
        sBg,
        sBody,
        sHat,
        sMouth,
        sEyes,
        sAccessory
      ] = orca;

      const spOrca: OrcaSprite = {
        background: newSprite(background[sBg],40,40,0,0),
        body: newSprite(body[sBody],32,19,2,16),
        hat: newSprite(hat[sHat],28,36,8,4),
        mouth: newSprite(mouth[sMouth],28,20,8,16),
        eyes: newSprite(eyes[sEyes],24,32,12,4),
        accessory: newSprite(accessory[sAccessory],40,40,0,0),
      }

      const imgScale = 6;

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
          //Animation Logic
          if (animCounter < animRate) {
            animCounter += 1;
          } 
          if (animCounter >= animRate) {
            for (const item in spOrca) {
              if (spOrca[item]['frame'] < 10) {
                spOrca[item]['frame'] += 1;
                console.log(spOrca[item]['frame']);
              }
              if (spOrca[item]['frame'] >= 10) {
                spOrca[item]['frame'] = 0;
              }
            }
            animCounter = 0;
          } 
          lag -= simFrameDuration;
        }

        //Rendering
        let lagOffset = lag / simFrameDuration;
        if (timestamp >= renderStart) {
          if (!ctx) throw new Error("error, canvas 2d context not found");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.imageSmoothingEnabled = false;

          drawSprite(ctx, spOrca.background, imgScale);
          drawSprite(ctx, spOrca.body, imgScale);
          drawSprite(ctx, spOrca.hat, imgScale);
          drawSprite(ctx, spOrca.mouth, imgScale);
          drawSprite(ctx, spOrca.eyes, imgScale);
          drawSprite(ctx, spOrca.accessory, imgScale);
        
          renderStart = timestamp + renderFrameDuration;
        }
        previous = timestamp;
      }
      //Cleanup function triggers when useLayoutEffect is called again.
      return () => cancelAnimationFrame(timerId);
    }
  }, [canvasRef, orca]);

  return (
    <div
      css={css`
        padding: 5px 5px 0px 5px;
        border: 3px solid #1d257a;
      `}
    >
      <canvas
        ref={canvasRef}>
      </canvas>
    </div>
  );
}