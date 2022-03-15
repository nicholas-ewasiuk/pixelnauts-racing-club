/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useState } from "react";
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { WalletButton } from "./components/WalletButton";
import { useConnectedWallet, useSolana } from "@saberhq/use-solana";
import { NFTGet } from "./actions/NFTget";
import { GameCanvas } from "./components/GameCanvas";
import { filterOrcanauts, pixelateOrcas } from "./helpers/util";
import { lighten } from "polished";
import { SelectOrcaMenu } from "./components/SelectOrcaMenu";

export const Body: React.FC = () => {
  const [ orcas, setOrcas ] = useState<string[][] | null>(null);
  const [ index, setIndex ] = useState<number>(0);
  const [ isPlaying, setIsPlaying ] = useState<boolean>(false);

  const { providerMut, connection, network, setNetwork } = useSolana();
  const wallet = useConnectedWallet();

  const startRace = () => {
    setIsPlaying(!isPlaying);
  };

  const selectPrevious = () => {
    if (index > 0) {
      setIndex(x => x - 1);
    }
  };

  const selectNext = () => {
    if (orcas) {
      if (index < orcas.length - 1) {
        setIndex(x => x + 1);
      }
    }
  };

  const refetchOrcas = useCallback(async () => {
    if (wallet) {
      const nfts = await NFTGet(wallet.publicKey, connection)
      const orcaMetadata = filterOrcanauts(nfts);
      const orcas = pixelateOrcas(orcaMetadata);
      setOrcas(orcas);
      console.log(orcas);
    }
  }, [wallet]);

  useEffect(() => {
    void refetchOrcas();
  }, [refetchOrcas]);

  /*
  useEffect(() => {
    if (wallet) {
      const orcas = filterOrcanauts(nfts);
      const traits = pixelateOrcas(orcas);
      console.log(traits[0])
    }
  }, [wallet]);
  */

  return (
    <AppWrapper>
      <p
        css={css`
          width: 200px;
          font-size: 32px
        `}
      >
        Welcome to Pixelnauts Racing Club
      </p>
      <WalletButton 
        wallet={wallet}
      />
      { orcas && !isPlaying &&
        <>
        <Button
          onClick={startRace}
        >
          <span>Race!</span>
        </Button>
        <div>
          <button onClick={selectPrevious}>
            Previous
          </button>
          <SelectOrcaMenu orca={orcas[index]} />
          <button onClick={selectNext}>
            Next
          </button>
        </div>
        </>
      }
      { isPlaying && orcas &&
        <GameCanvas orca={orcas[index]}/>
      }
    </AppWrapper>
  );
};

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  outline: none;
  border-style: solid;
  border-color: #1d257a;
  @media (max-width: 576px) {
    width: 140px;
    height: 60px;
  }
  box-shadow: none;
  border-radius: 0px;
  width: 200px;
  height: 40px;
  background: inherit;
  color: #1d257a;
  &:hover {
    background: ${lighten(0.1, "#1d257a")};
  }
  & > span {
    font-size: 20px;
    font-family: 'DotGothic16', sans-serif;
    font-weight: inherit;
  }
`;

/*
Displaying the orcas component 
  NFT display that takes nfts, filters the orcanauts,
  and user can select the one to use. Orca nfts display can be opened and closed,
  and can set new orca in between games.
*/
/*
  Attributions todo:
    ilmoi - NFT fetching code example
    javidx9 - collisions game logic frame rate limits etc
    pixelnauts - artwork
    franks labratory - "How to make a Game with Javascript and HTML Canvas"
*/