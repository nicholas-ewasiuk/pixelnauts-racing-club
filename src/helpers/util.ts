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