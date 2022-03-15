/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { lighten } from 'polished';
import { ConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { breakpoints } from '../App';


type Props = {
  wallet: ConnectedWallet | null,
  orcas: string[][] | null,
}

export const WalletButton = ({ wallet, orcas }: Props) => {
  const [ loadingMsg, setLoadingMsg ] = useState<string>("Looking for Orcanauts...");
  const { connect } = useWalletKit();

  useEffect(() => {
    if (wallet) {
      setTimeout(() => {setLoadingMsg("No Orcanauts Found :(")}, 10000);
    }
  }, [wallet])

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
          font-size: 24px;
        `}
      >
        {loadingMsg}
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
  @media (max-width: 576px) {
    margin: 0 20px 0 0;
    width: 140px;
    height: 60px;
  }
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

const connected = css`
  background: inherit;
  font-weight: inherit;
  font-size: 20px;
  &:hover {
    background: ${lighten(0.1, "#1d257a")};
  }
`

