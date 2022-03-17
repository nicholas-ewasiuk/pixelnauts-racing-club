/* eslint-disable no-use-before-define */
import { INFT, OrcaSprite } from ".";
import { Sprite } from ".";


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
  dy: number,
  speed: number = 1,
  px: number = 0,
  py: number = 0,
  radius: number = width >= height ? height/2-2 : width/2-2,
  frame: number = 0,
) : Sprite {
  const img = new Image();
  img.src = src;
  const sprite: Sprite = {
    img: img,
    width: width,
    height: height,
    dx: dx,
    dy: dy,
    speed: speed,
    px: px,
    py: py,
    radius: radius,
    frame: frame
  };
  return sprite;
}

export function drawSprite(
  ctx: CanvasRenderingContext2D, 
  sprite: Sprite, 
  scale: number = 1,
  offsetX: number = 0,
  offsetY: number = 0,
) {
  ctx.drawImage(
   sprite.img,
   sprite.frame * sprite.width,
   0,  
   sprite.width,
   sprite.height,
   sprite.px - offsetX + sprite.dx * scale,
   sprite.py - offsetY + sprite.dy * scale,
   sprite.width * scale,
   sprite.height * scale
  );
}

export function newOrcaSprite(
  background: any, 
  body: any,
  hat: any,
  mouth: any,
  eyes: any,
  accessory: any,
  speed: number = 0,
  px: number = 0,
  py: number = 0,
) : OrcaSprite {
  const bgWidth = 40;
  const orca: OrcaSprite = {
    background: newSprite(background,bgWidth,40,0,0,speed),
    body: newSprite(body,32,19,2,16,speed),
    hat: newSprite(hat,28,36,8,4,speed),
    mouth: newSprite(mouth,28,20,8,16,speed),
    eyes: newSprite(eyes,24,32,12,4,speed),
    accessory: newSprite(accessory,40,40,0,0,speed),
    speed: speed,
    px: px,
    py: py,
    radius: bgWidth/2-2,
  };
  return orca;
}

export function drawGameOrcaSprite(
  ctx: CanvasRenderingContext2D,
  orcaSprite: OrcaSprite,
  scale: number = 1,
  offsetX: number = 24*scale,
  offsetY: number = 25*scale
) {
  drawSprite(ctx, orcaSprite.body, scale, -orcaSprite.px+offsetX, -orcaSprite.py+offsetY);
  drawSprite(ctx, orcaSprite.eyes, scale, -orcaSprite.px+offsetX, -orcaSprite.py+offsetY);
  drawSprite(ctx, orcaSprite.mouth, scale, -orcaSprite.px+offsetX, -orcaSprite.py+offsetY);
  drawSprite(ctx, orcaSprite.hat, scale, -orcaSprite.px+offsetX, -orcaSprite.py+offsetY);
}

export function drawMenuOrcaSprite(
  ctx: CanvasRenderingContext2D,
  orcaSprite: OrcaSprite,
  scale: number = 1,
) {
  drawSprite(ctx, orcaSprite.background, scale, orcaSprite.px, orcaSprite.py);
  drawSprite(ctx, orcaSprite.body, scale, orcaSprite.px, orcaSprite.py);
  drawSprite(ctx, orcaSprite.eyes, scale, orcaSprite.px, orcaSprite.py);
  drawSprite(ctx, orcaSprite.mouth, scale, orcaSprite.px, orcaSprite.py);
  drawSprite(ctx, orcaSprite.hat, scale, orcaSprite.px, orcaSprite.py);
  drawSprite(ctx, orcaSprite.accessory, scale, orcaSprite.px, orcaSprite.py);
}