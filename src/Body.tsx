/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useState } from "react";
import styled from '@emotion/styled';
import { ModdedWalletButton } from "./components/ModdedWalletButton";
import { useConnectedWallet, useSolana } from "@saberhq/use-solana";
import { NFTGet } from "./NFTget";
import { INFT } from "./helpers";
import { Canvas } from "./components/Canvas";

export const Body: React.FC = () => {
  const [ balance, setBalance ] = useState<number | null>(null);
  const [ nfts, setNFTs ] = useState<INFT[] | null >(null);
  const [ myOrca, setMyOrca ] = useState<INFT | null>(null);

  const { providerMut, connection, network, setNetwork } = useSolana();
  const wallet = useConnectedWallet();

  const refetchSOL = useCallback(async () => {
    if (wallet && providerMut) {
      setBalance(await providerMut.connection.getBalance(wallet.publicKey));
    }
  }, [providerMut, wallet]);

  const handleClickTest = async () => {
    if(!wallet) throw Error("Wallet not connected");
    const nfts = await NFTGet(wallet.publicKey, connection);
    setNFTs(nfts);
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
      <Canvas />
    </AppWrapper>
  );
};

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/*
Displaying the orcas component 
  NFT display that takes nfts, filters the orcanauts,
  and user can select the one to use. Orca nfts display can be opened and closed,
  and can set new orca in between games.
*/
