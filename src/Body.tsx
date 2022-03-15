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

  const { connection } = useSolana();
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

  return (
    <AppWrapper>
      { !isPlaying &&
        <>
          <div
            css={css`
              display: flex;
              justify-content: center;
            `}
          >
            <p
              css={css`
                font-size: 32px
              `}
            >
              Welcome to<br></br>Pixelnauts Racing Club!
            </p>
          </div>
          <WalletButton 
            wallet={wallet}
            orcas={orcas}
          />
        </>
      }
      { orcas && !isPlaying &&
        <>
          <div
            css={css`
              display: flex;
              flex-direction: row;
              justify-content: space-evenly;
              align-items: center;
              margin: 20px 0 20px 0;
              width: 500px;
            `}
          >
            <button
              css={[button, small]}
              onClick={selectPrevious}
            >
              Previous
            </button>
            <SelectOrcaMenu orca={orcas[index]} />
            <button 
              css={[button, small]}
              onClick={selectNext}
            >
              Next
            </button>
          </div>
          <button
            css={[button, small]}
            onClick={startRace}
          >
            Choose
          </button>
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

const button = css`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  outline: none;
  border-style: solid;
  border-color: #1d257a;
  box-shadow: none;
  border-radius: 0px;
  width: 200px;
  height: 40px;
  background: inherit;
  font-size: 20px;
  font-family: 'DotGothic16', sans-serif;
  font-weight: inherit;
  color: #1d257a;
  &:hover {
    background: ${lighten(0.1, "#1d257a")};
  }
`;

const small = css`
  width: 100px;
  height: 40px;
`;

/*
  Attributions todo:
    ilmoi - NFT fetching code example
    javidx9 - collisions game logic frame rate limits etc
    pixelnauts - artwork
    franks labratory - "How to make a Game with Javascript and HTML Canvas"
*/