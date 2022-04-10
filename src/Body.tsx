/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { WalletButton } from "./components/WalletButton";
import { useConnectedWallet, useSolana } from "@saberhq/use-solana";
import { Network } from '@saberhq/solana-contrib';
import { NFTGet } from "./actions/NFTget";
import { GameCanvas } from "./components/GameCanvas";
import { filterOrcanauts, pixelateOrcas } from "./helpers/util";
import { SelectOrcaMenu } from "./components/SelectOrcaMenu";
import { EE, ERR_NO_NFTS, IUpdateLoadingParams, LoadStatus } from "./helpers/loading";


export const Body: React.FC = () => {
  const [ orcas, setOrcas ] = useState<string[][] | null>(null);
  const [ index, setIndex ] = useState<number>(0);
  const [ isPlaying, setIsPlaying ] = useState<boolean>(false);
  const [ isHelpOpen, setIsHelpOpen ] = useState<boolean>(false);

  const [ loadingText, setLoadingText ] = useState<string>("Loading...");
  const [ status, setStatus ] = useState<LoadStatus>(LoadStatus.Idle)

  const { connection, network, setNetwork, setEndpoints } = useSolana();
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

  const playWithout = () => {
    setOrcas([['river','dolphin','none','smile','droopy','none']]);
  }

  const updateLoading = (
    {newStatus, newText} = {} as IUpdateLoadingParams
  ) => {
    setStatus(newStatus);
    setLoadingText(newText);
  };

  const updateLoadingStdErr = (e: Error) => {
    updateLoading({
      newStatus: LoadStatus.Error,
      newProgress: 0,
      maxProgress: 0,
      newText: `Uh oh something went wrong - ${e}`,
    });
  };

  const updateLoadingStdWin = () => {
    updateLoading({
      newStatus: LoadStatus.Success,
      newProgress: 0,
      maxProgress: 0,
      newText: 'Successfully loaded!',
    });
  };

  const refetchOrcas = useCallback(async () => {
    if (wallet) {
      updateLoading({
        newStatus: LoadStatus.Loading,
        newProgress: 0,
        maxProgress: 50,
        newText: 'Looking for NFTs... ETA: <1 min',
      })
      EE.removeAllListeners();
      EE.on('loading', updateLoading);
      const nfts = await NFTGet(wallet.publicKey, connection)
        .then((fetchedNFTs) => {
          if (fetchedNFTs.length) {
            updateLoadingStdWin();
            return fetchedNFTs;
          } else {
            updateLoadingStdErr(ERR_NO_NFTS);
          }
        })
        .catch(updateLoadingStdErr);
      //Fetching external metadata for all NFTs in wallet is inefficient if just looking for orcas.
      //Need to tweak this at some point.
      if (nfts) {
        const orcaMetadata = filterOrcanauts(nfts);
        const orcas = pixelateOrcas(orcaMetadata);
        console.log(orcas);
        if (orcas.length) {
          setOrcas(orcas);
        }
      }
    }
  }, [wallet]);

  useEffect(() => {
    void refetchOrcas();
  }, [refetchOrcas]);

  useEffect(() => {
    setEndpoints({
      name: "genesysgo",
      endpoint: "https://ssc-dao.genesysgo.net/"
    } as any);
    setNetwork("mainnet-beta");
    console.log(network);
  }, [wallet]);

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
              text={loadingText}
              status={status}
            />
        </>
      }
      {!isPlaying && !orcas && 
        <button
          css={[button, tall]}
          onClick={playWithout}
        >
          Borrow Training Dolphin
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
      { orcas && !isPlaying &&
        <button
          css={[button, small]}
          onClick={() => setIsHelpOpen(!isHelpOpen)}
        >
          Help
        </button>
      }
      { isHelpOpen && !isPlaying &&
        <ul 
          css={css`
            list-style: none;
            text-align: center;
            font-size: 24px
          `}
        >
          <li>This game utilizes the Orcanauts NFTs</li>
          <li>You can adopt one at <a href="https://magiceden.io/marketplace/orcanauts">Magic Eden</a></li>
          <li>Use Arrow / W A S D keys to move</li>
          <li>Avoid the rugs!</li>
        </ul>
      }
      { isPlaying && orcas &&
        <GameCanvas orcaTraits={orcas[index]}/>
      }
      <p 
        css={css`
          position: absolute;
          bottom: 0;`
        }
      >
        Open-Source on <a href="https://github.com/nicholas-ewasiuk/pixelnauts-racing-club">Github</a>
      </p>
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
    background: #ededed;
  }
`;

const small = css`
  width: 100px;
  height: 40px;
`;

const tall = css`
  width: 200px;
  height: 80px;
`;