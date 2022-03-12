import { PublicKey } from '@solana/web3.js';
import { AccountInfo, MintInfo } from '@solana/web3.js';
import { EditionData, MasterEditionData, MetadataData } from '@metaplex-foundation/mpl-token-metadata'

export interface INFT {
  // spl stuff
  mint: PublicKey;
  address: PublicKey;
  splTokenInfo?: AccountInfo;
  splMintInfo?: MintInfo;
  // metadata stuff
  metadataPDA?: PublicKey;
  metadataOnchain: MetadataData;
  metadataExternal?: any; // maybe one day I'll define this:)
  // edition stuff
  editionType?: string;
  editionPDA?: PublicKey;
  editionData?: EditionData;
  masterEditionPDA?: PublicKey;
  masterEditionData?: MasterEditionData;
}