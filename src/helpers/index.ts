import { PublicKey } from '@solana/web3.js';
import { AccountInfo, MintInfo } from '@solana/spl-token';
import { MetadataData } from '@metaplex-foundation/mpl-token-metadata'

export interface INFT {
  // spl stuff
  mint: PublicKey;
  address: PublicKey;
  splTokenInfo?: AccountInfo;
  splMintInfo?: MintInfo;
  // metadata stuff
  metadataPDA?: PublicKey;
  metadataOnchain: MetadataData;
  metadataExternal?: any; 
}

export interface SpriteSheet {
  src: string;
  image: HTMLImageElement;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}
