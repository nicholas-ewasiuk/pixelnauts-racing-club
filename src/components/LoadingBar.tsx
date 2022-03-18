import { Connection, PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { NFTGet } from "../actions/NFTget";
import { EE, IUpdateLoadingParams, LoadStatus } from "../helpers/loading";


export const LoadingBar: React.FC = () => {
  const [ status, setStatus ] = useState<LoadStatus>(LoadStatus.Idle);
  const [ progress, setProgress ] = useState<number>(0);
  const [ maxProgress, setMaxProgress ] = useState<number>(0);
  const [ text, setText ] = useState<string>("Loading...");

  /*
  let currentVersion = 0;

  const startTicking = (max: number, passedVersion: number) => {
    const counter = useInterval()
    watchAtMost(
      counter,
      () => {
        // if for some reason progress bar jumps above, we don't want to keep incrementing
        // also use versioning to stop old counters
        if (progress.value > max || passedVersion !== currentVersion) {
          return;
        }
        progress.value += 2;
      },
      // this ensures we stop after required number of times
      { count: Math.max(max - progress.value, 0) }
    );
  };
  */

  const updateLoading = (
    {newStatus, newProgress, maxProgress, newText} = {} as IUpdateLoadingParams
  ) => {
    setStatus(newStatus);
    setProgress(newProgress);
    setText(newText);
    //currentVersion += 1;
    //startTicking(maxProgress, currentVersion);
  };


  const fetchNFTs = (owner: PublicKey, connection: Connection) => {
    updateLoading({
      newStatus: LoadStatus.Loading,
      newProgress: 0,
      maxProgress: 50,
      newText: 'Looking for NFTs... ETA: <1 min',
    })
    EE.on('loading', updateLoading);

    NFTGet(owner, connection)
  }

  useEffect(() => {

  },[])
  return(
    <></>
  )
}