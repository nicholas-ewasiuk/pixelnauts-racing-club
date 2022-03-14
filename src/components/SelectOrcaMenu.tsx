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

      canvas.width = 600;
      canvas.height = 300;

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
      //const Hat = new Image();
      const Mouth = new Image();
      const Eyes = new Image();
      //const Accessory = new Image();

      Body.src = body[sBody];
      //Hat.src = hat[sHat];
      Mouth.src = mouth[sMouth];
      Eyes.src = eyes[sEyes];
      //Accessory.src = accessory[sAccessory];
      //Need Error handling for "none" condition.

      const spriteOffsetX = 24;
      const spriteOffsetY = 25;

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

          lag -= simFrameDuration;
        }

        //Rendering
        let lagOffset = lag / simFrameDuration;
        if (timestamp >= renderStart) {
          if (!ctx) throw new Error("error, canvas 2d context not found");
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.drawImage(
            Body,
            0,
            0,
            32,
            19,
            150 + 2 - spriteOffsetX,
            150 + 16 - spriteOffsetY,
            32,
            19
          );
          ctx.drawImage(
            Eyes,
            0,
            0,
            24,
            32,
            150 + 12 - spriteOffsetX,
            150 + 4 - spriteOffsetY,
            24,
            32
          );
          ctx.drawImage(
            Mouth,
            0,
            0,
            28,
            20,
            150 + 8 - spriteOffsetX,
            150 + 16 - spriteOffsetY,
            28,
            20
          );
          /*
          ctx.drawImage(
            Hat,
            0,
            0,
            28,
            36,
            8 - spriteOffsetX,
            4 - spriteOffsetY,
            28,
            36
          );
          */
        
          /* fix beach ball bug
          ctx.drawImage(
            Accessory,
            0,
            0,
            40,
            40,
            player.px - spriteOffsetX,
            player.py - spriteOffsetY,
            40,
            40
          );
          */
        
          renderStart = timestamp + renderFrameDuration;
        }
        previous = timestamp;
      }
  
      //Cleanup function triggers when useLayoutEffect is called again.
      return () => cancelAnimationFrame(timerId);
    }
  }, [canvasRef, orca]);

  return (
    <canvas
      ref={canvasRef}>
    </canvas>
  );
}