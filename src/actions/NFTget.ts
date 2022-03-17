import { PublicKey } from "@saberhq/solana-contrib";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { 
  Metadata,
  MetadataData, 
} from '@metaplex-foundation/mpl-token-metadata';
import axios from 'axios';
import { INFT } from '../helpers';
import { deserializeTokenAccount, deserializeTokenMint } from '../helpers/spl-token';
import { okToFailAsync } from '../helpers/error';
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
MIT License

Copyright (c) 2021 ilmoi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/