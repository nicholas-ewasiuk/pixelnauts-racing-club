/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { WalletButton } from "./components/WalletButton";
import { useConnectedWallet, useSolana } from "@saberhq/use-solana";
import { NFTGet } from "./actions/NFTget";
import { GameCanvas } from "./components/GameCanvas";
import { filterOrcanauts, pixelateOrcas } from "./helpers/util";
import { lighten } from "polished";
import { SelectOrcaMenu } from "./components/SelectOrcaMenu";
import sound from "url:./assets/main-theme.mp3"

export const Body: React.FC = () => {
  const [ orcas, setOrcas ] = useState<string[][] | null>(null);
  const [ index, setIndex ] = useState<number>(0);
  const [ isPlaying, setIsPlaying ] = useState<boolean>(false);
  const [ isHelpOpen, setIsHelpOpen ] = useState<boolean>(false);

  const { connection } = useSolana();
  const wallet = useConnectedWallet();

  const audioRef = useRef(null);

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

  const playWithout = () => {
    setOrcas([['tokyo','orca','astronaut_helmet','smirk','droopy','none']]);
  }

  const handleAudioClick = () => {
    const audio = audioRef;
    audio.current.play();
  }

  const refetchOrcas = useCallback(async () => {
    if (wallet) {
      const nfts = await NFTGet(wallet.publicKey, connection)
      //Fetching external metadata for all NFTs in wallet is inefficient if just looking for orcas.
      //Need to tweak this at some point.
      const orcaMetadata = filterOrcanauts(nfts);
      const orcas = pixelateOrcas(orcaMetadata);
      console.log(orcas);
      if (orcas.length) {
        setOrcas(orcas);
      }
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
      {!isPlaying && !wallet && 
        <button
          css={[button]}
          onClick={playWithout}
        >
          Just Play
        </button>
      }
      { orcas && !isPlaying &&
        <>
          <div
            css={css`
              display: flex;
              flex-direction: row;
              justify-content: space-evenly;
              align-items: center;
              margin: 35px 0 35px 0;
              width: 650px;
            `}
          >
            <button
              css={[button, small]}
              onClick={selectPrevious}
            >
              Previous
            </button>
            <SelectOrcaMenu orcaTraits={orcas[index]} />
            <button 
              css={[button, small]}
              onClick={selectNext}
            >
              Next
            </button>
          </div>
          <button
            css={[button]}
            onClick={startRace}
          >
            Choose
          </button>
        </>
      }
      { wallet && !isPlaying &&
        <button
          css={[button, small]}
          onClick={() => setIsHelpOpen(!isHelpOpen)}
        >
          Help
        </button>
      }
      { isHelpOpen && !isPlaying &&
        <p 
          css={css`
            text-align: center;
            font-size: 24px
          `}
        >
          This game requires an Orcanaut to play.<br></br>
          You can adopt one at <a href="https://magiceden.io/marketplace/orcanauts">Magic Eden</a>.<br></br>
          Arrow keys to move<br></br>
          Esc to pause
        </p>
      }
      { isPlaying && orcas &&
        <GameCanvas orcaTraits={orcas[index]}/>
      }
      <audio
        ref={audioRef}
        src={sound}
      />
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
  margin: 10px 0 10px 0;
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