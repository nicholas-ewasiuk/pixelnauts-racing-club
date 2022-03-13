import { PublicKey } from "@saberhq/solana-contrib";
import { useSolana } from '@saberhq/use-solana';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { 
  Metadata,
  MetadataData, 
} from '@metaplex-foundation/mpl-token-metadata';
import axios from 'axios';
import { INFT } from './helpers';
import { deserializeTokenAccount, deserializeTokenMint } from './helpers/spl-token';
import { okToFailAsync } from './helpers/util';
import { Connection } from "@solana/web3.js";

interface IToken {
  mint: PublicKey;
  address: PublicKey;
  metadataPDA?: PublicKey;
  metadataOnchain?: MetadataData;
}

const getTokensByOwner = async (owner: PublicKey, connection: Connection): Promise<IToken[]> => {
  const tokens = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });
  // initial filter - only tokens with 0 decimals & of which 1 is present in the wallet
  return tokens.value
    .filter((t) => {
      const amount = t.account.data.parsed.info.tokenAmount;
      return amount.decimals === 0 && amount.uiAmount === 1;
    })
    .map((t) => ({
      address: new PublicKey(t.pubkey),
      mint: new PublicKey(t.account.data.parsed.info.mint),
    }));
}

const getMetadataByMint = async (
  mint: PublicKey,
  connection: Connection,
  metadataPDA?: PublicKey,
  metadataOnchain?: MetadataData
) => {
  const pda = metadataPDA ?? (await Metadata.getPDA(mint));
  const onchain = metadataOnchain ?? (await Metadata.load(connection, pda)).data;
  const metadataExternal = (await axios.get(onchain.data.uri)).data;
  return {
    metadataPDA: pda,
    metadataOnchain: onchain,
    metadataExternal,
  };
}

const tokensToEnrichedNFTs = async (tokens: IToken[], connection: Connection): Promise<INFT[]> => {
  return Promise.all(
    tokens.map(async (t) =>
      // console.log(`Processing Mint ${t.mint}`)
      ({
        mint: t.mint,
        address: t.address,
        splTokenInfo: await okToFailAsync(deserializeTokenAccount, [t.mint, t.address, connection]),
        splMintInfo: await okToFailAsync(deserializeTokenMint, [t.mint, connection]),
        ...(await okToFailAsync(
          getMetadataByMint,
          [t.mint, connection, t.metadataPDA, t.metadataOnchain],
          true
        )),
      })
    )
  );
}

export const NFTGet = async (owner: PublicKey, connection: Connection): Promise<INFT[]> => {
  let tokens: IToken[] = [];
  try {
    tokens = await getTokensByOwner(owner, connection);
  } catch (e) {
    console.log(e);
  }
  if (tokens.length === 0) {
    throw new Error("No NFTs found");
  }
  const nfts = await tokensToEnrichedNFTs(tokens, connection);

  return nfts;
}


/*
  - Tweak tokensToEnrichedNFTs so only runs for Orcanauts
  - Passing connection through everything, figure out cleaner way later?
 */