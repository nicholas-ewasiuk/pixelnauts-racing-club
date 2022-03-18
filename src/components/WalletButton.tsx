/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { ConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { LoadStatus } from '../helpers/loading';

type Props = {
  wallet: ConnectedWallet | null,
  orcas: string[][] | null,
  text: string,
  status: LoadStatus,
}

export const WalletButton = ({ wallet, orcas, text, status }: Props) => {
  const { connect } = useWalletKit();

  return (
    <>
    { !wallet &&
      <button
        css={button}
        onClick={connect}
      >
        Connect Wallet
      </button>
    }
    { wallet &&
      <button 
        css={[button, connected]}
      >
        Connected
      </button>
    }
    { wallet && !orcas &&
      <p
        css={css`
          margin: 100px 0 100px 0;
          width: 300px;
          height: 150px;
          text-align: center;
          font-size: 20px;
        `}
      >
        {text}
      </p>
    }
    </>
  )
}

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
    background: #ededed;
  }
`;

const connected = css`
  width: 150px;
  background: inherit;
  font-weight: inherit;
  font-size: 20px;
  &:hover {
    background: #ededed;
  }
`

