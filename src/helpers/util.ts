/* eslint-disable no-use-before-define */
import { INFT } from ".";
import { SpriteSheet } from ".";


export async function okToFailAsync(callback: any, args: any[], wantObject = false) {
  try {
    // mandatory await here, can't just pass down (coz we need to catch error in this scope)
    return await callback(...args);
  } catch (e) {
    console.log(`Oh no! ${callback.name} called with ${args} blew up!`);
    console.log('Full error:', e);
    return wantObject ? {} : undefined;
  }
}

export function okToFailSync(callback: any, args: any[], wantObject = false) {
  try {
    return callback(...args);
  } catch (e) {
    console.log(`Oh no! ${callback.name} called with ${args} blew up!`);
    console.log('Full error:', e);
    return wantObject ? {} : undefined;
  }
}

export function filterOrcanauts(nfts: INFT[]): INFT[] {
  return nfts.filter((nft) => {
    return nft.metadataOnchain.data.symbol === "ORCANAUT";
  })
}

export function pixelateOrcas(nfts: INFT[]) {
  return nfts.map((nft) => {
    const { 
      metadataExternal: 
        { attributes: [
          {value: bg}, 
          {value: body}, 
          {value: hats}, 
          {value: mouth}, 
          {value: eyes}, 
          {value: accessory}
        ] 
      } 
    } = nft;
    return [bg, body, hats, mouth, eyes, accessory]
      .map((item) => {
        return item.toLowerCase()
          .replaceAll('-',' ')
          .replaceAll(',','')
          .replaceAll(' ','_');
    })
  });
}

export function newSprite(
  src: string, 
  width: number, 
  height: number, 
  dx: number, 
  dy: number
) : SpriteSheet {
  const img = new Image();
  img.src = src;
  const sprite: SpriteSheet = {
    img: img,
    sWidth: width,
    sHeight: height,
    dx: dx,
    dy: dy,
    frame: 0
  };
  return sprite;
}

export function drawSprite(
  ctx: CanvasRenderingContext2D, 
  sprite: SpriteSheet, 
  scale: number = 1,
  px: number = 0,
  py: number = 0,
) {
  ctx.drawImage(
   sprite.img,
   sprite.frame * sprite.sWidth,
   0,  
   sprite.sWidth,
   sprite.sHeight,
   px + sprite.dx * scale,
   py + sprite.dy * scale,
   sprite.sWidth * scale,
   sprite.sHeight * scale
  );
}