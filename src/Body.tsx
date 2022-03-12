/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useState } from "react";
import styled from '@emotion/styled';
import { MetadataData } from '@metaplex-foundation/mpl-token-metadata';
import { ModdedWalletButton } from "./components/ModdedWalletButton";
import { useConnectedWallet, useSolana } from "@saberhq/use-solana";
import { PublicKey } from "@saberhq/solana-contrib";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const Body: React.FC = () => {
  const [ balance, setBalance ] = useState<number | null>(null);

  const { providerMut, connection, network, setNetwork } = useSolana();
  const wallet = useConnectedWallet();

  const refetchSOL = useCallback(async () => {
    if (wallet && providerMut) {
      setBalance(await providerMut.connection.getBalance(wallet.publicKey));
    }
  }, [providerMut, wallet]);

  interface IToken {
    mint: PublicKey;
    address: PublicKey;
    metadataPDA?: PublicKey;
    metadataOnchain?: MetadataData;
  }

  const getTokensByOwner = async (owner: PublicKey): Promise<IToken[]> => {
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

  const tokensToEnrichedNFTs = async (tokens: IToken[]): Promise<INFT[]> {
    
  }

  const handleClickTest = async () => {
    if(!wallet) throw Error("Wallet not connected");
    const tokens = await getTokensByOwner(wallet.publicKey);
    console.log(tokens);
  }

  useEffect(() => {
    void refetchSOL();
    console.log(network);
  }, [refetchSOL]);

  return (
    <AppWrapper>
      <h1>Hello World</h1>
      <ModdedWalletButton 
        wallet={wallet}
        balance={balance}
      />
      <button
        onClick={handleClickTest}
      >
        Button for Testing!
      </button>
    </AppWrapper>
  );
};

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;