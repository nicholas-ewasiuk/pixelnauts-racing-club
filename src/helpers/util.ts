import { INFT, OrcaSprite } from ".";
import { Sprite } from ".";
import { EE, IUpdateLoadingParams, LoadStatus } from "./loading";

export function filterOrcanauts(nfts: INFT[]): INFT[] {
  const orcas = nfts.filter((nft) => {
    if (nft.metadataOnchain) {
      return nft.metadataOnchain.data.symbol === "ORCANAUT";
    }
  });
  if (!orcas.length) {
    EE.emit('loading', {
      newStatus: LoadStatus.Error,
      newProgress: 100,
      maxProgress: 100,
      newText: `No Orcanauts found. Would you like to use the training dolphin?`,
    } as IUpdateLoadingParams);
  }
  return orcas;
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
  scale: number = 1,
  px: number = 0,
  py: number = 0,
  radius: number = width >= height ? height/2*scale-2 : width/2*scale-2,
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
    scale: scale,
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
  offsetX: number = 0,
  offsetY: number = 0,
) {
  ctx.drawImage(
   sprite.img,
   sprite.frame * sprite.width,
   0,  
   sprite.width,
   sprite.height,
   sprite.px - offsetX + sprite.dx * sprite.scale,
   sprite.py - offsetY + sprite.dy * sprite.scale,
   sprite.width * sprite.scale,
   sprite.height * sprite.scale
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
  scale: number = 1,
  px: number = 0,
  py: number = 0,
) : OrcaSprite {
  const bgWidth = 40;
  const orca: OrcaSprite = {
    background: newSprite(background,bgWidth,40,0,0,speed,scale),
    body: newSprite(body,32,19,2,16,speed,scale),
    hat: newSprite(hat,28,36,8,4,speed,scale),
    mouth: newSprite(mouth,28,20,8,16,speed,scale),
    eyes: newSprite(eyes,24,32,12,4,speed,scale),
    accessory: newSprite(accessory,40,40,0,0,speed,scale),
    speed: speed,
    scale: scale,
    px: px,
    py: py,
    radius: bgWidth/2-2,
  };
  return orca;
}

export function drawOrcaGameSprite(
  ctx: CanvasRenderingContext2D,
  orcaSprite: OrcaSprite,
  offsetX: number = 24*orcaSprite.scale,
  offsetY: number = 25*orcaSprite.scale
) {
  drawSprite(ctx, orcaSprite.body, -orcaSprite.px+offsetX, -orcaSprite.py+offsetY);
  drawSprite(ctx, orcaSprite.eyes, -orcaSprite.px+offsetX, -orcaSprite.py+offsetY);
  drawSprite(ctx, orcaSprite.mouth, -orcaSprite.px+offsetX, -orcaSprite.py+offsetY);
  drawSprite(ctx, orcaSprite.hat, -orcaSprite.px+offsetX, -orcaSprite.py+offsetY);
}

export function drawOrcaMenuSprite(
  ctx: CanvasRenderingContext2D,
  orcaSprite: OrcaSprite,
) {
  drawSprite(ctx, orcaSprite.background, orcaSprite.px, orcaSprite.py);
  drawSprite(ctx, orcaSprite.body, orcaSprite.px, orcaSprite.py);
  drawSprite(ctx, orcaSprite.eyes, orcaSprite.px, orcaSprite.py);
  drawSprite(ctx, orcaSprite.mouth, orcaSprite.px, orcaSprite.py);
  drawSprite(ctx, orcaSprite.hat, orcaSprite.px, orcaSprite.py);
  drawSprite(ctx, orcaSprite.accessory, orcaSprite.px, orcaSprite.py);
}

export function spawnEnemies(
  amount: number,
  src: string[],
  width: number,
  height: number,
  dx: number,
  dy: number,
  speed: number,
  scale: number,
  spawnPx: [number, number],
  spawnPy: [number, number],
  radius: number
) {
  const sprites: Sprite[] = [];
  const index = Math.floor(amount/src.length);
  function spawn(i: number) {
    const px = Math.random() * (spawnPx[1]-spawnPx[0]) + spawnPx[0];
    const py = Math.random() * (spawnPy[1]-spawnPy[0]) + spawnPy[0];
    sprites.push(newSprite(
      src[i],
      width,
      height,
      dx,
      dy,
      speed,
      scale,
      px,
      py,
      radius
    ));
  }
  if (amount > src.length) {
    for (let i = 0; i < src.length; i++) {
      for (let j = 0; j < index; j++) {
        spawn(i);
      }
    }
    for (let i = 0; i < amount%src.length; i++) {
      spawn(i);
    }
  }
  if (amount <= src.length) {
    for (let i = 0; i < amount; i++) {
      spawn(i);
    }
  }
  return sprites;
}