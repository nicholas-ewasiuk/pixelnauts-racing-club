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
  readonly img: HTMLImageElement
  readonly sWidth: number
  readonly sHeight: number
  readonly dx: number
  readonly dy: number
  frame: number
}

export interface OrcaSprite {
  background: SpriteSheet
  body: SpriteSheet
  hat: SpriteSheet
  mouth: SpriteSheet
  eyes: SpriteSheet
  accessory: SpriteSheet
}
