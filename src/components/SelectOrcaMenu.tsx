/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useLayoutEffect, useRef, useState } from 'react';
import accessory from '../assets/pixelnauts/accessory';
import background from '../assets/pixelnauts/background';
import body from '../assets/pixelnauts/body';
import eyes from '../assets/pixelnauts/eyes';
import hat from '../assets/pixelnauts/hat';
import mouth from '../assets/pixelnauts/mouth';


type Props = {
  orca: string[],
}

export const SelectOrcaMenu = ({ orca }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    if (canvasRef.current) {
      //Initial state
      let timerId: number;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = 160;
      canvas.height = 160;

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

      const Background = new Image();
      const Body = new Image();
      const Hat = new Image();
      const Mouth = new Image();
      const Eyes = new Image();
      const Accessory = new Image();

      Background.src = background[sBg];
      Body.src = body[sBody];
      Hat.src = hat[sHat];
      Mouth.src = mouth[sMouth];
      Eyes.src = eyes[sEyes];
      Accessory.src = accessory[sAccessory];
      //Need Error handling for "none" condition. 
      //okay just used the holiday items as placeholder for now.

      const imgScale = 4;

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

          lag -= simFrameDuration;
        }

        //Rendering
        let lagOffset = lag / simFrameDuration;
        if (timestamp >= renderStart) {
          if (!ctx) throw new Error("error, canvas 2d context not found");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.imageSmoothingEnabled = false;

          ctx.drawImage(
            Background,
            0,
            0,
            40,
            40,
            0 + imgScale,
            0 + imgScale,
            40 * imgScale,
            40 * imgScale
          )
          ctx.drawImage(
            Body,
            0,
            0,
            32,
            19,
            0 + 2 * imgScale,
            0 + 16 * imgScale,
            32 * imgScale,
            19 * imgScale
          );
          ctx.drawImage(
            Eyes,
            0,
            0,
            24,
            32,
            0 + 12 * imgScale,
            0 + 4 * imgScale,
            24 * imgScale,
            32 * imgScale
          );
          ctx.drawImage(
            Mouth,
            0,
            0,
            28,
            20,
            0 + 8 * imgScale,
            0 + 16 * imgScale,
            28 * imgScale,
            20 * imgScale
          );
          ctx.drawImage(
            Hat,
            0,
            0,
            28,
            36,
            0 + 8 * imgScale,
            0 + 4 * imgScale,
            28 * imgScale,
            36 * imgScale
          );
          ctx.drawImage(
            Accessory,
            0,
            0,
            40,
            40,
            0 + imgScale,
            0 + imgScale,
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
  }, [canvasRef, orca]);

  return (
    <div
      css={css`
        padding: 3px 8px 2px 3px;
        border: 3px solid #1d257a;
      `}
    >
      <canvas
        ref={canvasRef}>
      </canvas>
    </div>
  );
}