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

export interface Sprite {
  readonly img: HTMLImageElement
  readonly width: number
  readonly height: number
  readonly dx: number
  readonly dy: number
  speed: number
  px: number
  py: number
  radius: number
  frame: number
}

export interface OrcaSprite {
  readonly background: Sprite
  readonly body: Sprite
  readonly hat: Sprite
  readonly mouth: Sprite
  readonly eyes: Sprite
  readonly accessory: Sprite
  speed: number
  px: number
  py: number
  radius: number
}
